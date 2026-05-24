import type { RepoProfile, DetectionConfidence } from "../../types/index.js";
import { detectLanguages, detectPackageManagers } from "./languages.js";
import { detectFrameworks } from "./frameworks.js";
import {
  detectMonorepo,
  detectAgentFiles,
  detectDirectories,
  detectRootFiles,
} from "./structure.js";
import { isGitRepo, getRepoName } from "../../io/git.js";
import { readJsonSafe } from "../../io/fs.js";
import { join } from "node:path";

/**
 * Build a complete repo profile by running all detectors.
 */
export function detectRepo(cwd: string): RepoProfile {
  const languages = detectLanguages(cwd);
  const frameworks = detectFrameworks(cwd);
  const packageManagers = detectPackageManagers(cwd);
  const monorepo = detectMonorepo(cwd);
  const agentFiles = detectAgentFiles(cwd);
  const directories = detectDirectories(cwd);
  const files = detectRootFiles(cwd);
  const packageJson = readJsonSafe(join(cwd, "package.json"));

  // Build confidence map from language and framework signals
  const confidence: DetectionConfidence = {};
  for (const lang of languages) {
    confidence[lang.name] = lang.confidence;
  }
  for (const fw of frameworks) {
    confidence[fw.name] = fw.confidence;
  }
  if (monorepo.isMonorepo) {
    confidence["monorepo"] = monorepo.evidence.length * 2;
  }

  // Determine project name
  const projectName =
    (packageJson?.name as string) || getRepoName(cwd) || "my-project";

  return {
    cwd,
    isGitRepo: isGitRepo(cwd),
    isMonorepo: monorepo.isMonorepo,
    languages,
    packageManagers,
    frameworks,
    directories,
    files,
    agentFiles,
    confidence,
    projectName,
    packageJson,
  };
}
