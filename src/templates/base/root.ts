import type { TemplateSection, TemplateContext } from "../../types/index.js";

/**
 * Base root CLAUDE.md sections — always included.
 * Sections use {{variable}} placeholders resolved by the renderer.
 */
export function baseRootSections(ctx: TemplateContext): TemplateSection[] {
  const sections: TemplateSection[] = [
    {
      id: "project-overview",
      heading: "Project Overview",
      bullets: [
        `This is **{{projectName}}**, a {{primaryLanguage}} project.`,
        ...(ctx.frameworks.length > 0
          ? [`Built with: ${ctx.frameworks.join(", ")}.`]
          : []),
        `Package manager: {{packageManager}}.`,
      ],
    },
    {
      id: "repo-structure",
      heading: "Repository Structure",
      bullets: ctx.repoStructureSummary.length > 0
        ? ctx.repoStructureSummary.map((dir) => `\`${dir}/\``)
        : ["_Update this section with your key directories._"],
    },
    {
      id: "commands",
      heading: "Commands",
      bullets: buildCommandBullets(ctx),
    },
    {
      id: "workflow",
      heading: "Workflow",
      bullets: [
        "Keep changes scoped to the request.",
        "Prefer updating existing patterns over introducing parallel abstractions.",
        "Run the narrowest useful verification command after edits.",
        "Do not modify generated or vendored files.",
      ],
    },
    {
      id: "verification",
      heading: "Verification",
      bullets: [
        ...(ctx.lintCommand ? [`Lint: \`${ctx.lintCommand}\``] : []),
        ...(ctx.typecheckCommand ? [`Typecheck: \`${ctx.typecheckCommand}\``] : []),
        ...(ctx.testCommand ? [`Test: \`${ctx.testCommand}\``] : []),
        "Run the narrowest verification relevant to each change.",
      ],
    },
    {
      id: "memory-hygiene",
      heading: "Memory Hygiene",
      bullets: [
        "Keep this file short and specific (target <150 lines).",
        "Put folder-specific guidance in `.claude/rules/`.",
        "Use hooks for actions that must happen deterministically every time.",
        "Auto memory (`~/.claude/projects/`) is machine-local and Claude-managed — this file is the portable, team-shareable layer.",
      ],
    },
  ];

  if (ctx.installedSkills && ctx.installedSkills.length > 0) {
    sections.push({
      id: "skills",
      heading: "Installed Skills",
      bullets: [
        "Installed skills are supplementary, not required.",
        "Use repo memory for persistent project context.",
        "Use skills for specialized workflows or framework knowledge.",
        "Keep root memory short; avoid copying skill content into CLAUDE.md.",
        `Detected skills: ${ctx.installedSkills.join(", ")}`,
      ],
    });
  }

  // Add AGENTS.md import if requested
  if (ctx.importAgents) {
    sections.unshift({
      id: "agents-import",
      heading: "Imported Agent Instructions",
      bullets: ["@AGENTS.md"],
    });
  }

  return sections;
}

function buildCommandBullets(ctx: TemplateContext): string[] {
  const bullets: string[] = [];
  const pm = ctx.packageManager;

  if (ctx.devCommand) bullets.push(`Dev: \`${ctx.devCommand}\``);
  if (ctx.buildCommand) bullets.push(`Build: \`${ctx.buildCommand}\``);
  if (ctx.testCommand) bullets.push(`Test: \`${ctx.testCommand}\``);
  if (ctx.lintCommand) bullets.push(`Lint: \`${ctx.lintCommand}\``);
  if (ctx.typecheckCommand) bullets.push(`Typecheck: \`${ctx.typecheckCommand}\``);

  // If nothing detected, show placeholders
  if (bullets.length === 0) {
    bullets.push(
      `Install: \`${pm} install\``,
      `Dev: \`${pm} run dev\``,
      `Test: \`${pm} test\``,
      `Build: \`${pm} run build\``,
    );
  }

  return bullets;
}
