import React, { useEffect, useRef } from "react";
import { Box } from "ink";
import { Header } from "./components/Header.js";
import { TreeView } from "./components/TreeView.js";
import { StatsPanel } from "./components/StatsPanel.js";
import { LogViewer } from "./components/LogViewer.js";
import { useProviderDetection } from "./hooks/useProviderDetection.js";
import { useGitBranch } from "./hooks/useGitBranch.js";
import { useDaemonStore } from "./store.js";
import { ContextWatcher } from "../../core/watcher.js";
import { detectRepo } from "../../core/detect/index.js";

interface AppProps {
  cwd: string;
}

export function App({ cwd }: AppProps): React.ReactElement {
  const watcherRef = useRef<ContextWatcher | null>(null);

  // Store actions
  const setCwd = useDaemonStore((s) => s.setCwd);
  const setProjectName = useDaemonStore((s) => s.setProjectName);
  const setFrameworks = useDaemonStore((s) => s.setFrameworks);
  const setLanguages = useDaemonStore((s) => s.setLanguages);
  const setDirectories = useDaemonStore((s) => s.setDirectories);
  const setWatchedFiles = useDaemonStore((s) => s.setWatchedFiles);
  const setWatching = useDaemonStore((s) => s.setWatching);
  const addLog = useDaemonStore((s) => s.addLog);

  // Initialize hooks
  useProviderDetection(cwd);
  useGitBranch(cwd);

  // Initial repo scan
  useEffect(() => {
    setCwd(cwd);
    addLog("info", "Starting ContextKit daemon...");

    const profile = detectRepo(cwd);
    setProjectName(profile.projectName);
    setFrameworks(profile.frameworks.map((f) => f.name));
    setLanguages(profile.languages.map((l) => l.name));
    setDirectories(profile.directories);

    addLog(
      "scan",
      `Detected ${profile.frameworks.length} framework(s), ${profile.languages.length} language(s)`,
    );
  }, [cwd]);

  // File watcher
  useEffect(() => {
    const watcher = new ContextWatcher(cwd, {
      onFileChange: (rel) => {
        addLog("watch", `Modified ${rel} → Rebuilding context...`);
      },
      onFileAdd: (rel) => {
        // Only log non-initial adds (watcher is noisy on startup)
      },
      onFileRemove: (rel) => {
        addLog("watch", `Removed ${rel}`);
      },
      onReady: (count) => {
        setWatchedFiles(count);
        setWatching(true);
        addLog("ok", `Watching ${count} files — context ready`);
      },
      onError: (error) => {
        addLog("error", `Watcher error: ${error.message}`);
      },
    });

    watcher.start();
    watcherRef.current = watcher;

    return () => {
      watcher.stop();
    };
  }, [cwd]);

  return (
    <Box flexDirection="column" minHeight={15}>
      {/* Top Bar */}
      <Header />

      {/* Middle Section — two panes */}
      <Box flexDirection="row" flexGrow={1} minHeight={8}>
        {/* Left: Project Tree */}
        <Box width="50%">
          <TreeView />
        </Box>

        {/* Right: Stats */}
        <Box width="50%">
          <StatsPanel />
        </Box>
      </Box>

      {/* Bottom: Activity Log */}
      <LogViewer />
    </Box>
  );
}
