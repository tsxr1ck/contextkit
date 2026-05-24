import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Write a file, creating parent directories as needed.
 * If backup is true and the file exists, create a .bak copy first.
 */
export function writeFileSafe(
  absolutePath: string,
  content: string,
  options: { backup?: boolean } = {}
): void {
  const dir = dirname(absolutePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (options.backup && existsSync(absolutePath)) {
    copyFileSync(absolutePath, `${absolutePath}.bak`);
  }

  writeFileSync(absolutePath, content, "utf-8");
}

/**
 * Read a file and return its contents, or null if it doesn't exist.
 */
export function readFileSafe(absolutePath: string): string | null {
  if (!existsSync(absolutePath)) return null;
  return readFileSync(absolutePath, "utf-8");
}

/**
 * Check if a file exists.
 */
export function fileExists(absolutePath: string): boolean {
  return existsSync(absolutePath);
}

/**
 * Ensure a line exists in .gitignore. Appends if missing.
 * Creates .gitignore if it doesn't exist.
 */
export function patchGitignore(repoRoot: string, entries: string[]): { patched: boolean; added: string[] } {
  const gitignorePath = join(repoRoot, ".gitignore");
  let content = "";
  const added: string[] = [];

  if (existsSync(gitignorePath)) {
    content = readFileSync(gitignorePath, "utf-8");
  }

  const lines = content.split("\n");

  for (const entry of entries) {
    const normalized = entry.trim();
    if (!lines.some((line) => line.trim() === normalized)) {
      added.push(normalized);
    }
  }

  if (added.length === 0) {
    return { patched: false, added: [] };
  }

  // Add a blank line separator if file doesn't end with one
  if (content.length > 0 && !content.endsWith("\n\n")) {
    content = content.trimEnd() + "\n\n";
  }

  content += "# contextkit — local files\n";
  content += added.join("\n") + "\n";

  writeFileSync(gitignorePath, content, "utf-8");
  return { patched: true, added };
}

/**
 * Try to read and parse a JSON file. Returns null on failure.
 */
export function readJsonSafe(absolutePath: string): Record<string, unknown> | null {
  try {
    const raw = readFileSafe(absolutePath);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * List immediate children of a directory (non-recursive).
 */
export function listDir(dirPath: string): string[] {
  try {
    const { readdirSync } = require("node:fs");
    return readdirSync(dirPath) as string[];
  } catch {
    return [];
  }
}

/**
 * Check if a directory exists.
 */
export function dirExists(dirPath: string): boolean {
  try {
    const { statSync } = require("node:fs");
    return statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}
