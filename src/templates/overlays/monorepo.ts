import type { Overlay } from "../../types/index.js";

export const monorepoOverlay: Overlay = {
  id: "monorepo",
  rootSections: [
    {
      id: "monorepo-structure",
      heading: "Monorepo",
      bullets: [
        "This is a monorepo — changes should be scoped to the relevant package or app.",
        "Shared code lives in `packages/` — app-specific code lives in `apps/`.",
        "Check downstream consumers before modifying shared packages.",
        "Each workspace may have its own `CLAUDE.md` for package-specific instructions.",
      ],
    },
  ],
  rules: [
    {
      id: "rule-monorepo",
      targetPath: ".claude/rules/monorepo.md",
      paths: ["packages/**/*", "apps/**/*"],
      heading: "Monorepo Rules",
      bullets: [
        "When modifying a shared package, verify that dependent apps still build.",
        "Prefer workspace-level commands over root-level for package-specific operations.",
        "Keep package boundaries clear — avoid reaching into sibling package internals.",
        "Add or update package-level `CLAUDE.md` for package-specific conventions.",
      ],
    },
  ],
  contextOverrides: {},
};
