import React from "react";
import { render } from "ink";
import { App } from "../../ui/ink/App.js";

interface WatchOptions {
  cwd: string;
}

/**
 * The `contextkit watch` command — launches the persistent Ink TUI daemon.
 */
export async function watchCommand(options: WatchOptions): Promise<void> {
  const { cwd } = options;

  // Render the Ink app
  const { waitUntilExit, clear } = render(
    React.createElement(App, { cwd }),
    {
      // Don't patch console.log — we use Ink's Text components
      patchConsole: false,
    },
  );

  // Handle graceful shutdown
  const cleanup = () => {
    clear();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  // Wait for the app to exit (Ctrl+C or q)
  await waitUntilExit();
}
