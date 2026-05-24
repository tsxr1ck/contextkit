import type { TemplateSection } from "../../types/index.js";

/**
 * CLAUDE.local.md template — personal, gitignored.
 */
export function localSections(): TemplateSection[] {
  return [
    {
      id: "local-notes",
      heading: "Local Notes",
      bullets: [
        "_This file is gitignored. Use it for personal preferences and machine-specific context._",
      ],
    },
    {
      id: "local-urls",
      heading: "Local URLs",
      bullets: [
        "Dev server: `http://localhost:3000`",
        "_Add your local sandbox/staging URLs here._",
      ],
    },
    {
      id: "local-preferences",
      heading: "Preferences",
      bullets: [
        "_Add personal reminders, model preferences, or machine-specific setup notes._",
      ],
    },
  ];
}
