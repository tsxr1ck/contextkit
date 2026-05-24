import type { InitOptions, RepoProfile, RenderPlan } from "../../types/index.js";
import { detectRepo } from "../../core/detect/index.js";
import { resolvePresets } from "../../core/presets/index.js";
import { buildRenderPlan } from "../../core/render/index.js";
import { writeFileSafe, patchGitignore } from "../../io/fs.js";
import { log } from "../../io/logger.js";
import { confirm } from "../../io/prompts.js";
import { SkillsAdapter } from "../../skills/adapter.js";

/**
 * The `init` command — scaffold Claude Code memory files for a repository.
 */
export async function initCommand(options: InitOptions): Promise<void> {
  const { cwd, dryRun, yes } = options;

  if (dryRun) log.setDryRun(true);

  // ── Step 1: Detect ──
  log.heading("Detecting repository…");
  const profile = detectRepo(cwd);
  printProfile(profile);

  // ── Step 1.5: AutoSkills ──
  const adapter = new SkillsAdapter(cwd);
  let installedSkills = false;

  if (options.skillsOnly) {
    await adapter.installSkills(dryRun);
    log.success("Skills-only installation complete.");
    return;
  }

  let wantsSkills = options.withSkills;
  if (!wantsSkills && !yes && !dryRun) {
    log.newline();
    wantsSkills = await confirm("Install recommended AI skills via autoskills?");
  }

  if (wantsSkills) {
    installedSkills = await adapter.installSkills(dryRun);
  }

  // If skills were installed, we need to refresh the profile's skill list
  if (installedSkills && !dryRun) {
    const updatedProfile = detectRepo(cwd);
    profile.agentFiles.skills = updatedProfile.agentFiles.skills;
  }

  // ── Step 2: Resolve presets ──
  log.heading("Resolving presets…");
  const presets = resolvePresets(profile, {
    stackOverride: options.stackOverride,
    selectedOverlays: options.selectedOverlays,
    importAgents: options.importAgents,
  });

  if (presets.activeOverlays.length > 0) {
    log.info(`Active overlays: ${presets.activeOverlays.join(", ")}`);
  } else {
    log.dim("No overlays matched — using base template only.");
  }

  // ── Step 3: Build render plan ──
  const plan = buildRenderPlan(profile, presets, options);
  printPlan(plan);

  // Print warnings
  for (const warning of plan.warnings) {
    if (warning.severity === "error") log.error(warning.message);
    else if (warning.severity === "warn") log.warn(`${warning.file}: ${warning.message}`);
    else log.dim(`${warning.file}: ${warning.message}`);
  }

  // Nothing to do?
  if (plan.filesToCreate.length === 0 && plan.filesToModify.length === 0) {
    log.newline();
    log.warn("No files to create or modify. Use --force to overwrite existing files.");
    return;
  }

  // ── Step 4: Confirm ──
  if (!yes && !dryRun) {
    log.newline();
    const proceed = await confirm("Write these files?");
    if (!proceed) {
      log.dim("Aborted.");
      return;
    }
  }

  // ── Step 5: Write files ──
  if (dryRun) {
    log.heading("Dry run — no files written.");
    log.newline();
    for (const file of [...plan.filesToCreate, ...plan.filesToModify]) {
      log.info(`Would write: ${file.relativePath} (${file.lineCount} lines)`);
    }
  } else {
    log.heading("Writing files…");

    for (const file of plan.filesToCreate) {
      writeFileSafe(file.absolutePath, file.content);
      log.fileCreate(file.relativePath);
    }
    for (const file of plan.filesToModify) {
      writeFileSafe(file.absolutePath, file.content, { backup: true });
      log.fileModify(file.relativePath);
    }

    // ── Step 6: Patch .gitignore ──
    if (options.createLocal) {
      const result = patchGitignore(cwd, ["CLAUDE.local.md"]);
      if (result.patched) {
        log.fileModify(".gitignore");
        log.dim(`  Added: ${result.added.join(", ")}`);
      }
    }
  }

  // ── Step 7: Next steps ──
  log.newline();
  log.heading("Next steps");
  log.bullet("Review generated files and customize for your project.");
  log.bullet("Update the Project Overview and Repository Structure sections.");
  log.bullet("Run `contextkit doctor` to check your setup.");
  if (!options.createLocal) {
    log.bullet("Use `contextkit init --with-local` to create a personal CLAUDE.local.md.");
  }
  log.bullet("Consider adding hooks for mandatory actions (lint, test gates).");
  log.newline();
  log.success("Done!");
}

function printProfile(profile: RepoProfile) {
  log.detected("Project", profile.projectName);
  log.detected("Git", profile.isGitRepo ? "yes" : "no");

  if (profile.languages.length > 0) {
    log.detected(
      "Languages",
      profile.languages.map((l) => `${l.name} (${l.confidence})`).join(", ")
    );
  }

  if (profile.packageManagers.length > 0) {
    log.detected("Package managers", profile.packageManagers);
  }

  if (profile.frameworks.length > 0) {
    log.detected(
      "Frameworks",
      profile.frameworks.map((f) => `${f.name} (${f.confidence})`).join(", ")
    );
  }

  if (profile.isMonorepo) {
    log.detected("Monorepo", "yes");
  }

  if (profile.directories.length > 0) {
    log.detected("Directories", profile.directories.slice(0, 8));
  }

  // Existing agent files
  const existing: string[] = [];
  if (profile.agentFiles.claudeMd) existing.push("CLAUDE.md");
  if (profile.agentFiles.claudeLocalMd) existing.push("CLAUDE.local.md");
  if (profile.agentFiles.agentsMd) existing.push("AGENTS.md");
  if (profile.agentFiles.cursorRules) existing.push(".cursorrules");
  if (profile.agentFiles.windsurfRules) existing.push(".windsurfrules");
  if (profile.agentFiles.claudeRules.length > 0) {
    existing.push(`${profile.agentFiles.claudeRules.length} rule file(s)`);
  }
  if (existing.length > 0) {
    log.detected("Existing agent files", existing);
  }
}

function printPlan(plan: RenderPlan) {
  log.heading("File plan");

  for (const file of plan.filesToCreate) {
    log.fileCreate(`${file.relativePath} (${file.lineCount} lines)`);
  }
  for (const file of plan.filesToModify) {
    log.fileModify(`${file.relativePath} (${file.lineCount} lines)`);
  }
  for (const file of plan.filesToSkip) {
    log.fileSkip(file.relativePath, "exists");
  }
}
