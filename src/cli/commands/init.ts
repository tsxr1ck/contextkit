import type { InitOptions, RepoProfile, RenderPlan } from "../../types/index.js";
import { detectRepo } from "../../core/detect/index.js";
import { resolvePresets } from "../../core/presets/index.js";
import { buildRenderPlan } from "../../core/render/index.js";
import { writeFileSafe, patchGitignore } from "../../io/fs.js";
import { log } from "../../io/logger.js";
import { confirm as rawConfirm } from "../../io/prompts.js";
import { SkillsAdapter } from "../../skills/adapter.js";
import { ui } from "../../ui/format/colors.js";
import { symbols } from "../../ui/format/symbols.js";
import {
  intro,
  outro,
  spinner,
  group,
  multiselect,
  select,
  confirm,
  tasks,
  log as clackLog,
  isCancel,
  isCI,
} from "@clack/prompts";
import { getAvailableOverlayIds } from "../../templates/overlays/index.js";
import { plainInitResult, plainError } from "../../ui/plain/output.js";

function isInteractive(options: InitOptions): boolean {
  if (options.yes || options.dryRun || options.json) return false;
  if (!process.stdout.isTTY) return false;
  if (isCI()) return false;
  return true;
}

/**
 * The `init` command — scaffold Claude Code memory files for a repository.
 */
export async function initCommand(options: InitOptions): Promise<void> {
  const { cwd, dryRun, yes } = options;

  if (dryRun) log.setDryRun(true);

  // Fast path: --skills-only
  if (options.skillsOnly) {
    const adapter = new SkillsAdapter(cwd);
    await adapter.installSkills(dryRun);
    log.success("Skills-only installation complete.");
    return;
  }

  // Non-interactive path
  if (!isInteractive(options)) {
    await nonInteractiveInit(options);
    return;
  }

  // ── Interactive path ──
  await interactiveInit(options);
}

async function nonInteractiveInit(options: InitOptions): Promise<void> {
  const { cwd, dryRun, yes } = options;

  // ── Detection ──
  log.heading("Detecting repository…");
  const profile = detectRepo(cwd);
  printProfile(profile);

  // ── Skills ──
  const adapter = new SkillsAdapter(cwd);
  let installedSkills = false;

  let wantsSkills = options.withSkills;
  if (!wantsSkills && !yes && !dryRun) {
    log.newline();
    wantsSkills = await rawConfirm("Install recommended AI skills via autoskills?");
  }

  if (wantsSkills) {
    installedSkills = await adapter.installSkills(dryRun);
  }

  if (installedSkills && !dryRun) {
    const updatedProfile = detectRepo(cwd);
    profile.agentFiles.skills = updatedProfile.agentFiles.skills;
  }

  // ── Resolve presets ──
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

  // ── Build render plan ──
  const plan = buildRenderPlan(profile, presets, options);
  printPlan(plan);

  for (const warning of plan.warnings) {
    if (warning.severity === "error") log.error(warning.message);
    else if (warning.severity === "warn") log.warn(`${warning.file}: ${warning.message}`);
    else log.dim(`${warning.file}: ${warning.message}`);
  }

  if (plan.filesToCreate.length === 0 && plan.filesToModify.length === 0) {
    if (options.json) {
      console.log(JSON.stringify({ success: true, command: "init", data: { message: "Nothing to do" } }));
    } else {
      log.newline();
      log.warn("No files to create or modify. Use --force to overwrite existing files.");
    }
    return;
  }

  // ── Confirm ──
  if (!yes && !dryRun && !options.json) {
    log.newline();
    const proceed = await rawConfirm("Write these files?");
    if (!proceed) {
      log.dim("Aborted.");
      return;
    }
  }

  // ── Write files ──
  await writeFiles(plan, options);

  if (options.json) {
    console.log(JSON.stringify(plainInitResult(plan, dryRun)));
  } else {
    printNextSteps(options, plan);
  }
}

