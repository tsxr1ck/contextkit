import { ui } from "../ui/format/colors.js";

const SYMBOLS = {
  success: "✔",
  error: "✖",
  warning: "⚠",
  info: "ℹ",
  arrow: "→",
  bullet: "•",
  create: "+",
  modify: "~",
  skip: "-",
} as const;

let dryRunMode = false;

export function setDryRun(enabled: boolean) {
  dryRunMode = enabled;
}

function prefix(): string {
  return dryRunMode ? `${ui.mute("[dry-run]")} ` : "";
}

export function info(msg: string) {
  console.log(`${prefix()}${ui.path(SYMBOLS.info)} ${msg}`);
}

export function success(msg: string) {
  console.log(`${prefix()}${ui.ok(SYMBOLS.success)} ${msg}`);
}

export function warn(msg: string) {
  console.log(`${prefix()}${ui.warn(SYMBOLS.warning)} ${msg}`);
}

export function error(msg: string) {
  console.error(`${prefix()}${ui.error(SYMBOLS.error)} ${msg}`);
}

export function dim(msg: string) {
  console.log(`${prefix()}${ui.dim(msg)}`);
}

export function heading(msg: string) {
  console.log(`\n${ui.code(msg)}`);
}

export function fileCreate(relativePath: string) {
  console.log(`  ${ui.ok(SYMBOLS.create)} ${relativePath}`);
}

export function fileModify(relativePath: string) {
  console.log(`  ${ui.warn(SYMBOLS.modify)} ${relativePath}`);
}

export function fileSkip(relativePath: string, reason: string) {
  console.log(`  ${ui.dim(SYMBOLS.skip)} ${relativePath} (${reason})`);
}

export function bullet(msg: string) {
  console.log(`  ${SYMBOLS.bullet} ${msg}`);
}

export function newline() {
  console.log();
}

export function detected(label: string, value: string | string[]) {
  const val = Array.isArray(value) ? value.join(", ") : value;
  console.log(`  ${ui.dim(`${label}:`)} ${ui.code(val)}`);
}

export function divider() {
  console.log(ui.dim("─".repeat(50)));
}

export function banner() {
  console.log(
    `\n${ui.brand("contextkit")} ${ui.dim("v0.1.0")} ${ui.dim("— Claude Code memory scaffolder")}\n`
  );
}

export const log = {
  info,
  success,
  warn,
  error,
  dim,
  heading,
  fileCreate,
  fileModify,
  fileSkip,
  bullet,
  newline,
  detected,
  divider,
  banner,
  setDryRun,
};
