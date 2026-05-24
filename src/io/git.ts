import { execSync } from "node:child_process";

/**
 * Check if the given directory is inside a git repository.
 */
export function isGitRepo(cwd: string): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd,
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the git working tree is clean.
 */
export function isClean(cwd: string): boolean {
  try {
    const output = execSync("git status --porcelain", {
      cwd,
      stdio: "pipe",
      encoding: "utf-8",
    });
    return output.trim().length === 0;
  } catch {
    return false;
  }
}

/**
 * Get the root directory of the git repository.
 */
export function getRepoRoot(cwd: string): string | null {
  try {
    const root = execSync("git rev-parse --show-toplevel", {
      cwd,
      stdio: "pipe",
      encoding: "utf-8",
    });
    return root.trim();
  } catch {
    return null;
  }
}

/**
 * Get the repository name from the git remote or folder name.
 */
export function getRepoName(cwd: string): string {
  try {
    const remote = execSync("git remote get-url origin", {
      cwd,
      stdio: "pipe",
      encoding: "utf-8",
    }).trim();
    // Extract repo name from URL like git@github.com:user/repo.git or https://github.com/user/repo.git
    const match = remote.match(/\/([^/]+?)(?:\.git)?$/);
    if (match) return match[1];
  } catch {
    // ignore
  }

  // Fall back to directory name
  const { basename } = require("node:path");
  return basename(cwd);
}

/**
 * Check if a path is gitignored.
 */
export function isGitignored(cwd: string, relativePath: string): boolean {
  try {
    execSync(`git check-ignore -q "${relativePath}"`, {
      cwd,
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}