async function interactiveInit(options: InitOptions): Promise<void> {
  const { cwd, dryRun } = options;

  intro(ui.brand("contextkit init"));

  // ── Step 1: Detection ──
  const detectSpinner = spinner();
  detectSpinner.start("Detecting repository and stack…");
  const profile = detectRepo(cwd);
  detectSpinner.stop("Repository analyzed");

  printDetectionSummary(profile);

  // ── Step 2: Skills (optional) ──
  const adapter = new SkillsAdapter(cwd);
  let installedSkills = false;

  const wantsSkills = await confirm({
    message: "Install recommended AI agent skills via autoskills?",
    initialValue: options.withSkills,
  });

  if (isCancel(wantsSkills)) {
    outro(ui.warn("Setup canceled. No files were changed."));
    process.exit(1);
  }

  if (wantsSkills) {
    const skillSpinner = spinner();
    skillSpinner.start("Installing skills via autoskills…");
    installedSkills = await adapter.installSkills(dryRun);
    if (installedSkills) {
      skillSpinner.stop("Skills installed");
      if (!dryRun) {
        const updatedProfile = detectRepo(cwd);
        profile.agentFiles.skills = updatedProfile.agentFiles.skills;
      }
    } else {
      skillSpinner.stop("Skills installation skipped");
      clackLog.warn("Skills installation did not complete. Continuing without skills.");
    }
  }

  // ── Step 3: Grouped questions ──
  const answers = await group(
    {
      mode: () =>
        select({
          message: "Setup mode",
          options: [
            { value: "opinionated", label: "Opinionated", hint: "Full template with conventions" },
            { value: "minimal", label: "Minimal", hint: "Essential sections only" },
          ],
          initialValue: options.mode || "opinionated",
        } as Parameters<typeof select>[0]),
      createLocal: ({ results }) =>
        confirm({
          message: "Create CLAUDE.local.md for personal notes?",
          initialValue: options.createLocal || !!results.mode,
        }),
      importAgents: () =>
        confirm({
          message: "Import existing AGENTS.md into CLAUDE.md?",
          initialValue: options.importAgents || !!profile.agentFiles.agentsMd,
        }),
      includeHooks: () =>
        confirm({
          message: "Include hook scaffolding for mandatory actions?",
          initialValue: options.includeHooks || false,
        }),
    },
    {
      onCancel: () => {
        outro(ui.warn("Setup canceled. No files were changed."));
        process.exit(1);
      },
    }
  );

  // ── Step 4: Overlay multiselect ──
  const detectedOverlays = detectOverlayMatches(profile);
  const availableOverlays = getAvailableOverlayIds().map((id) => ({
    value: id,
    label: overlayLabel(id),
    hint: detectedOverlays.includes(id) ? "detected" : undefined,
  }));

  const selectedOverlays = await multiselect({
    message: "Select stack overlays",
    options: availableOverlays,
    initialValues: options.selectedOverlays.length > 0
      ? options.selectedOverlays
      : detectedOverlays,
    required: false,
  });

  if (isCancel(selectedOverlays)) {
    outro(ui.warn("Setup canceled. No files were changed."));
    process.exit(1);
  }

  // ── Step 5: Resolve presets and build plan ──
  const presets = resolvePresets(profile, {
    stackOverride: options.stackOverride,
    selectedOverlays: options.selectedOverlays.length > 0
      ? options.selectedOverlays
      : selectedOverlays as string[],
    importAgents: (answers.importAgents as boolean) || options.importAgents,
  });

  const initOpts: InitOptions = {
    ...options,
    mode: (answers.mode as "minimal" | "opinionated") || options.mode,
    createLocal: (answers.createLocal as boolean) || options.createLocal,
    importAgents: (answers.importAgents as boolean) || options.importAgents,
    includeHooks: (answers.includeHooks as boolean) || options.includeHooks,
    withSkills: wantsSkills,
    selectedOverlays: selectedOverlays as string[],
  };

  const plan = buildRenderPlan(profile, presets, initOpts);

  // ── Step 6: Preview plan ──
  printPlanPreview(plan);

  if (plan.filesToCreate.length === 0 && plan.filesToModify.length === 0) {
    clackLog.warn("No files to create or modify. Use --force to overwrite existing files.");
    outro(ui.dim("Nothing to do."));
    return;
  }

  // ── Step 7: Confirm write ──
  const shouldWrite = await confirm({
    message: "Write these files?",
    initialValue: true,
  });

  if (isCancel(shouldWrite) || !shouldWrite) {
    outro(ui.warn("Setup canceled. No files were changed."));
    process.exit(isCancel(shouldWrite) ? 1 : 0);
  }

  // ── Step 8: Execute tasks ──
  if (dryRun) {
    clackLog.info("Dry run — no files will be written.");
    clackLog.info(`Would create ${plan.filesToCreate.length} file(s), modify ${plan.filesToModify.length} file(s).`);
  } else {
    await writeFilesInteractive(plan, options);
  }

  // ── Step 9: Outro ──
  outro(ui.ok("Memory scaffolding complete"));
  printNextSteps(options, plan);
}

