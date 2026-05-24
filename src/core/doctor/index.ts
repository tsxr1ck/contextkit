import { join } from "node:path";
import type { DoctorFinding, DoctorReport } from "../../types/index.js";
import { readFileSafe, fileExists, dirExists, listDir } from "../../io/fs.js";
import { isGitignored } from "../../io/git.js";

/**
 * Run doctor checks against an existing repo memory setup.
 */
export function runDoctor(cwd: string): DoctorReport {
  const findings: DoctorFinding[] = [];

  // Check 1: Root CLAUDE.md exists
  checkRootClaudeMd(cwd, findings);

  // Check 2: CLAUDE.local.md is gitignored
  checkLocalGitignored(cwd, findings);

  // Check 3: AGENTS.md bridge
  checkAgentsBridge(cwd, findings);

  // Check 4: Scoped rules for segmented repos
  checkScopedRules(cwd, findings);

  // Check 5: Generic fluff detection
  checkGenericFluff(cwd, findings);

  // Check 6: Mandatory action detection
  checkMandatoryActions(cwd, findings);

  // Calculate score (100 base, subtract for findings)
  const deductions: Record<string, number> = {
    high: 15,
    medium: 8,
    low: 3,
  };

  let score = 100;
  for (const finding of findings) {
    score -= deductions[finding.severity] ?? 0;
  }
  score = Math.max(0, Math.min(100, score));

  const summary = generateSummary(score, findings);

  return { findings, score, summary };
}

