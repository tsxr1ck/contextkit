import { join } from "node:path";
import type {
  RenderPlan,
  PlannedFile,
  PlanWarning,
  PresetResult,
  RepoProfile,
  TemplateSection,
  RuleTemplate,
  InitOptions,
} from "../../types/index.js";
import { fileExists } from "../../io/fs.js";
import { localSections } from "../../templates/base/local.js";

const LINE_BUDGET_WARN = 180;
const LINE_BUDGET_TARGET = 150;

/**
 * Build the full render plan — determines what files to create/modify and their content.
 */
export function buildRenderPlan(
  profile: RepoProfile,
  presets: PresetResult,
  options: InitOptions
): RenderPlan {
  const plan: RenderPlan = {
    filesToCreate: [],
    filesToModify: [],
    filesToSkip: [],
    warnings: [],
  };

  // ── Master Context ──
  const masterContext = renderRootFile(presets);
  const lineCount = masterContext.split("\n").length;

  // Line budget check
  if (lineCount > LINE_BUDGET_WARN) {
    plan.warnings.push({
      file: "Master Context",
      message: `${lineCount} lines exceeds the recommended ${LINE_BUDGET_TARGET}-line target. Consider moving content to scoped rules.`,
      severity: "warn",
    });
  }

  // ── Route the output based on selected providers ──
  const targets = [
    { provider: "claude", path: "CLAUDE.md" },
    { provider: "cursor", path: ".cursorrules" },
    { provider: "windsurf", path: ".windsurfrules" },
    { provider: "opencode", path: ".swarm/context.md" },
  ] as const;

  for (const { provider, path: relativePath } of targets) {
    if (options.targetProviders.includes(provider)) {
      const absolutePath = join(profile.cwd, relativePath);
      const plannedFile: PlannedFile = {
        relativePath,
        absolutePath,
        content: masterContext,
        source: "base",
        lineCount,
      };

      if (fileExists(absolutePath) && !options.force) {
        plan.filesToSkip.push(plannedFile);
        plan.warnings.push({
          file: relativePath,
          message: "Already exists. Use --force to overwrite.",
          severity: "warn",
        });
      } else {
        plan.filesToCreate.push(plannedFile);
      }
    }
  }

  // ── CLAUDE.local.md ──
  if (options.createLocal) {
    const localContent = renderLocalFile();
    const localPath = join(profile.cwd, "CLAUDE.local.md");
    const localFile: PlannedFile = {
      relativePath: "CLAUDE.local.md",
      absolutePath: localPath,
      content: localContent,
      source: "base",
      lineCount: localContent.split("\n").length,
    };

    if (fileExists(localPath) && !options.force) {
      plan.filesToSkip.push(localFile);
    } else {
      plan.filesToCreate.push(localFile);
    }
  }

  // ── Rule files ──
  for (const rule of presets.rules) {
    const ruleContent = renderRuleFile(rule);
    const rulePath = join(profile.cwd, rule.targetPath);
    const ruleFile: PlannedFile = {
      relativePath: rule.targetPath,
      absolutePath: rulePath,
      content: ruleContent,
      source: "overlay",
      lineCount: ruleContent.split("\n").length,
    };

    if (fileExists(rulePath) && !options.force) {
      plan.filesToSkip.push(ruleFile);
      plan.warnings.push({
        file: rule.targetPath,
        message: "Already exists. Use --force to overwrite.",
        severity: "info",
      });
    } else {
      plan.filesToCreate.push(ruleFile);
    }
  }

  return plan;
}

// ── Renderers ───────────────────────────────────────────────────

function renderRootFile(presets: PresetResult): string {
  const lines: string[] = [];

  lines.push(`<!-- generated-by: contextkit -->`);
  lines.push(`<!-- version: 0.1.0 -->`);
  lines.push("");

  for (const section of presets.rootSections) {
    lines.push(`# ${section.heading}`);
    for (const bullet of section.bullets) {
      lines.push(`- ${resolveVariables(bullet, presets.context as unknown as Record<string, unknown>)}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function renderLocalFile(): string {
  const sections = localSections();
  const lines: string[] = [];

  lines.push(`<!-- generated-by: contextkit -->`);
  lines.push(`<!-- This file is gitignored. Personal notes only. -->`);
  lines.push("");

  for (const section of sections) {
    lines.push(`# ${section.heading}`);
    for (const bullet of section.bullets) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function renderRuleFile(rule: RuleTemplate): string {
  const lines: string[] = [];

  // YAML frontmatter with paths
  lines.push("---");
  lines.push("paths:");
  for (const p of rule.paths) {
    lines.push(`  - "${p}"`);
  }
  lines.push("---");
  lines.push("");

  lines.push(`# ${rule.heading}`);
  for (const bullet of rule.bullets) {
    lines.push(`- ${bullet}`);
  }
  lines.push("");

  return lines.join("\n").trimEnd() + "\n";
}

// ── Variable interpolation ──────────────────────────────────────

function resolveVariables(
  text: string,
  context: Record<string, unknown>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = context[key as keyof typeof context];
    if (value === undefined || value === null) return match;
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  });
}
