import type { Overlay } from "../../types/index.js";

export const typescriptOverlay: Overlay = {
  id: "typescript",
  rootSections: [
    {
      id: "typescript-rules",
      heading: "TypeScript",
      bullets: [
        "Use strict TypeScript — avoid `any` unless justified with a comment.",
        "Prefer `interface` for object shapes, `type` for unions and intersections.",
        "Use `as const` for literal types and `satisfies` for type-safe assignments.",
        "Prefer `unknown` over `any` for untyped boundaries.",
      ],
    },
  ],
  rules: [],
  contextOverrides: {
    primaryLanguage: "TypeScript",
  },
};
