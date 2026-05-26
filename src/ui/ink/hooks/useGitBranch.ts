import { useEffect, useRef } from "react";
import { useDaemonStore } from "../store.js";

/**
 * Read the current git branch from the filesystem.
 */
function getCurrentBranch(cwd: string): string {
  try {
    const { execSync } = require("node:child_process");
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd,
      stdio: "pipe",
      encoding: "utf-8",
    }).trim();
    return branch;
  } catch {
    return "";
  }
}

/**
 * Hook that tracks the current git branch and polls for changes.
 * Uses a 5-second polling interval to detect branch switches.
 */
export function useGitBranch(cwd: string): void {
  const setBranch = useDaemonStore((s) => s.setBranch);
  const addLog = useDaemonStore((s) => s.addLog);
  const lastBranch = useRef<string>("");

  useEffect(() => {
    // Initial read
    const initial = getCurrentBranch(cwd);
    setBranch(initial);
    lastBranch.current = initial;

    if (initial) {
      addLog("info", `Git branch: ${initial}`);
    }

    // Poll for branch changes
    const interval = setInterval(() => {
      const current = getCurrentBranch(cwd);
      if (current && current !== lastBranch.current) {
        setBranch(current);
        addLog("scan", `Branch switched: ${lastBranch.current} → ${current}`);
        lastBranch.current = current;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cwd]);
}
