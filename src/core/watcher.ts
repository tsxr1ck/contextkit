import { watch, type FSWatcher } from "chokidar";
import { relative } from "node:path";

// ── Types ────────────────────────────────────────────────────

export interface WatcherCallbacks {
  onFileChange: (relativePath: string) => void;
  onFileAdd: (relativePath: string) => void;
  onFileRemove: (relativePath: string) => void;
  onReady: (watchedCount: number) => void;
  onError: (error: Error) => void;
}

// ── Default ignore patterns ──────────────────────────────────

const IGNORED_PATTERNS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/.nuxt/**",
  "**/.svelte-kit/**",
  "**/coverage/**",
  "**/.turbo/**",
  "**/.cache/**",
  "**/tmp/**",
  "**/*.lock",
  "**/bun.lockb",
  "**/bun.lock",
  "**/.DS_Store",
];

// ── Debounce utility ─────────────────────────────────────────

function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number,
): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

// ── Watcher ──────────────────────────────────────────────────

export class ContextWatcher {
  private watcher: FSWatcher | null = null;
  private cwd: string;
  private callbacks: WatcherCallbacks;
  private fileCount = 0;

  constructor(cwd: string, callbacks: WatcherCallbacks) {
    this.cwd = cwd;
    this.callbacks = callbacks;
  }

  /**
   * Start watching the project directory.
   */
  start(): void {
    this.watcher = watch(this.cwd, {
      ignored: IGNORED_PATTERNS,
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    // Debounce change events to prevent thrashing
    const debouncedChange = debounce((path: string) => {
      const rel = relative(this.cwd, path);
      this.callbacks.onFileChange(rel);
    }, 500);

    this.watcher
      .on("add", (path: string) => {
        this.fileCount++;
        const rel = relative(this.cwd, path);
        this.callbacks.onFileAdd(rel);
      })
      .on("change", (path: string) => {
        debouncedChange(path);
      })
      .on("unlink", (path: string) => {
        this.fileCount = Math.max(0, this.fileCount - 1);
        const rel = relative(this.cwd, path);
        this.callbacks.onFileRemove(rel);
      })
      .on("ready", () => {
        this.callbacks.onReady(this.fileCount);
      })
      .on("error", (err: unknown) => {
        const error = err instanceof Error ? err : new Error(String(err));
        this.callbacks.onError(error);
      });
  }

  /**
   * Stop watching and clean up.
   */
  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }

  /**
   * Get the current number of watched files.
   */
  getFileCount(): number {
    return this.fileCount;
  }
}
