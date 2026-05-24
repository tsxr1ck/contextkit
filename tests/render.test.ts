import { expect, test, describe } from "bun:test";
import { resolvePresets } from "../src/core/presets/index.js";
import { buildRenderPlan } from "../src/core/render/index.js";
import type { RepoProfile, InitOptions } from "../src/types/index.js";

const dummyProfile: RepoProfile = {
  cwd: "/dummy",
  isGitRepo: false,
  isMonorepo: false,
  languages: [{ name: "typescript", confidence: 5, evidence: [] }],
  packageManagers: ["bun"],
  frameworks: [{ name: "next", confidence: 5, evidence: [] }],
  directories: ["src/components", "src/api"],
  files: ["package.json"],
  agentFiles: {
    claudeMd: false,
    claudeLocalMd: false,
    claudeRules: [],
    agentsMd: false,
    cursorRules: false,
    windsurfRules: false,
    skills: [],
  },
  confidence: {
    typescript: 5,
    next: 5,
    bun: 5,
  },
  projectName: "test-project",
  packageJson: null,
};

const defaultOptions: InitOptions = {
  mode: "opinionated",
  createLocal: false,
  importAgents: false,
  includeHooks: false,
  withSkills: false,
  skillsOnly: false,
  selectedOverlays: [],
  dryRun: true,
  force: false,
  yes: true,
  cwd: "/dummy",
  stackOverride: null,
};

describe("Render Engine", () => {
  test("resolves correct overlays", () => {
    const presets = resolvePresets(dummyProfile, defaultOptions);
    expect(presets.activeOverlays).toContain("typescript");
    expect(presets.activeOverlays).toContain("next");
    expect(presets.activeOverlays).toContain("bun");
  });

  test("builds correct file plan", () => {
    const presets = resolvePresets(dummyProfile, defaultOptions);
    const plan = buildRenderPlan(dummyProfile, presets, defaultOptions);

    expect(plan.filesToCreate.length).toBeGreaterThan(0);
    
    // Should create root CLAUDE.md
    const root = plan.filesToCreate.find(f => f.relativePath === "CLAUDE.md");
    expect(root).toBeDefined();
    expect(root?.content).toContain("# Next.js"); // Overlay
    expect(root?.content).toContain("# Bun Runtime"); // Overlay
    
    // Should create scoped rules based on directories
    const rules = plan.filesToCreate.filter(f => f.relativePath.startsWith(".claude/rules/"));
    const rulePaths = rules.map(r => r.relativePath);
    expect(rulePaths).toContain(".claude/rules/frontend.md"); // From Next overlay
    expect(rulePaths).toContain(".claude/rules/backend.md"); // From src/api dir
  });

  test("includes local file if requested", () => {
    const presets = resolvePresets(dummyProfile, defaultOptions);
    const plan = buildRenderPlan(dummyProfile, presets, { ...defaultOptions, createLocal: true });

    const local = plan.filesToCreate.find(f => f.relativePath === "CLAUDE.local.md");
    expect(local).toBeDefined();
    expect(local?.content).toContain("# Local Notes");
  });
});
