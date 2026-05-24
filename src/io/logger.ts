// Colored terminal output using ANSI codes. Zero dependencies.

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";

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
  return dryRunMode ? `${DIM}[dry-run]${RESET} ` : "";
}

export function info(msg: string) {
  console.log(`${prefix()}${BLUE}${SYMBOLS.info}${RESET} ${msg}`);
}

export function success(msg: string) {
  console.log(`${prefix()}${GREEN}${SYMBOLS.success}${RESET} ${msg}`);
}

export function warn(msg: string) {
  console.log(`${prefix()}${YELLOW}${SYMBOLS.warning}${RESET} ${msg}`);
}

export function error(msg: string) {
  console.error(`${prefix()}${RED}${SYMBOLS.error}${RESET} ${msg}`);
}

export function dim(msg: string) {
  console.log(`${prefix()}${DIM}${msg}${RESET}`);
}

export function heading(msg: string) {
  console.log(`\n${BOLD}${CYAN}${msg}${RESET}`);
}

export function fileCreate(relativePath: string) {
  console.log(`  ${GREEN}${SYMBOLS.create} ${relativePath}${RESET}`);
}

export function fileModify(relativePath: string) {
  console.log(`  ${YELLOW}${SYMBOLS.modify} ${relativePath}${RESET}`);
}

export function fileSkip(relativePath: string, reason: string) {
  console.log(`  ${DIM}${SYMBOLS.skip} ${relativePath} (${reason})${RESET}`);
}

export function bullet(msg: string) {
  console.log(`  ${SYMBOLS.bullet} ${msg}`);
}

export function newline() {
  console.log();
}

/** Print a key-value detection result */
export function detected(label: string, value: string | string[]) {
  const val = Array.isArray(value) ? value.join(", ") : value;
  console.log(`  ${DIM}${label}:${RESET} ${MAGENTA}${val}${RESET}`);
}

/** Print a section divider */
export function divider() {
  console.log(`${DIM}${"─".repeat(50)}${RESET}`);
}

export function banner() {
  console.log(
    `\n${BOLD}${CYAN}contextkit${RESET} ${DIM}v0.1.0${RESET} ${DIM}— Claude Code memory scaffolder${RESET}\n`
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
