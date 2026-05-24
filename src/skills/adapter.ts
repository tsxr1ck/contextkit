import { spawn } from "node:child_process";
import { log } from "../io/logger.js";

/**
 * Encapsulates all interactions with the external autoskills CLI.
 */
export class SkillsAdapter {
  private cwd: string;

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  /**
   * Check if Node.js 22+ is available (autoskills requirement).
   */
  public async checkNodeVersion(): Promise<boolean> {
    try {
      const version = await this.exec("node -v");
      const match = version.match(/^v(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10) >= 22;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Installs curated skills using autoskills.
   */
  public async installSkills(dryRun: boolean): Promise<boolean> {
    const hasNode22 = await this.checkNodeVersion();
    if (!hasNode22) {
      log.warn("autoskills requires Node.js v22 or newer. Skipping skills installation.");
      return false;
    }

    log.info("Invoking autoskills installer…");
    const args = ["autoskills", dryRun ? "--dry-run" : "-y"];

    try {
      const output = await this.exec(`npx ${args.join(" ")}`);
      // Since autoskills outputs its own summary, we can either print it or silently parse it.
      // For now, we'll just dim-print the output.
      log.dim(output.trim());
      return true;
    } catch (err: any) {
      log.error(`Failed to install skills: ${err.message}`);
      return false;
    }
  }

  /**
   * Refreshes (updates) installed skills.
   */
  public async refreshSkills(): Promise<boolean> {
    const hasNode22 = await this.checkNodeVersion();
    if (!hasNode22) {
      log.warn("autoskills requires Node.js v22 or newer. Skipping refresh.");
      return false;
    }

    log.info("Updating skills via autoskills…");
    try {
      // Assuming autoskills supports 'update' or we just re-run it
      const output = await this.exec("npx autoskills update -y");
      log.dim(output.trim());
      return true;
    } catch (err: any) {
      log.error(`Failed to refresh skills: ${err.message}`);
      return false;
    }
  }

  /**
   * Checks the health of installed skills.
   */
  public async checkSkills(): Promise<boolean> {
    const hasNode22 = await this.checkNodeVersion();
    if (!hasNode22) {
      log.warn("autoskills requires Node.js v22 or newer. Skipping check.");
      return false;
    }

    try {
      // Assuming autoskills supports 'doctor' or 'check'
      const output = await this.exec("npx autoskills doctor");
      log.dim(output.trim());
      return true;
    } catch (err: any) {
      log.warn(`autoskills check reported issues or failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Helper to execute shell commands.
   */
  private exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, {
        cwd: this.cwd,
        shell: true,
        stdio: "pipe",
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || stdout || `Command failed with code ${code}`));
        }
      });
    });
  }
}
