import { createHash, randomInt } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { config } from "./config.js";

const secret = new TextEncoder().encode(config.sessionSecret);

export function hashOtp(code: string, email: string): string {
  return createHash("sha256").update(`${email}:${code}:${config.sessionSecret}`).digest("hex");
}

export function generateOtp(length = config.otpLength): string {
  const max = 10 ** length;
  return String(randomInt(0, max)).padStart(length, "0");
}

export async function signSession(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${config.sessionTtlSeconds}s`)
    .sign(secret);
}

export async function verifySession(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const email = typeof payload.email === "string" ? payload.email : payload.sub;
    if (!email || typeof email !== "string") return null;
    return { email };
  } catch {
    return null;
  }
}
