import { runDoctor } from "../../core/doctor/index.js";
import { applyFixes } from "../../core/doctor/fix.js";
import { SkillsAdapter } from "../../skills/adapter.js";
import { log } from "../../io/logger.js";
import { writeFileSafe, patchGitignore } from "../../io/fs.js";
import { confirm } from "../../io/prompts.js";
import { ui } from "../../ui/format/colors.js";
import { symbols } from "../../ui/format/symbols.js";
import type { RenderPlan } from "../../types/index.js";

const SEVERITY_CONFIG = {
  high: { color: ui.error, symbol: symbols.error },
  medium: { color: ui.warn, symbol: symbols.warn },
  low: { color: ui.dim, symbol: symbols.info },
} as const;

/**
 * The `doctor` command — inspect existing memory setup and report problems.
 * If `--fix` is passed, automatically repair detected issues.
 */
export async function doctorCommand(options: {
  cwd: string;
  fix: boolean;
  checkSkills: boolean;
  dryRun: boolean;
  yes: boolean;
}): Promise<void> {
  if (options.dryRun) log.setDryRun(true);
  log.heading("Running doctor checks…");
  log.newline();

  const report = runDoctor(options.cwd);

  if (options.checkSkills) {
    log.info("Checking installed skills health…");
    const adapter = new SkillsAdapter(options.cwd);
    await adapter.checkSkills();
  }

  if (report.findings.length === 0) {
    log.success("No issues found — your memory setup looks healthy!");
    log.newline();
    return;
  }

  // Group by severity
  const grouped = {
    high: report.findings.filter((f) => f.severity === "high"),
    medium: report.findings.filter((f) => f.severity === "medium"),
    low: report.findings.filter((f) => f.severity === "low"),
  };

  for (const [severity, findings] of Object.entries(grouped)) {
    if (findings.length === 0) continue;

    const config = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG];
    console.log(config.color(`${severity.toUpperCase()} (${findings.length})`));

    for (const finding of findings) {
      const filePart = finding.file ? ` [${finding.file}]` : "";
      console.log(`  ${config.color(symbols.bullet)} ${finding.message}${filePart}`);
      if (finding.suggestion) {
        console.log(`    ${ui.dim(symbols.arrow)} ${finding.suggestion}`);
      }
    }
    console.log();
  }

  // Score
  log.divider();
  const scoreColor =
    report.score >= 80 ? ui.ok : report.score >= 50 ? ui.warn : ui.error;
  console.log(scoreColor(`Score: ${report.score}/100`));
  log.dim(report.summary);
  log.newline();

  // ── Auto-fix Mode ──
  if (options.fix) {
    if (report.findings.length === 0) return;

    log.heading("Generating fix plan…");
    const plan = applyFixes(options.cwd, report);
    
    if (plan.filesToCreate.length === 0 && plan.filesToModify.length === 0) {
      log.info("No automated fixes available for these issues.");
      return;
    }

    printPlan(plan);

    if (!options.yes && !options.dryRun) {
      log.newline();
      const proceed = await confirm("Apply these fixes?");
      if (!proceed) {
        log.dim("Aborted.");
        return;
      }
    }

    if (options.dryRun) {
      log.heading("Dry run — no files written.");
    } else {
      log.heading("Applying fixes…");

      for (const file of plan.filesToCreate) {
        writeFileSafe(file.absolutePath, file.content);
        log.fileCreate(file.relativePath);
      }
      for (const file of plan.filesToModify) {
        if (file.relativePath === ".gitignore") {
          const result = patchGitignore(options.cwd, ["CLAUDE.local.md"]);
          if (result.patched) {
            log.fileModify(".gitignore");
            log.dim(`  Added: ${result.added.join(", ")}`);
          }
        } else {
          writeFileSafe(file.absolutePath, file.content, { backup: true });
          log.fileModify(file.relativePath);
        }
      }
      log.newline();
      log.success("Fixes applied successfully!");
    }
  } else if (report.findings.length > 0) {
    log.info("Run `contextkit doctor --fix` to automatically resolve some issues.");
  }
}

function printPlan(plan: RenderPlan) {
  for (const file of plan.filesToCreate) {
    log.fileCreate(`${file.relativePath} (${file.lineCount} lines)`);
  }
  for (const file of plan.filesToModify) {
    log.fileModify(`${file.relativePath} (${file.lineCount} lines)`);
  }
  for (const warning of plan.warnings) {
    log.warn(`${warning.file}: ${warning.message}`);
  }
  log.newline();
}
