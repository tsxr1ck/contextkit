import type { Overlay } from "../../types/index.js";

export const nextOverlay: Overlay = {
  id: "next",
  rootSections: [
    {
      id: "next-conventions",
      heading: "Next.js",
      bullets: [
        "App Router is the primary routing model — use `app/` directory.",
        "Server Components are the default. Add `\"use client\"` only when needed for interactivity.",
        "Use `loading.tsx`, `error.tsx`, and `not-found.tsx` for route-level UI states.",
        "Prefer Server Actions for mutations over separate API routes when appropriate.",
      ],
    },
  ],
  rules: [
    {
      id: "rule-frontend",
      targetPath: ".claude/rules/frontend.md",
      paths: ["src/components/**/*.{ts,tsx}", "app/**/*.tsx", "src/app/**/*.tsx", "components/**/*.tsx"],
      heading: "Frontend Rules",
      bullets: [
        "Prefer existing UI primitives before creating new component abstractions.",
        "Server Components are the default — only add `\"use client\"` for interactivity, event handlers, or browser APIs.",
        "Keep `page.tsx` lean — extract complex UI into separate components.",
        "Co-locate component styles, tests, and types when practical.",
        "For visual changes, verify the affected route instead of changing unrelated styling.",
      ],
    },
  ],
  contextOverrides: {
    devCommand: "npm run dev",
    buildCommand: "npm run build",
  },
};
