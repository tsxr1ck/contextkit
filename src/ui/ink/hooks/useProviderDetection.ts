import { useEffect } from "react";
import { useDaemonStore, type ProviderInfo } from "../store.js";

/**
 * Detect AI coding providers from the workspace.
 * Maps known config files/directories to provider names.
 */
function scanProviders(cwd: string): ProviderInfo[] {
  const { existsSync } = require("node:fs");
  const { join } = require("node:path");

  const checks: Array<{ name: string; paths: string[] }> = [
    {
      name: "Claude Code",
      paths: ["CLAUDE.md", ".claude"],
    },
    {
      name: "Cursor",
      paths: [".cursor", ".cursorrules"],
    },
    {
      name: "Windsurf",
      paths: [".windsurf", ".windsurfrules"],
    },
    {
      name: "Aider",
      paths: [".aider.conf.yml", ".aiderignore"],
    },
    {
      name: "OpenCode",
      paths: [".opencode"],
    },
  ];

  const providers: ProviderInfo[] = [];

  for (const check of checks) {
    for (const p of check.paths) {
      const fullPath = join(cwd, p);
      if (existsSync(fullPath)) {
        providers.push({
          name: check.name,
          detected: true,
          configPath: p,
        });
        break; // one match per provider is enough
      }
    }
  }

  return providers;
}

export function useProviderDetection(cwd: string): void {
  const setProvider = useDaemonStore((s) => s.setProvider);
  const setDetectedProviders = useDaemonStore((s) => s.setDetectedProviders);
  const addLog = useDaemonStore((s) => s.addLog);

  useEffect(() => {
    const providers = scanProviders(cwd);
    setDetectedProviders(providers);

    if (providers.length === 1) {
      setProvider(providers[0].name);
      addLog("scan", `Detected provider: ${providers[0].name}`);
    } else if (providers.length > 1) {
      // Default to first detected; user can change via TUI later
      setProvider(providers[0].name);
      addLog(
        "scan",
        `Detected ${providers.length} providers: ${providers.map((p) => p.name).join(", ")}`,
      );
    } else {
      addLog("scan", "No AI coding providers detected");
    }
  }, [cwd]);
}
