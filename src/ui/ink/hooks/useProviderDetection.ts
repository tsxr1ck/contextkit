import { useEffect } from "react";
import { useDaemonStore, type ProviderInfo } from "../store.js";
import type { AgentProvider } from "../../../types/index.js";

/**
 * Detect AI coding providers from the workspace.
 * Maps known config files/directories to provider names.
 */
function scanProviders(cwd: string): ProviderInfo[] {
  const { existsSync } = require("node:fs");
  const { join } = require("node:path");

  const checks: Array<{ name: AgentProvider; label: string; paths: string[] }> = [
    {
      name: "claude",
      label: "Claude Code",
      paths: ["CLAUDE.md", ".claude"],
    },
    {
      name: "cursor",
      label: "Cursor",
      paths: [".cursor", ".cursorrules"],
    },
    {
      name: "windsurf",
      label: "Windsurf",
      paths: [".windsurf", ".windsurfrules"],
    },
    {
      name: "opencode",
      label: "OpenCode",
      paths: [".opencode", ".swarm"],
    },
  ];

  const providers: ProviderInfo[] = [];

  for (const check of checks) {
    for (const p of check.paths) {
      const fullPath = join(cwd, p);
      if (existsSync(fullPath)) {
        providers.push({
          name: check.name,
          label: check.label,
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
  const setProviders = useDaemonStore((s) => s.setProviders);
  const setDetectedProviders = useDaemonStore((s) => s.setDetectedProviders);
  const addLog = useDaemonStore((s) => s.addLog);

  useEffect(() => {
    const providers = scanProviders(cwd);
    setDetectedProviders(providers);

    const providerNames = providers.map((p) => p.name);

    if (providerNames.length > 0) {
      setProviders(providerNames);
      addLog(
        "scan",
        `Target providers: ${providers.map((p) => p.label).join(", ")}`,
      );
    } else {
      setProviders(["claude"]);
      addLog("scan", "No AI coding providers detected. Defaulting to Claude.");
    }
  }, [cwd]);
}
