import { create } from "zustand";
import type { AgentProvider } from "../../types/index.js";

// ── Types ────────────────────────────────────────────────────

export interface LogEntry {
  level: "info" | "warn" | "error" | "watch" | "scan" | "ok";
  message: string;
  timestamp: number;
}

export interface ProviderInfo {
  name: AgentProvider;
  label: string;
  detected: boolean;
  configPath: string;
}

export interface DaemonState {
  // Core state
  targetProviders: AgentProvider[];
  detectedProviders: ProviderInfo[];
  gitBranch: string;
  cwd: string;
  projectName: string;

  // Watcher state
  watchedFiles: number;
  isParsing: boolean;
  isWatching: boolean;
  mode: "lean" | "full";

  // Detection results
  frameworks: string[];
  languages: string[];
  directories: string[];
  tokenEstimate: number;
  tokenSavings: number;

  // Logs
  recentLogs: LogEntry[];
  maxLogs: number;

  // Actions
  addLog: (level: LogEntry["level"], message: string) => void;
  setProviders: (providers: AgentProvider[]) => void;
  setDetectedProviders: (providers: ProviderInfo[]) => void;
  setBranch: (branch: string) => void;
  setCwd: (cwd: string) => void;
  setProjectName: (name: string) => void;
  setMode: (mode: "lean" | "full") => void;
  setWatchedFiles: (count: number) => void;
  setParsing: (parsing: boolean) => void;
  setWatching: (watching: boolean) => void;
  setFrameworks: (frameworks: string[]) => void;
  setLanguages: (languages: string[]) => void;
  setDirectories: (directories: string[]) => void;
  setTokenEstimate: (tokens: number) => void;
  setTokenSavings: (savings: number) => void;
}

// ── Store ─────────────────────────────────────────────────────

export const useDaemonStore = create<DaemonState>((set) => ({
  // Initial state
  targetProviders: [],
  detectedProviders: [],
  gitBranch: "",
  cwd: "",
  projectName: "",

  watchedFiles: 0,
  isParsing: false,
  isWatching: false,
  mode: "full",

  frameworks: [],
  languages: [],
  directories: [],
  tokenEstimate: 0,
  tokenSavings: 0,

  recentLogs: [],
  maxLogs: 5,

  // Actions
  addLog: (level, message) =>
    set((state) => ({
      recentLogs: [
        { level, message, timestamp: Date.now() },
        ...state.recentLogs,
      ].slice(0, state.maxLogs),
    })),

  setProviders: (providers) => set({ targetProviders: providers }),
  setDetectedProviders: (providers) => set({ detectedProviders: providers }),
  setBranch: (branch) => set({ gitBranch: branch }),
  setCwd: (cwd) => set({ cwd }),
  setProjectName: (name) => set({ projectName: name }),
  setMode: (mode) => set({ mode }),
  setWatchedFiles: (count) => set({ watchedFiles: count }),
  setParsing: (parsing) => set({ isParsing: parsing }),
  setWatching: (watching) => set({ isWatching: watching }),
  setFrameworks: (frameworks) => set({ frameworks }),
  setLanguages: (languages) => set({ languages }),
  setDirectories: (directories) => set({ directories }),
  setTokenEstimate: (tokens) => set({ tokenEstimate: tokens }),
  setTokenSavings: (savings) => set({ tokenSavings: savings }),
}));
