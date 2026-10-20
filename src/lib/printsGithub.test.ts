import { describe, expect, it } from "vitest";
import {
  discoverPrints,
  isPrintRepo,
  modelName,
  parseManifest,
  pickModels,
  PRINTS_TOPIC,
  rawUrl,
} from "./printsGithub";

const repo = (over: Record<string, unknown> = {}) => ({
  name: "keybordy",
  html_url: "https://github.com/davide97g/keybordy",
  description: "A macropad",
  default_branch: "main",
  pushed_at: "2026-10-15T10:00:00Z",
  topics: [PRINTS_TOPIC],
  ...over,
});

const blob = (path: string, size = 100) => ({ path, type: "blob", size });

describe("printsGithub", () => {
  it("only takes live repos carrying the topic", () => {
    expect(isPrintRepo(repo())).toBe(true);
    expect(isPrintRepo(repo({ topics: ["esp32"] }))).toBe(false);
    expect(isPrintRepo(repo({ topics: undefined }))).toBe(false);
    expect(isPrintRepo(repo({ archived: true }))).toBe(false);
  });

  it("names a part after its file", () => {
    expect(modelName("cad/out/stl/cap2_talk.stl")).toBe("Cap2 talk");
    expect(modelName("GMKtec-stand.3MF")).toBe("GMKtec stand");
  });

  it("encodes every path segment of a raw URL", () => {
    expect(rawUrl("homelab", "main", "hardware/m6 stand/a#b.3mf")).toBe(
      "https://raw.githubusercontent.com/davide97g/homelab/main/hardware/m6%20stand/a%23b.3mf"
    );
  });

  it("keeps only the well-formed parts of a manifest", () => {
    expect(
      parseManifest({
        title: " Macropad ",
        summary: { en: "EN" },
        paths: ["./cad/out/stl", 4, ""],
        models: { "cad/out/stl/deck.stl": { name: "Deck", color: "black" } },
      })
    ).toEqual({
      title: "Macropad",
      paths: ["cad/out/stl"],
      models: { "cad/out/stl/deck.stl": { name: "Deck", color: undefined } },
    });
    expect(parseManifest(null)).toEqual({});
  });

  it("lists models in scope, manifest entries first", () => {
    const tree = [
      blob("cad/out/stl/tray.stl"),
      blob("cad/out/stl/deck.stl"),
      blob("cad/out/stl-old/deck.stl"),
      blob("cad/out/plates/01.3mf"),
      blob("README.md"),
      { path: "cad/out/stl", type: "tree" },
    ];
    const models = pickModels(repo(), tree, {
      paths: ["cad/out/stl"],
      models: { "cad/out/stl/tray.stl": { name: "Tray", color: "#000000" } },
    });
    expect(models.map((m) => m.path)).toEqual(["cad/out/stl/tray.stl", "cad/out/stl/deck.stl"]);
    expect(models[0]).toMatchObject({ name: "Tray", color: "#000000", format: "stl" });
    expect(models[1]).not.toHaveProperty("color");

    expect(pickModels(repo(), tree, {}).map((m) => m.format)).toContain("3mf");
  });

  it("discovers tagged repos, reads the manifest and drops repos with no models", async () => {
    const calls: string[] = [];
    const respond = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
    const fakeFetch = async (url: string) => {
      calls.push(url);
      if (url.includes("/users/davide97g/repos")) {
        return respond([
          repo(),
          repo({ name: "homelab", pushed_at: "2026-10-18T00:00:00Z", description: null }),
          repo({ name: "untagged", topics: [] }),
          repo({ name: "empty" }),
        ]);
      }
      if (url.includes("/repos/davide97g/keybordy/git/trees")) {
        return respond({ tree: [blob("3d.json"), blob("cad/out/stl/deck.stl")] });
      }
      if (url.includes("/repos/davide97g/homelab/git/trees")) {
        return respond({ tree: [blob("hardware/m6/stand.3mf")] });
      }
      if (url.includes("/repos/davide97g/empty/git/trees")) return respond({ tree: [blob("a.md")] });
      if (url.endsWith("/keybordy/main/3d.json")) {
        return respond({ title: "keybordy MP", summary: { en: "EN", it: "IT" } });
      }
      return new Response("", { status: 404 });
    };

    const { projects } = await discoverPrints(fakeFetch);
    expect(projects.map((p) => p.repo)).toEqual(["homelab", "keybordy"]);
    expect(projects[0].summary).toBeNull();
    expect(projects[1]).toMatchObject({ title: "keybordy MP", summary: { en: "EN", it: "IT" } });
    expect(calls.some((u) => u.includes("untagged"))).toBe(false);
  });
});