function checkRootClaudeMd(cwd: string, findings: DoctorFinding[]) {
  const claudeMdPath = join(cwd, "CLAUDE.md");
  const content = readFileSafe(claudeMdPath);

  if (!content) {
    findings.push({
      severity: "high",
      message: "No root CLAUDE.md found.",
      suggestion: "Run `contextkit init` to create one.",
    });
    return;
  }

  const lineCount = content.split("\n").length;

  if (lineCount > 260) {
    findings.push({
      severity: "high",
      message: `CLAUDE.md is ${lineCount} lines — well over the recommended 200-line limit.`,
      file: "CLAUDE.md",
      suggestion:
        "Move stack-specific or folder-specific content to .claude/rules/ files.",
    });
  } else if (lineCount > 200) {
    findings.push({
      severity: "medium",
      message: `CLAUDE.md is ${lineCount} lines — above the recommended 200-line limit.`,
      file: "CLAUDE.md",
      suggestion: "Consider moving specialized sections to .claude/rules/.",
    });
  }

  // Check for empty headings
  const emptyHeadings = content.match(/^#+\s+.*\n(?:\s*\n|$)/gm);
  if (emptyHeadings && emptyHeadings.length > 0) {
    findings.push({
      severity: "low",
      message: `${emptyHeadings.length} empty heading section(s) in CLAUDE.md.`,
      file: "CLAUDE.md",
      suggestion: "Remove empty sections or add content.",
    });
  }
}

function checkLocalGitignored(cwd: string, findings: DoctorFinding[]) {
  if (!fileExists(join(cwd, "CLAUDE.local.md"))) return;

  const gitignorePath = join(cwd, ".gitignore");
  const gitignoreContent = readFileSafe(gitignorePath);

  const isIgnored =
    gitignoreContent?.includes("CLAUDE.local.md") ||
    isGitignored(cwd, "CLAUDE.local.md");

  if (!isIgnored) {
    findings.push({
      severity: "high",
      message: "CLAUDE.local.md exists but is not gitignored.",
      file: "CLAUDE.local.md",
      suggestion:
        'Add "CLAUDE.local.md" to .gitignore — local files should not be committed.',
    });
  }
}

function checkAgentsBridge(cwd: string, findings: DoctorFinding[]) {
  if (!fileExists(join(cwd, "AGENTS.md"))) return;

  const claudeMd = readFileSafe(join(cwd, "CLAUDE.md"));
  if (!claudeMd) {
    findings.push({
      severity: "high",
      message:
        "AGENTS.md exists but no CLAUDE.md to bridge it — Claude Code reads CLAUDE.md, not AGENTS.md.",
      file: "AGENTS.md",
      suggestion:
        "Create a CLAUDE.md that imports @AGENTS.md or run `contextkit init --import-agents`.",
    });
    return;
  }

  if (!claudeMd.includes("@AGENTS.md") && !claudeMd.includes("AGENTS.md")) {
    findings.push({
      severity: "medium",
      message:
        "AGENTS.md exists but CLAUDE.md does not reference it.",
      file: "CLAUDE.md",
      suggestion:
        'Add "@AGENTS.md" to CLAUDE.md to bridge existing agent instructions.',
    });
  }
}

function checkScopedRules(cwd: string, findings: DoctorFinding[]) {
  const rulesDir = join(cwd, ".claude", "rules");
  const hasRules = dirExists(rulesDir) && listDir(rulesDir).some((f) => f.endsWith(".md"));

  // Check if repo has clear segments that would benefit from scoped rules
  const segmentDirs = [
    "src/components",
    "src/api",
    "server",
    "api",
    "db",
    "prisma",
    "migrations",
  ];
  const hasSegments = segmentDirs.some((d) => dirExists(join(cwd, d)));

  if (hasSegments && !hasRules) {
    findings.push({
      severity: "medium",
      message:
        "Repository has clear segments but no .claude/rules/ files for scoped guidance.",
      suggestion:
        "Create path-scoped rules in .claude/rules/ for frontend, backend, or database layers.",
    });
  }
}

export const GENERIC_PHRASES = [
  "write clean code",
  "follow best practices",
  "write good tests",
  "keep code clean",
  "use meaningful variable names",
  "add comments where necessary",
  "write readable code",
  "follow coding standards",
];

function checkGenericFluff(cwd: string, findings: DoctorFinding[]) {
  const content = readFileSafe(join(cwd, "CLAUDE.md"));
  if (!content) return;

  const lower = content.toLowerCase();
  const matches = GENERIC_PHRASES.filter((phrase) => lower.includes(phrase));

  if (matches.length > 3) {
    findings.push({
      severity: "medium",
      message: `CLAUDE.md contains ${matches.length} generic phrases that Claude already knows.`,
      file: "CLAUDE.md",
      suggestion:
        "Replace generic advice with repo-specific instructions Claude cannot infer from code.",
    });
  } else if (matches.length > 0) {
    findings.push({
      severity: "low",
      message: `CLAUDE.md contains generic phrases: "${matches.join('", "')}"`,
      file: "CLAUDE.md",
      suggestion:
        "Consider replacing with specific, verifiable instructions.",
    });
  }
}

const MANDATORY_PATTERNS = [
  /always run/i,
  /must always/i,
  /never commit without/i,
  /always execute/i,
  /must run .+ before/i,
  /required to run/i,
];

function checkMandatoryActions(cwd: string, findings: DoctorFinding[]) {
  const content = readFileSafe(join(cwd, "CLAUDE.md"));
  if (!content) return;

  const lines = content.split("\n");
  const mandatoryLines: string[] = [];

  for (const line of lines) {
    if (MANDATORY_PATTERNS.some((pattern) => pattern.test(line))) {
      mandatoryLines.push(line.trim());
    }
  }

  if (mandatoryLines.length > 0) {
    findings.push({
      severity: "medium",
      message: `${mandatoryLines.length} mandatory-sounding instruction(s) found in CLAUDE.md prose.`,
      file: "CLAUDE.md",
      suggestion:
        "Move mandatory actions to Claude Code hooks for deterministic enforcement. CLAUDE.md is advisory context, not guaranteed enforcement.",
    });
  }
}

function generateSummary(score: number, findings: DoctorFinding[]): string {
  const high = findings.filter((f) => f.severity === "high").length;
  const medium = findings.filter((f) => f.severity === "medium").length;
  const low = findings.filter((f) => f.severity === "low").length;

  if (findings.length === 0) {
    return "Memory setup looks healthy. No issues found.";
  }

  const parts: string[] = [];
  if (high > 0) parts.push(`${high} high`);
  if (medium > 0) parts.push(`${medium} medium`);
  if (low > 0) parts.push(`${low} low`);

  return `Score: ${score}/100 — ${parts.join(", ")} severity finding(s).`;
}
