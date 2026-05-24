#!/usr/bin/env bun

import { resolve } from "node:path";
import { initCommand } from "./commands/init.js";
import { doctorCommand } from "./commands/doctor.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { log } from "../io/logger.js";

const VERSION = "0.1.0";

function parseArgs(argv: string[]): {
  command: string;
  flags: Record<string, string | boolean>;
} {
  // Strip bun/node + script path
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
        // Check if next arg looks like a value (not for boolean flags)
        const boolFlags = [
          "dry-run", "dryrun", "force", "yes", "with-local",
          "import-agents", "with-hooks", "with-skills", "skills-only", "check-skills", "refresh-skills", "help", "version", "fix"
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
  console.log(`
${"\x1b[1m\x1b[36m"}contextkit${"\x1b[0m"} v${VERSION} — Claude Code memory scaffolder

${"\x1b[1m"}USAGE${"\x1b[0m"}
  contextkit <command> [flags]

${"\x1b[1m"}COMMANDS${"\x1b[0m"}
  init       Scaffold Claude Code memory files for a repository
  doctor     Check health of existing memory setup
  upgrade    Refresh memory structure and update installed skills

${"\x1b[1m"}DOCTOR FLAGS${"\x1b[0m"}
  --fix              Automatically extract rules and remove fluff
  --check-skills     Verify installed skills health
  --dry-run, -n      Preview fixes without writing

${"\x1b[1m"}UPGRADE FLAGS${"\x1b[0m"}
  --refresh-skills   Update installed skills via autoskills

${"\x1b[1m"}INIT FLAGS${"\x1b[0m"}
  --stack <name>     Override auto-detection (auto|bun|node|next|react|python|go|rust|monorepo)
  --cwd <path>       Set working directory (default: .)
  --dry-run, -n      Preview changes without writing
  --force, -f        Overwrite existing files
  --yes, -y          Skip confirmation prompts
  --with-local       Create CLAUDE.local.md (gitignored personal notes)
  --import-agents    Import existing AGENTS.md into CLAUDE.md
  --with-skills      Install recommended AI agent skills via autoskills
  --skills-only      Only run the skills installer, skip memory scaffolding
  --with-hooks       Include hook scaffolding (coming soon)
  --mode <mode>      Template mode: minimal or opinionated (default: opinionated)

${"\x1b[1m"}EXAMPLES${"\x1b[0m"}
  contextkit init                    Auto-detect and scaffold
  contextkit init --stack next       Force Next.js preset
  contextkit init --dry-run          Preview without writing
  contextkit init -y --with-local    Non-interactive with local file
  contextkit doctor                  Check existing setup
`);
}

async function main() {
  const { command, flags } = parseArgs(process.argv);

  if (flags["version"]) {
    console.log(VERSION);
    return;
  }

  if (command === "help" || flags["help"]) {
    printHelp();
    return;
  }

  log.banner();

  const cwd = resolve((flags["cwd"] as string) || ".");

  switch (command) {
    case "init": {
      await initCommand({
        cwd,
        dryRun: !!flags["dry-run"] || !!flags["dryrun"],
        force: !!flags["force"],
        yes: !!flags["yes"],
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
