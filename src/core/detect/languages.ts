import type { StackSignal } from "../../types/index.js";
import { fileExists, readJsonSafe } from "../../io/fs.js";
import { join } from "node:path";

/** Detect languages and runtimes from filesystem evidence. */
export function detectLanguages(cwd: string): StackSignal[] {
  const signals: StackSignal[] = [];
  const scores: Record<string, { confidence: number; evidence: string[] }> = {};

  function add(name: string, confidence: number, evidence: string) {
    if (!scores[name]) scores[name] = { confidence: 0, evidence: [] };
    scores[name].confidence += confidence;
    scores[name].evidence.push(evidence);
  }

  // TypeScript
  if (fileExists(join(cwd, "tsconfig.json"))) add("typescript", 5, "tsconfig.json");
  if (fileExists(join(cwd, "tsconfig.base.json"))) add("typescript", 3, "tsconfig.base.json");

  // JavaScript / Node
  if (fileExists(join(cwd, "package.json"))) {
    add("javascript", 3, "package.json");
    const pkg = readJsonSafe(join(cwd, "package.json"));
    if (pkg) {
      const deps = { ...((pkg.dependencies as Record<string, string>) || {}), ...((pkg.devDependencies as Record<string, string>) || {}) };
      if (deps["typescript"]) add("typescript", 3, "typescript in dependencies");
      if (deps["@types/node"]) add("typescript", 1, "@types/node in devDependencies");
    }
  }

  // Bun
  if (fileExists(join(cwd, "bun.lockb"))) add("bun", 5, "bun.lockb");
  if (fileExists(join(cwd, "bun.lock"))) add("bun", 5, "bun.lock");
  if (fileExists(join(cwd, "bunfig.toml"))) add("bun", 3, "bunfig.toml");

  // Node
  if (fileExists(join(cwd, "package-lock.json"))) add("node", 4, "package-lock.json");
  if (fileExists(join(cwd, "yarn.lock"))) add("node", 4, "yarn.lock");
  if (fileExists(join(cwd, "pnpm-lock.yaml"))) add("node", 4, "pnpm-lock.yaml");

  // Python
  if (fileExists(join(cwd, "pyproject.toml"))) add("python", 5, "pyproject.toml");
  if (fileExists(join(cwd, "requirements.txt"))) add("python", 4, "requirements.txt");
  if (fileExists(join(cwd, "setup.py"))) add("python", 3, "setup.py");
  if (fileExists(join(cwd, "Pipfile"))) add("python", 4, "Pipfile");
  if (fileExists(join(cwd, "poetry.lock"))) add("python", 4, "poetry.lock");

  // Go
  if (fileExists(join(cwd, "go.mod"))) add("go", 5, "go.mod");
  if (fileExists(join(cwd, "go.sum"))) add("go", 3, "go.sum");

  // Rust
  if (fileExists(join(cwd, "Cargo.toml"))) add("rust", 5, "Cargo.toml");
  if (fileExists(join(cwd, "Cargo.lock"))) add("rust", 3, "Cargo.lock");

  for (const [name, data] of Object.entries(scores)) {
    signals.push({ name, confidence: data.confidence, evidence: data.evidence });
  }

  return signals.sort((a, b) => b.confidence - a.confidence);
}

/** Detect package manager preference. */
export function detectPackageManagers(cwd: string): string[] {
  const managers: string[] = [];

  if (fileExists(join(cwd, "bun.lockb")) || fileExists(join(cwd, "bun.lock"))) {
    managers.push("bun");
  }
  if (fileExists(join(cwd, "pnpm-lock.yaml"))) managers.push("pnpm");
  if (fileExists(join(cwd, "yarn.lock"))) managers.push("yarn");
  if (fileExists(join(cwd, "package-lock.json"))) managers.push("npm");

  // Python managers
  if (fileExists(join(cwd, "poetry.lock"))) managers.push("poetry");
  if (fileExists(join(cwd, "Pipfile"))) managers.push("pipenv");
  if (fileExists(join(cwd, "uv.lock"))) managers.push("uv");

  return managers;
}
