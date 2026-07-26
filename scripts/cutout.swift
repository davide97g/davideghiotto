#!/usr/bin/env swift
//
//  Alpha cut-out generator — no third-party tooling.
//
//  Runs Vision's `VNGenerateForegroundInstanceMaskRequest` over a photo, keeps
//  every foreground instance, crops to their extent and writes a straight-alpha
//  PNG. Used for the portraits in `public/` (see CLAUDE.md); re-run it whenever
//  a photo changes:
//
//      swift scripts/cutout.swift <input> <output.png> [rotationDegreesClockwise]
//
//  HEIC in, PNG out. Resize and AVIF encoding are left to `sips`, which also
//  goes through ImageIO.
//

import CoreImage
import Foundation
import Vision

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data("cutout: \(message)\n".utf8))
    exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    fail("usage: cutout.swift <input> <output.png> [rotationDegreesClockwise]")
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])
let rotation = args.count > 3 ? (Int(args[3]) ?? 0) : 0

guard var image = CIImage(contentsOf: inputURL, options: [.applyOrientationProperty: true]) else {
    fail("cannot read \(inputURL.path)")
}

// Cameras write orientation as metadata; `.applyOrientationProperty` handles the
// EXIF flag, and this covers photos that need an extra manual turn on top.
switch ((rotation % 360) + 360) % 360 {
case 0: break
case 90: image = image.oriented(.right)
case 180: image = image.oriented(.down)
case 270: image = image.oriented(.left)
default: fail("rotation must be one of 0, 90, 180, 270")
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: image, options: [:])

do {
    try handler.perform([request])
} catch {
    fail("vision request failed: \(error.localizedDescription)")
}

guard let result = request.results?.first, !result.allInstances.isEmpty else {
    fail("no foreground instance found")
}

let masked: CVPixelBuffer
do {
    masked = try result.generateMaskedImage(
        ofInstances: result.allInstances,
        from: handler,
        croppedToInstancesExtent: true
    )
} catch {
    fail("masking failed: \(error.localizedDescription)")
}

let output = CIImage(cvPixelBuffer: masked)
let context = CIContext()
guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB) else { fail("no sRGB color space") }

do {
    try context.writePNGRepresentation(
        of: output,
        to: outputURL,
        format: .RGBA8,
        colorSpace: colorSpace,
        options: [:]
    )
} catch {
    fail("cannot write \(outputURL.path): \(error.localizedDescription)")
}

let size = output.extent
print("cutout: wrote \(outputURL.lastPathComponent) — \(Int(size.width))×\(Int(size.height))")
