import type { DetectedAgentFiles } from "../../types/index.js";
import { fileExists, readJsonSafe, listDir, dirExists } from "../../io/fs.js";
import { join } from "node:path";

/** Detect monorepo signals. */
export function detectMonorepo(cwd: string): { isMonorepo: boolean; evidence: string[] } {
  const evidence: string[] = [];

  // Check package.json workspaces
  const pkg = readJsonSafe(join(cwd, "package.json"));
  if (pkg?.workspaces) {
    evidence.push("workspaces in package.json");
  }

  // Check pnpm workspaces
  if (fileExists(join(cwd, "pnpm-workspace.yaml"))) {
    evidence.push("pnpm-workspace.yaml");
  }

  // Check for common monorepo directories
  if (dirExists(join(cwd, "packages"))) evidence.push("packages/ directory");
  if (dirExists(join(cwd, "apps"))) evidence.push("apps/ directory");

  // Check for monorepo tools
  if (fileExists(join(cwd, "lerna.json"))) evidence.push("lerna.json");
  if (fileExists(join(cwd, "nx.json"))) evidence.push("nx.json");
  if (fileExists(join(cwd, "turbo.json"))) evidence.push("turbo.json");

  return {
    isMonorepo: evidence.length > 0,
    evidence,
  };
}

/** Detect existing agent-related files. */
export function detectAgentFiles(cwd: string): DetectedAgentFiles {
  return {
    claudeMd: fileExists(join(cwd, "CLAUDE.md")),
    claudeLocalMd: fileExists(join(cwd, "CLAUDE.local.md")),
    claudeRules: detectClaudeRules(cwd),
    agentsMd: fileExists(join(cwd, "AGENTS.md")),
    cursorRules: fileExists(join(cwd, ".cursorrules")),
    windsurfRules: fileExists(join(cwd, ".windsurfrules")),
    openCodeSwarm: dirExists(join(cwd, ".swarm")),
    skills: detectSkills(cwd),
  };
}

function detectSkills(cwd: string): string[] {
  const skillsDir = join(cwd, ".claude", "skills");
  if (!dirExists(skillsDir)) return [];

  // Skills are subdirectories within .claude/skills
  return listDir(skillsDir).filter((d) => dirExists(join(skillsDir, d)));
}

function detectClaudeRules(cwd: string): string[] {
  const rulesDir = join(cwd, ".claude", "rules");
  if (!dirExists(rulesDir)) return [];

  return listDir(rulesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => `.claude/rules/${f}`);
}

/** Detect notable project directories. */
export function detectDirectories(cwd: string): string[] {
  const notable = [
    "src",
    "src/components",
    "src/lib",
    "src/utils",
    "src/api",
    "src/app",
    "src/pages",
    "src/hooks",
    "src/styles",
    "src/types",
    "app",
    "api",
    "server",
    "lib",
    "components",
    "pages",
    "public",
    "static",
    "assets",
    "db",
    "database",
    "prisma",
    "drizzle",
    "supabase",
    "migrations",
    "scripts",
    "tools",
    "config",
    "docs",
    "tests",
    "test",
    "__tests__",
    "e2e",
    "packages",
    "apps",
    "services",
  ];

  return notable.filter((dir) => dirExists(join(cwd, dir)));
}

/** Detect notable files at the root. */
export function detectRootFiles(cwd: string): string[] {
  const notable = [
    "package.json",
    "tsconfig.json",
    "bun.lockb",
    "bun.lock",
    "docker-compose.yml",
    "docker-compose.yaml",
    "Dockerfile",
    ".env.example",
    ".env.local",
    "Makefile",
    "justfile",
    "README.md",
    "CLAUDE.md",
    "AGENTS.md",
  ];

  return notable.filter((f) => fileExists(join(cwd, f)));
}
