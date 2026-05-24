#!/usr/bin/env bun

import { resolve } from "node:path";
import { initCommand } from "./commands/init.js";
import { doctorCommand } from "./commands/doctor.js";
import { auditCommand } from "./commands/audit.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { log } from "../io/logger.js";
import { ui } from "../ui/format/colors.js";

const VERSION = "0.1.0";

function parseArgs(argv: string[]): {
  command: string;
  flags: Record<string, string | boolean>;
} {
  const args = argv.slice(2);
  const command = args[0] && !args[0].startsWith("-") ? args[0] : "help";
  const flags: Record<string, string | boolean> = {};

  for (let i = command === "help" ? 0 : 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const eqIdx = key.indexOf("=");
      if (eqIdx !== -1) {
        flags[key.slice(0, eqIdx)] = key.slice(eqIdx + 1);
      } else if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        const boolFlags = [
          "dry-run", "dryrun", "force", "yes", "with-local",
          "import-agents", "with-hooks", "with-skills", "skills-only", "check-skills", "refresh-skills", "help", "version", "fix", "json"
        ];
        if (boolFlags.includes(key)) {
          flags[key] = true;
        } else {
          flags[key] = args[++i];
        }
      } else {
        flags[key] = true;
      }
    } else if (arg === "-y") {
      flags["yes"] = true;
    } else if (arg === "-f") {
      flags["force"] = true;
    } else if (arg === "-n") {
      flags["dry-run"] = true;
    }
  }

  return { command, flags };
}

function printHelp() {
  console.log();
  console.log(`  ${ui.brand("contextkit")} ${ui.dim(`v${VERSION}`)} ${ui.dim("— Claude Code memory scaffolder")}`);
  console.log();
  console.log(`  ${ui.strong("USAGE")}`);
  console.log(`    contextkit <command> [flags]`);
  console.log();
  console.log(`  ${ui.strong("COMMANDS")}`);
  console.log(`    init       Scaffold Claude Code memory files for a repository`);
  console.log(`    doctor     Check health of existing memory setup`);
  console.log(`    audit      Score memory quality across categories`);
  console.log(`    upgrade    Refresh memory structure and update installed skills`);
  console.log();
  console.log(`  ${ui.strong("DOCTOR FLAGS")}`);
  console.log(`    --fix              Automatically extract rules and remove fluff`);
  console.log(`    --check-skills     Verify installed skills health`);
  console.log(`    --dry-run, -n      Preview fixes without writing`);
  console.log();
  console.log(`  ${ui.strong("UPGRADE FLAGS")}`);
  console.log(`    --refresh-skills   Update installed skills via autoskills`);
  console.log();
  console.log(`  ${ui.strong("INIT FLAGS")}`);
  console.log(`    --stack <name>     Override auto-detection (auto|bun|node|next|react|python|go|rust|monorepo)`);
  console.log(`    --cwd <path>       Set working directory (default: .)`);
  console.log(`    --dry-run, -n      Preview changes without writing`);
  console.log(`    --force, -f        Overwrite existing files`);
  console.log(`    --yes, -y          Skip confirmation prompts`);
  console.log(`    --with-local       Create CLAUDE.local.md (gitignored personal notes)`);
  console.log(`    --import-agents    Import existing AGENTS.md into CLAUDE.md`);
  console.log(`    --with-skills      Install recommended AI agent skills via autoskills`);
  console.log(`    --skills-only      Only run the skills installer, skip memory scaffolding`);
  console.log(`    --with-hooks       Include hook scaffolding (coming soon)`);
  console.log(`    --mode <mode>      Template mode: minimal or opinionated (default: opinionated)`);
  console.log(`    --json             Output results as JSON (for scripting/CI)`);
  console.log();
  console.log(`  ${ui.strong("EXAMPLES")}`);
  console.log(`    contextkit init                    Auto-detect and scaffold`);
  console.log(`    contextkit init --stack next       Force Next.js preset`);
  console.log(`    contextkit init --dry-run          Preview without writing`);
  console.log(`    contextkit init -y --with-local    Non-interactive with local file`);
  console.log(`    contextkit doctor                  Check existing setup`);
  console.log(`    contextkit audit                   Score memory quality`);
  console.log(`    contextkit audit --json            JSON output for scripting`);
  console.log();
}

async function main() {
  const { command, flags } = parseArgs(process.argv);

  if (flags["version"]) {
    console.log(VERSION);
    return;
  }

  log.banner();

  if (command === "help" || flags["help"]) {
    printHelp();
    return;
  }

  const cwd = resolve((flags["cwd"] as string) || ".");

  switch (command) {
    case "init": {
      await initCommand({
        cwd,
        dryRun: !!flags["dry-run"] || !!flags["dryrun"],
        force: !!flags["force"],
        yes: !!flags["yes"],
        json: !!flags["json"],
        createLocal: !!flags["with-local"],
        importAgents: !!flags["import-agents"],
        withSkills: !!flags["with-skills"],
        skillsOnly: !!flags["skills-only"],
        includeHooks: !!flags["with-hooks"],
        mode: (flags["mode"] as "minimal" | "opinionated") || "opinionated",
        stackOverride: (flags["stack"] as string) || null,
        selectedOverlays: [],
      });
      break;
    }

    case "doctor": {
      await doctorCommand({
        cwd,
        fix: !!flags["fix"],
        checkSkills: !!flags["check-skills"],
        dryRun: !!flags["dry-run"] || !!flags["dryrun"],
        yes: !!flags["yes"],
      });
      break;
    }

    case "audit": {
      await auditCommand({
        cwd,
        json: !!flags["json"],
      });
      break;
    }

    case "upgrade": {
      await upgradeCommand({
        cwd,
        refreshSkills: !!flags["refresh-skills"],
      });
      break;
    }

    default: {
      log.error(`Unknown command: ${command}`);
      log.dim('Run "contextkit help" for usage.');
      process.exit(1);
    }
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
