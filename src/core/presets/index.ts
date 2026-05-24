import type {
  RepoProfile,
  PresetResult,
  TemplateContext,
  TemplateSection,
  RuleTemplate,
} from "../../types/index.js";
import { baseRootSections } from "../../templates/base/root.js";
import { overlayRegistry, getOverlay } from "../../templates/overlays/index.js";
import { backendRule, databaseRule, testingRule, architectureRule } from "../../templates/rules/index.js";

const CONFIDENCE_THRESHOLD = 3;

/**
 * Resolve which overlays and rules to include based on the repo profile and flags.
 */
export function resolvePresets(
  profile: RepoProfile,
  options: {
    stackOverride: string | null;
    selectedOverlays?: string[];
    importAgents: boolean;
  }
): PresetResult {
  // Step 1: Determine active overlays
  const activeOverlays = resolveOverlays(profile, options);

  // Step 2: Build template context from profile + overlay overrides
  const context = buildContext(profile, activeOverlays, options.importAgents);

  // Step 3: Collect all root sections (base + overlay)
  const rootSections = collectRootSections(context, activeOverlays);

  // Step 4: Collect all rule templates (overlay + structure-based defaults)
  const rules = collectRules(profile, activeOverlays);

  return { activeOverlays, context, rootSections, rules };
}

function resolveOverlays(
  profile: RepoProfile,
  options: { stackOverride: string | null; selectedOverlays?: string[] }
): string[] {
  // If user specified overlays directly, use those
  if (options.selectedOverlays && options.selectedOverlays.length > 0) {
    return options.selectedOverlays.filter((id) => overlayRegistry[id]);
  }

  // If user specified a stack override, map it to overlays
  if (options.stackOverride && options.stackOverride !== "auto") {
    return resolveStackToOverlays(options.stackOverride);
  }

  // Auto-detect: include overlays where confidence exceeds threshold
  const auto: string[] = [];

  for (const [overlayId] of Object.entries(overlayRegistry)) {
    const confidence = profile.confidence[overlayId] ?? 0;
    if (confidence >= CONFIDENCE_THRESHOLD) {
      auto.push(overlayId);
    }
  }

  // Special cases
  if (profile.isMonorepo && !auto.includes("monorepo")) {
    auto.push("monorepo");
  }

  // If both bun and node qualify, prefer bun (they're mutually exclusive for pm)
  if (auto.includes("bun") && auto.includes("node")) {
    auto.splice(auto.indexOf("node"), 1);
  }

  // If next is active, ensure react is too (next implies react)
  if (auto.includes("next") && !auto.includes("react")) {
    // Don't add react separately — next overlay includes frontend rules
  }

  return auto;
}

function resolveStackToOverlays(stack: string): string[] {
  const mappings: Record<string, string[]> = {
    bun: ["bun", "typescript"],
    node: ["node", "typescript"],
    next: ["next", "typescript"],
    react: ["react", "typescript"],
    python: ["python"],
    go: ["go"],
    rust: [], // rust overlay not yet implemented
    monorepo: ["monorepo"],
  };
  return mappings[stack] ?? [];
}

function buildContext(
  profile: RepoProfile,
  overlays: string[],
  importAgents: boolean
): TemplateContext {
  // Start with defaults
  const ctx: TemplateContext = {
    projectName: profile.projectName,
    primaryLanguage: inferPrimaryLanguage(profile),
    packageManager: inferPackageManager(profile),
    testCommand: "",
    lintCommand: "",
    typecheckCommand: "",
    devCommand: "",
    buildCommand: "",
    frameworks: profile.frameworks
      .filter((f) => f.confidence >= CONFIDENCE_THRESHOLD)
      .map((f) => f.name),
    repoStructureSummary: profile.directories.slice(0, 10),
    importAgents,
    installedSkills: profile.agentFiles?.skills || [],
  };

  // Try to extract commands from package.json scripts
  if (profile.packageJson?.scripts) {
    const scripts = profile.packageJson.scripts as Record<string, string>;
    const pm = ctx.packageManager;
    if (scripts.dev) ctx.devCommand = `${pm} run dev`;
    if (scripts.build) ctx.buildCommand = `${pm} run build`;
    if (scripts.test) ctx.testCommand = `${pm} test`;
    if (scripts.lint) ctx.lintCommand = `${pm} run lint`;
    if (scripts.typecheck) ctx.typecheckCommand = `${pm} run typecheck`;
    if (scripts["type-check"]) ctx.typecheckCommand = `${pm} run type-check`;
  }

  // Apply overlay context overrides (later overlays win)
  for (const id of overlays) {
    const overlay = getOverlay(id);
    if (overlay?.contextOverrides) {
      for (const [key, value] of Object.entries(overlay.contextOverrides)) {
        if (value !== undefined && value !== "") {
          (ctx as unknown as Record<string, unknown>)[key] = value;
        }
      }
    }
  }

  return ctx;
}

function inferPrimaryLanguage(profile: RepoProfile): string {
  if (profile.languages.length === 0) return "JavaScript";
  return profile.languages[0].name.charAt(0).toUpperCase() + profile.languages[0].name.slice(1);
}

function inferPackageManager(profile: RepoProfile): string {
  if (profile.packageManagers.length === 0) return "npm";
  return profile.packageManagers[0];
}

function collectRootSections(
  ctx: TemplateContext,
  overlays: string[]
): TemplateSection[] {
  // Start with base sections
  const sections = [...baseRootSections(ctx)];

  // Add overlay sections
  for (const id of overlays) {
    const overlay = getOverlay(id);
    if (overlay?.rootSections) {
      sections.push(...overlay.rootSections);
    }
  }

  return sections;
}

function collectRules(
  profile: RepoProfile,
  overlays: string[]
): RuleTemplate[] {
  const rules: RuleTemplate[] = [];
  const seenTargets = new Set<string>();

  // Add rules from overlays
  for (const id of overlays) {
    const overlay = getOverlay(id);
    if (overlay?.rules) {
      for (const rule of overlay.rules) {
        if (!seenTargets.has(rule.targetPath)) {
          rules.push(rule);
          seenTargets.add(rule.targetPath);
        }
      }
    }
  }

  // Add structure-based default rules if relevant directories exist
  const hasDirs = (dirs: string[]) =>
    dirs.some((d) => profile.directories.includes(d));

  if (
    hasDirs(["src/api", "server", "api"]) &&
    !seenTargets.has(backendRule.targetPath)
  ) {
    rules.push(backendRule);
  }

  if (
    hasDirs(["db", "database", "prisma", "drizzle", "supabase", "migrations"]) &&
    !seenTargets.has(databaseRule.targetPath)
  ) {
    rules.push(databaseRule);
  }

  if (
    hasDirs(["tests", "test", "__tests__"]) &&
    !seenTargets.has(testingRule.targetPath)
  ) {
    rules.push(testingRule);
  }

  // Always include architecture if we have a src/ directory
  if (
    hasDirs(["src"]) &&
    !seenTargets.has(architectureRule.targetPath)
  ) {
    rules.push(architectureRule);
  }

  return rules;
}
