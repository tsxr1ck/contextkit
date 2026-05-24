import { SkillsAdapter } from "../../skills/adapter.js";
import { log } from "../../io/logger.js";

/**
 * The `upgrade` command — refresh/update memory and installed skills.
 */
export async function upgradeCommand(options: {
  cwd: string;
  refreshSkills: boolean;
}): Promise<void> {
  log.heading("Upgrading contextkit setup…");
  
  if (options.refreshSkills) {
    const adapter = new SkillsAdapter(options.cwd);
    const success = await adapter.refreshSkills();
    if (success) {
      log.success("Skills refreshed successfully.");
    } else {
      log.warn("Skills refresh failed or was skipped.");
    }
  } else {
    log.info("No upgrade options specified. Try `contextkit upgrade --refresh-skills`.");
  }
}
