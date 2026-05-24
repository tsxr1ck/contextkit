import type { Overlay } from "../../types/index.js";
import { typescriptOverlay } from "./typescript.js";
import { bunOverlay } from "./bun.js";
import { nodeOverlay } from "./node.js";
import { reactOverlay } from "./react.js";
import { nextOverlay } from "./next.js";
import { pythonOverlay } from "./python.js";
import { goOverlay } from "./go.js";
import { monorepoOverlay } from "./monorepo.js";

/** Registry of all available overlays */
export const overlayRegistry: Record<string, Overlay> = {
  typescript: typescriptOverlay,
  bun: bunOverlay,
  node: nodeOverlay,
  react: reactOverlay,
  next: nextOverlay,
  python: pythonOverlay,
  go: goOverlay,
  monorepo: monorepoOverlay,
};

export function getOverlay(id: string): Overlay | undefined {
  return overlayRegistry[id];
}

export function getAvailableOverlayIds(): string[] {
  return Object.keys(overlayRegistry);
}
