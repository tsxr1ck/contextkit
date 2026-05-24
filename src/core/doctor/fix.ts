import { join } from "node:path";
import { readFileSafe, fileExists } from "../../io/fs.js";
import { isGitignored } from "../../io/git.js";
import type { RenderPlan, PlannedFile, DoctorReport } from "../../types/index.js";
import { GENERIC_PHRASES } from "./index.js";

interface ParsedSection {
  heading: string;
  lines: string[];
}

/**
 * Apply automated fixes to a bloated or misconfigured Claude setup.
 * Returns a RenderPlan so changes can be previewed or written safely.
 */
export function applyFixes(cwd: string, report: DoctorReport): RenderPlan {
  const plan: RenderPlan = {
    filesToCreate: [],
    filesToModify: [],
    filesToSkip: [],
    warnings: [],
  };

  const claudeMdPath = join(cwd, "CLAUDE.md");
  const content = readFileSafe(claudeMdPath);

  if (!content) {
    plan.warnings.push({
      file: "CLAUDE.md",
      message: "File does not exist. Nothing to fix.",
      severity: "warn",
    });
    return plan;
  }

  const sections = parseSections(content);
  let claudeMdModified = false;
  const newClaudeMdLines: string[] = [];

  // Extract rules and filter fluff
  for (const section of sections) {
    // 1. Is it a rule we should extract?
    const extractedRulePath = extractRulePath(section.heading);
    if (extractedRulePath) {
      const ruleContent = generateRuleFileContent(section);
      plan.filesToCreate.push({
        relativePath: extractedRulePath,
        absolutePath: join(cwd, extractedRulePath),
        content: ruleContent,
        source: "overlay",
        lineCount: ruleContent.split("\n").length,
      });
      claudeMdModified = true;
      continue; // Skip adding this section back to CLAUDE.md
    }

    // 2. Remove generic fluff
    const filteredLines = section.lines.filter((line) => !isFluff(line));
    if (filteredLines.length < section.lines.length) {
      claudeMdModified = true;
    }

    // Only add section back if it still has content (or if it's the preamble/frontmatter)
    if (section.heading === "" || filteredLines.some((l) => l.trim().length > 0 && !l.trim().startsWith("<!--"))) {
      if (section.heading) {
        newClaudeMdLines.push(`\n${section.heading}`);
      }
      newClaudeMdLines.push(...filteredLines);
    } else {
      claudeMdModified = true; // Section was completely removed
    }
  }

  // 3. Fix AGENTS.md bridge
  const agentsFinding = report.findings.find(f => f.message.includes("AGENTS.md"));
  if (agentsFinding && fileExists(join(cwd, "AGENTS.md"))) {
    // Determine where to put it — usually at the top after generated comments
    const insertIdx = newClaudeMdLines.findIndex((l) => l.trim() !== "" && !l.trim().startsWith("<!--"));
    const finalIdx = insertIdx === -1 ? 0 : insertIdx;
    
    // Add AGENTS.md import
    newClaudeMdLines.splice(finalIdx, 0, "\n# Imported Agent Instructions\n- @AGENTS.md\n");
    claudeMdModified = true;
  }

  if (claudeMdModified) {
    const newContent = newClaudeMdLines.join("\n").replace(/\n{3,}/g, "\n\n").trimStart();
    plan.filesToModify.push({
      relativePath: "CLAUDE.md",
      absolutePath: claudeMdPath,
      content: newContent + "\n",
      source: "merge",
      lineCount: newContent.split("\n").length,
    });
  }

  // 4. Fix .gitignore for CLAUDE.local.md
  const localFinding = report.findings.find(f => f.file === "CLAUDE.local.md" && f.severity === "high");
  if (localFinding) {
    // The patchGitignore function handles the actual writing during plan execution.
    // We add a synthetic file to the plan to represent this intent.
    plan.filesToModify.push({
      relativePath: ".gitignore",
      absolutePath: join(cwd, ".gitignore"),
      content: "(Appends CLAUDE.local.md to .gitignore)",
      source: "merge",
      lineCount: 1,
    });
  }

  return plan;
}

function parseSections(content: string): ParsedSection[] {
  const lines = content.split("\n");
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = { heading: "", lines: [] };

  for (const line of lines) {
    if (line.match(/^#+\s/)) {
      // New heading
      if (currentSection.heading || currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { heading: line, lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }
  
  if (currentSection.heading || currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

function extractRulePath(heading: string): string | null {
  const lower = heading.toLowerCase();
  if (lower.includes("frontend")) return ".claude/rules/frontend.md";
  if (lower.includes("backend") || lower.includes("api")) return ".claude/rules/backend.md";
  if (lower.includes("database") || lower.includes("db") || lower.includes("prisma")) return ".claude/rules/database.md";
  if (lower.includes("test")) return ".claude/rules/testing.md";
  if (lower.includes("architecture")) return ".claude/rules/architecture.md";
  return null;
}

function generateRuleFileContent(section: ParsedSection): string {
  const lower = section.heading.toLowerCase();
  let paths: string[] = [];

  if (lower.includes("frontend")) paths = ["src/components/**/*", "app/**/*"];
  else if (lower.includes("backend") || lower.includes("api")) paths = ["src/api/**/*", "server/**/*"];
  else if (lower.includes("database") || lower.includes("db")) paths = ["db/**/*", "prisma/**/*", "migrations/**/*"];
  else if (lower.includes("test")) paths = ["tests/**/*", "*.test.*"];
  else if (lower.includes("architecture")) paths = ["src/**/*"];

  const lines: string[] = [];
  lines.push("---");
  lines.push("paths:");
  for (const p of paths) {
    lines.push(`  - "${p}"`);
  }
  lines.push("---");
  lines.push("");
  lines.push(section.heading);
  
  // Clean fluff from extracted rules too
  const filteredLines = section.lines.filter((line) => !isFluff(line));
  lines.push(...filteredLines);

  // Remove leading empty lines
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function isFluff(line: string): boolean {
  const lower = line.toLowerCase();
  return GENERIC_PHRASES.some((phrase) => lower.includes(phrase));
}
