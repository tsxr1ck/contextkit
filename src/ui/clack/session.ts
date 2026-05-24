import { intro, outro } from "@clack/prompts";
import pc from "picocolors";

const TOOL_NAME = "contextkit";

export function startSession(command: string): void {
  intro(pc.bold(pc.cyan(`${TOOL_NAME} ${command}`)));
}

export function endSession(message: string): void {
  outro(pc.green(message));
}

export function endSessionWarn(message: string): void {
  outro(pc.yellow(message));
}
