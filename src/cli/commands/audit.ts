import { runAudit } from "../../core/doctor/index.js";
import { ui } from "../../ui/format/colors.js";
import { symbols } from "../../ui/format/symbols.js";

function scoreBar(score: number): string {
  const filled = "█".repeat(score);
  const empty = "░".repeat(10 - score);
  const color = score >= 7 ? ui.ok : score >= 4 ? ui.warn : ui.error;
  return color(filled + empty);
}

function scoreLabel(score: number): string {
  if (score >= 9) return ui.ok("excellent");
  if (score >= 7) return ui.ok("good");
  if (score >= 4) return ui.warn("fair");
  return ui.error("needs work");
}

export async function auditCommand(options: {
  cwd: string;
  json: boolean;
}): Promise<void> {
  const categories = runAudit(options.cwd);

  if (options.json) {
    console.log(
      JSON.stringify({
        success: true,
        command: "audit",
        data: { categories },
      })
    );
    return;
  }

  console.log();
  console.log(`  ${ui.brand("contextkit audit")} ${ui.dim("— memory quality report")}`);
  console.log();

  for (const cat of categories) {
    const bar = scoreBar(cat.score);
    const label = scoreLabel(cat.score);
    console.log(`  ${ui.strong(cat.label.padEnd(14))} ${bar} ${ui.dim(`(${cat.score}/10)`)} ${label}`);
    console.log(`  ${" ".repeat(14)} ${ui.dim(cat.explanation)}`);
    console.log();
  }

  const overall = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );
  const overallColor =
    overall >= 7 ? ui.ok : overall >= 4 ? ui.warn : ui.error;
  console.log(`  ${ui.strong("Overall")}: ${overallColor(`${overall}/10`)}`);
  console.log(`  ${ui.dim("─".repeat(40))}`);
  console.log();

  if (overall < 5) {
    console.log(`  ${ui.warn(symbols.warn)} Significant room for improvement.`);
    console.log(`  ${ui.dim("  Run")} ${ui.code("contextkit doctor")} ${ui.dim("for detailed diagnostics.")}`);
    console.log(`  ${ui.dim("  Run")} ${ui.code("contextkit doctor --fix")} ${ui.dim("to auto-repair common issues.")}`);
    console.log();
  }
}
