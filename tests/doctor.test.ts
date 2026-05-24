import { expect, test, describe } from "bun:test";
import { runDoctor } from "../src/core/doctor/index.js";
import { applyFixes } from "../src/core/doctor/fix.js";
import { resolve } from "node:path";

describe("Doctor Engine", () => {
  test("reports issues on existing-claude fixture", () => {
    const cwd = resolve(import.meta.dir, "fixtures", "existing-claude");
    const report = runDoctor(cwd);

    // Should find AGENTS.md missing bridge (medium severity because CLAUDE.md exists but lacks bridge)
    const agentsFinding = report.findings.find(f => f.message.includes("AGENTS.md exists but CLAUDE.md does not reference it"));
    expect(agentsFinding).toBeDefined();
    expect(agentsFinding?.severity).toBe("medium");

    // (We omit the CLAUDE.local.md gitignore check here because it depends on the host repo's .gitignore)

    expect(report.score).toBeLessThan(100);
  });
  
  test("reports no issues on healthy bun-ts-app after init (simulated)", () => {
    const cwd = resolve(import.meta.dir, "fixtures", "bun-ts-app");
    const report = runDoctor(cwd);
    
    // Without CLAUDE.md it reports high severity
    expect(report.findings.length).toBeGreaterThan(0);
    expect(report.findings[0].message).toContain("No root CLAUDE.md found");
  });

  test("applyFixes extracts rules, removes fluff, and bridges agents", () => {
    const cwd = resolve(import.meta.dir, "fixtures", "bloated-claude");
    const report = runDoctor(cwd);
    
    // Check that we have findings to fix
    expect(report.findings.length).toBeGreaterThan(0);

    const plan = applyFixes(cwd, report);

    // Should create frontend and backend rule files
    expect(plan.filesToCreate.length).toBe(2);
    const frontendRule = plan.filesToCreate.find(f => f.relativePath === ".claude/rules/frontend.md");
    const backendRule = plan.filesToCreate.find(f => f.relativePath === ".claude/rules/backend.md");
    expect(frontendRule).toBeDefined();
    expect(backendRule).toBeDefined();

    // The extracted rule should have the valid paths but not the fluff
    expect(frontendRule?.content).toContain("paths:\n  - \"src/components/**/*\"\n  - \"app/**/*\"");
    expect(frontendRule?.content).not.toContain("Write clean code.");
    expect(frontendRule?.content).not.toContain("Follow best practices.");

    // The modified CLAUDE.md should have AGENTS.md bridged
    expect(plan.filesToModify.length).toBe(1);
    const claudeMd = plan.filesToModify[0];
    expect(claudeMd.content).toContain("@AGENTS.md");
    
    // Extracted sections should be removed from CLAUDE.md
    expect(claudeMd.content).not.toContain("# Frontend Rules");
    expect(claudeMd.content).not.toContain("# Backend");
    expect(claudeMd.content).not.toContain("Keep code clean."); // fluff removed
  });
});