// ── Helpers ──

function overlayLabel(id: string): string {
  const labels: Record<string, string> = {
    typescript: "TypeScript",
    bun: "Bun",
    node: "Node.js",
    react: "React",
    next: "Next.js",
    python: "Python",
    go: "Go",
    monorepo: "Monorepo",
  };
  return labels[id] || id;
}

function detectOverlayMatches(profile: RepoProfile): string[] {
  const matches: string[] = [];

  if (profile.languages.some((l) => l.name === "typescript")) matches.push("typescript");
  if (profile.packageManagers.includes("bun")) matches.push("bun");
  else if (
    profile.packageManagers.includes("npm") ||
    profile.packageManagers.includes("yarn") ||
    profile.packageManagers.includes("pnpm")
  )
    matches.push("node");

  const fwNames = profile.frameworks.map((f) => f.name);
  if (fwNames.includes("next")) matches.push("next");
  if (fwNames.includes("react") && !fwNames.includes("next")) matches.push("react");
  if (profile.languages.some((l) => l.name === "python")) matches.push("python");
  if (profile.languages.some((l) => l.name === "go")) matches.push("go");
  if (profile.isMonorepo) matches.push("monorepo");

  return [...new Set(matches)];
}

function printDetectionSummary(profile: RepoProfile): void {
  clackLog.step("Detection results");

  const pairs: [string, string][] = [];

  if (profile.languages.length > 0) {
    pairs.push(["Language", profile.languages.map((l) => l.name).join(", ")]);
  }
  if (profile.packageManagers.length > 0) {
    pairs.push(["Package mgr", profile.packageManagers.join(", ")]);
  }
  if (profile.frameworks.length > 0) {
    pairs.push(["Framework", profile.frameworks.map((f) => f.name).join(", ")]);
  }
  if (profile.isMonorepo) {
    pairs.push(["Repo type", "monorepo"]);
  }
  pairs.push(["Git", profile.isGitRepo ? "yes" : "no"]);

  const existing: string[] = [];
  if (profile.agentFiles.claudeMd) existing.push("CLAUDE.md");
  if (profile.agentFiles.claudeLocalMd) existing.push("CLAUDE.local.md");
  if (profile.agentFiles.agentsMd) existing.push("AGENTS.md");
  if (profile.agentFiles.claudeRules.length > 0) {
    existing.push(`${profile.agentFiles.claudeRules.length} rule(s)`);
  }
  if (existing.length > 0) {
    pairs.push(["Existing", existing.join(", ")]);
  }

  for (const [label, value] of pairs) {
    console.log(`  ${ui.dim(label.padEnd(12))}: ${value}`);
  }
  console.log();
}

