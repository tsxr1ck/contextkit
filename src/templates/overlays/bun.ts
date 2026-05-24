import type { Overlay } from "../../types/index.js";

export const bunOverlay: Overlay = {
  id: "bun",
  rootSections: [
    {
      id: "bun-runtime",
      heading: "Bun Runtime",
      bullets: [
        "This project uses Bun as runtime and package manager.",
        "Use `bun` instead of `node` for execution and `bun install` for dependencies.",
        "Bun supports TypeScript and JSX natively — no build step needed for development.",
        "Use `Bun.file()`, `Bun.write()`, `Bun.serve()` for Bun-native APIs where appropriate.",
      ],
    },
  ],
  rules: [],
  contextOverrides: {
    packageManager: "bun",
    devCommand: "bun run dev",
    buildCommand: "bun run build",
    testCommand: "bun test",
  },
};
