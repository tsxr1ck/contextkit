import type { Overlay } from "../../types/index.js";

export const nodeOverlay: Overlay = {
  id: "node",
  rootSections: [],
  rules: [],
  contextOverrides: {
    // Detect actual manager from package managers; default to npm
    packageManager: "npm",
    devCommand: "npm run dev",
    buildCommand: "npm run build",
    testCommand: "npm test",
  },
};