function printProfile(profile: RepoProfile): void {
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

function printPlan(plan: RenderPlan): void {
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

function printPlanPreview(plan: RenderPlan): void {
  clackLog.step("File plan");

  for (const file of plan.filesToCreate) {
    console.log(`  ${ui.ok(symbols.success)} ${ui.dim("create")}  ${ui.path(file.relativePath)}${ui.dim(` (${file.lineCount} lines)`)}`);
  }
  for (const file of plan.filesToModify) {
    console.log(`  ${ui.warn(symbols.warn)} ${ui.dim("modify")}  ${ui.path(file.relativePath)}${ui.dim(` (${file.lineCount} lines)`)}`);
  }
  for (const file of plan.filesToSkip) {
    console.log(`  ${ui.dim(symbols.step)} ${ui.dim("skip")}    ${ui.dim(file.relativePath)} ${ui.dim("(exists)")}`);
  }

  for (const warning of plan.warnings) {
    if (warning.severity === "error") {
      console.log(`  ${ui.error(symbols.error)} ${ui.error(warning.message)}`);
    } else if (warning.severity === "warn") {
      console.log(`  ${ui.warn(symbols.warn)} ${ui.warn(`${warning.file}: ${warning.message}`)}`);
    } else {
      console.log(`  ${ui.dim(symbols.info)} ${ui.dim(`${warning.file}: ${warning.message}`)}`);
    }
  }
  console.log();
}

async function writeFiles(plan: RenderPlan, options: InitOptions): Promise<void> {
  const { cwd, dryRun } = options;

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

    if (options.createLocal) {
      const result = patchGitignore(cwd, ["CLAUDE.local.md"]);
      if (result.patched) {
        log.fileModify(".gitignore");
        log.dim(`  Added: ${result.added.join(", ")}`);
      }
    }
  }
}

async function writeFilesInteractive(plan: RenderPlan, options: InitOptions): Promise<void> {
  const { cwd } = options;

  const taskList = [
    ...plan.filesToCreate.map((file) => ({
      title: `Create ${file.relativePath}`,
      task: async () => {
        writeFileSafe(file.absolutePath, file.content);
        return `${file.lineCount} lines`;
      },
    })),
    ...plan.filesToModify.map((file) => ({
      title: `Modify ${file.relativePath}`,
      task: async () => {
        writeFileSafe(file.absolutePath, file.content, { backup: true });
        return `${file.lineCount} lines`;
      },
    })),
    ...(options.createLocal
      ? [
          {
            title: "Patch .gitignore for CLAUDE.local.md",
            task: async () => {
              const result = patchGitignore(cwd, ["CLAUDE.local.md"]);
              if (result.patched) {
                return `Added: ${result.added.join(", ")}`;
              }
              return "Already present";
            },
          },
        ]
      : []),
  ];

  await tasks(taskList);
}

function printNextSteps(options: InitOptions, plan: RenderPlan): void {
  const created = plan.filesToCreate.length;
  const modified = plan.filesToModify.length;

  if (created > 0 || modified > 0) {
    const parts: string[] = [];
    if (created > 0) parts.push(`${created} created`);
    if (modified > 0) parts.push(`${modified} modified`);
    console.log(`  ${ui.dim(parts.join(", "))}`);
    console.log();
  }

  console.log(`  ${ui.strong("Next steps:")}`);
  console.log(`  ${ui.dim(symbols.bullet)} Review generated files and customize for your project.`);
  console.log(`  ${ui.dim(symbols.bullet)} Update Project Overview and Repository Structure sections.`);
  console.log(`  ${ui.dim(symbols.bullet)} Run ${ui.code("contextkit doctor")} to check your setup.`);
  if (!options.createLocal) {
    console.log(`  ${ui.dim(symbols.bullet)} Use ${ui.code("contextkit init --with-local")} for CLAUDE.local.md.`);
  }
  console.log(`  ${ui.dim(symbols.bullet)} Consider adding hooks for mandatory actions (lint, test gates).`);
  console.log();
}
