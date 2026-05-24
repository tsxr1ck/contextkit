import { expect, test, describe } from "bun:test";
import { detectRepo } from "../src/core/detect/index.js";
import { resolve } from "node:path";

describe("Detection Engine", () => {
  test("detects minimal bun+ts project", () => {
    const cwd = resolve(import.meta.dir, "fixtures", "bun-ts-app");
    const profile = detectRepo(cwd);

    expect(profile.languages.some(l => l.name === "typescript")).toBe(true);
    expect(profile.packageManagers).toBeEmpty(); // no lockfile in fixture
    expect(profile.frameworks).toBeEmpty();
    expect(profile.agentFiles.claudeMd).toBe(false);
  });

  test("detects next.js project", () => {
    const cwd = resolve(import.meta.dir, "fixtures", "next-app");
    const profile = detectRepo(cwd);

    expect(profile.languages.some(l => l.name === "typescript")).toBe(true);
    expect(profile.frameworks.some(f => f.name === "next")).toBe(true);
    expect(profile.frameworks.some(f => f.name === "react")).toBe(true);
    expect(profile.frameworks.some(f => f.name === "prisma")).toBe(true);
    expect(profile.frameworks.some(f => f.name === "vitest")).toBe(true);
    
    expect(profile.directories).toContain("src/components");
    expect(profile.directories).toContain("src/api");
    expect(profile.directories).toContain("tests");
    expect(profile.directories).toContain("prisma");
    expect(profile.directories).toContain("app");
  });

  test("detects existing agent files", () => {
    const cwd = resolve(import.meta.dir, "fixtures", "existing-claude");
    const profile = detectRepo(cwd);

    expect(profile.agentFiles.claudeMd).toBe(true);
    expect(profile.agentFiles.claudeLocalMd).toBe(true);
    expect(profile.agentFiles.agentsMd).toBe(true);
  });
});
