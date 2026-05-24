import { isCancel, cancel } from "@clack/prompts";
import pc from "picocolors";

export function onCancel(): void {
  cancel(pc.yellow("Operation canceled. No files were changed."));
  process.exit(1);
}

export function checkCancel(value: unknown): asserts value is Exclude<typeof value, symbol> {
  if (isCancel(value)) {
    onCancel();
  }
}
