import type { RenderPlan } from "../../types/index.js";

export interface JsonOutput {
  success: boolean;
  command: string;
  data?: unknown;
  error?: string;
}

export function jsonOutput(output: JsonOutput): void {
  console.log(JSON.stringify(output));
}

export function plainInitResult(plan: RenderPlan, dryRun: boolean): JsonOutput {
  return {
    success: true,
    command: "init",
    data: {
      dryRun,
      filesToCreate: plan.filesToCreate.map((f) => ({
        path: f.relativePath,
        lines: f.lineCount,
      })),
      filesToModify: plan.filesToModify.map((f) => ({
        path: f.relativePath,
        lines: f.lineCount,
      })),
      filesToSkip: plan.filesToSkip.map((f) => ({
        path: f.relativePath,
      })),
      warnings: plan.warnings.map((w) => ({
        file: w.file,
        message: w.message,
        severity: w.severity,
      })),
    },
  };
}

export function plainError(command: string, error: string): JsonOutput {
  return {
    success: false,
    command,
    error,
  };
}
