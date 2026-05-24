import { ui } from "./colors";
import { symbols } from "./symbols";

export function printHeader(title: string): void {
  const line = "─".repeat(Math.min(title.length + 4, 60));
  console.log();
  console.log(ui.heading(line));
  console.log(ui.heading(`  ${title}`));
  console.log(ui.heading(line));
  console.log();
}

export function printSection(title: string): void {
  console.log();
  console.log(ui.strong(title));
  console.log(ui.dim("─".repeat(title.length)));
}

export function printList(items: string[]): void {
  for (const item of items) {
    console.log(`  ${ui.dim(symbols.bullet)} ${item}`);
  }
}

export function printKeyValue(label: string, value: string): void {
  console.log(`  ${ui.dim(label + ":")} ${value}`);
}

export function printKeyValues(pairs: [string, string][]): void {
  const maxLen = Math.max(...pairs.map(([k]) => k.length));
  for (const [label, value] of pairs) {
    console.log(`  ${ui.dim(label.padEnd(maxLen) + " :")} ${value}`);
  }
}

export interface FilePlanItem {
  path: string;
  action: "create" | "modify" | "skip";
  reason?: string;
}

export function printFilePlan(files: FilePlanItem[]): void {
  for (const file of files) {
    const icon =
      file.action === "create"
        ? ui.ok("+")
        : file.action === "modify"
          ? ui.warn("~")
          : ui.dim("-");
    const label =
      file.action === "create"
        ? "create"
        : file.action === "modify"
          ? "modify"
          : "skip";
    const reason = file.reason ? ui.dim(` (${file.reason})`) : "";
    console.log(`  ${icon} ${ui.dim(label.padEnd(6))} ${ui.path(file.path)}${reason}`);
  }
}

export function printDivider(): void {
  console.log(ui.dim("─".repeat(60)));
}

export function printWarning(message: string): void {
  console.log(`  ${ui.warn(symbols.warn)} ${ui.warn(message)}`);
}

export function printError(message: string): void {
  console.log(`  ${ui.error(symbols.error)} ${ui.error(message)}`);
}

export function printSuccess(message: string): void {
  console.log(`  ${ui.ok(symbols.success)} ${ui.ok(message)}`);
}

export function printInfo(message: string): void {
  console.log(`  ${ui.dim(symbols.info)} ${ui.dim(message)}`);
}

export function newline(): void {
  console.log();
}
