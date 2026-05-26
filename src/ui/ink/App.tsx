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
import { buildRenderPlan } from "../../core/render/index.js";
import { resolvePresets } from "../../core/presets/index.js";
import { writeFileSafe } from "../../io/fs.js";
import type { InitOptions } from "../../types/index.js";

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
  const setParsing = useDaemonStore((s) => s.setParsing);

  const rebuildContext = () => {
    const targetProviders = useDaemonStore.getState().targetProviders;
    setParsing(true);
    try {
      const profile = detectRepo(cwd);
      setProjectName(profile.projectName);
      setFrameworks(profile.frameworks.map((f) => f.name));
      setLanguages(profile.languages.map((l) => l.name));
      setDirectories(profile.directories);

      const presets = resolvePresets(profile, {
        stackOverride: null,
        selectedOverlays: [],
        importAgents: false,
      });

      const options: InitOptions = {
        mode: "opinionated",
        createLocal: false,
        importAgents: false,
        includeHooks: false,
        withSkills: false,
        skillsOnly: false,
        selectedOverlays: [],
        dryRun: false,
        force: true,
        yes: true,
        json: false,
        cwd,
        stackOverride: null,
        targetProviders,
      };

      const plan = buildRenderPlan(profile, presets, options);
      
      // Only overwrite master context files in watch mode to avoid destroying user-edited rules
      const masterPaths = ["CLAUDE.md", ".cursorrules", ".windsurfrules", ".swarm/context.md"];

      let wroteCount = 0;
      for (const file of [...plan.filesToCreate, ...plan.filesToModify]) {
        if (masterPaths.includes(file.relativePath)) {
          writeFileSafe(file.absolutePath, file.content);
          wroteCount++;
        }
      }

      if (wroteCount > 0) {
        addLog("ok", `Context updated for ${targetProviders.length} provider(s)`);
      }
    } catch (e: any) {
      addLog("error", `Rebuild failed: ${e.message}`);
    } finally {
      setParsing(false);
    }
  };

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
        const ignored = ["CLAUDE.md", "CLAUDE.local.md", ".cursorrules", ".windsurfrules", ".swarm/context.md"];
        if (ignored.includes(rel)) return;

        addLog("watch", `Modified ${rel} → Rebuilding context...`);
        rebuildContext();
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
