import type { RuleTemplate } from "../../types/index.js";

/** Default backend rule — included when API/server directories are detected. */
export const backendRule: RuleTemplate = {
  id: "rule-backend",
  targetPath: ".claude/rules/backend.md",
  paths: ["src/api/**/*.ts", "server/**/*.ts", "api/**/*.ts"],
  heading: "Backend Rules",
  bullets: [
    "Validate inputs at the boundary — use schemas or validation helpers.",
    "Reuse existing error response helpers and status code conventions.",
    "Avoid introducing new environment variables unless required by the change.",
    "Add focused tests for edge cases and error paths.",
    "Keep route handlers thin — push logic into service/domain modules.",
  ],
};

/** Default database rule — included when db/migration directories are detected. */
export const databaseRule: RuleTemplate = {
  id: "rule-database",
  targetPath: ".claude/rules/database.md",
  paths: ["db/**/*", "prisma/**/*", "drizzle/**/*", "migrations/**/*", "supabase/**/*"],
  heading: "Database Rules",
  bullets: [
    "Do not modify migrations casually — prefer additive changes.",
    "Call out destructive schema edits explicitly.",
    "Run only the necessary migration verification commands.",
    "If migration safety must be enforced, use hooks rather than relying on advisory text in memory files.",
  ],
};

/** Default testing rule — always a good idea. */
export const testingRule: RuleTemplate = {
  id: "rule-testing",
  targetPath: ".claude/rules/testing.md",
  paths: ["tests/**/*", "test/**/*", "__tests__/**/*", "*.test.*", "*.spec.*"],
  heading: "Testing Rules",
  bullets: [
    "Write tests for new functionality — prefer focused unit tests over broad integration tests.",
    "Follow existing test patterns and naming conventions in the repo.",
    "Use descriptive test names that explain the expected behavior.",
    "Mock external dependencies at the boundary, not deeply nested internals.",
  ],
};

/** Default architecture rule — broad guidance for code structure. */
export const architectureRule: RuleTemplate = {
  id: "rule-architecture",
  targetPath: ".claude/rules/architecture.md",
  paths: ["src/**/*"],
  heading: "Architecture Rules",
  bullets: [
    "Follow existing module boundaries — do not introduce new abstraction layers without discussion.",
    "Keep imports clean — avoid circular dependencies.",
    "Prefer composition over inheritance.",
    "Co-locate related code — if a helper is only used by one module, keep it there.",
  ],
};

/** All default rules — used for selection based on detected structure. */
export const allDefaultRules: RuleTemplate[] = [
  backendRule,
  databaseRule,
  testingRule,
  architectureRule,
];
