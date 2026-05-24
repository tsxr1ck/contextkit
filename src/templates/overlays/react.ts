import type { Overlay } from "../../types/index.js";

export const reactOverlay: Overlay = {
  id: "react",
  rootSections: [],
  rules: [
    {
      id: "rule-frontend",
      targetPath: ".claude/rules/frontend.md",
      paths: ["src/components/**/*.{ts,tsx}", "app/**/*.tsx", "src/app/**/*.tsx"],
      heading: "Frontend Rules",
      bullets: [
        "Prefer existing UI primitives before creating new component abstractions.",
        "Keep presentational components free of server-only code.",
        "Co-locate component styles, tests, and types when practical.",
        "Use composition over prop drilling — prefer context or compound components for shared state.",
        "For visual changes, verify the affected route instead of changing unrelated styling.",
      ],
    },
  ],
  contextOverrides: {},
};
