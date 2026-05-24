// ── Repo Profile ──────────────────────────────────────────────

export interface RepoProfile {
  cwd: string;
  isGitRepo: boolean;
  isMonorepo: boolean;
  languages: StackSignal[];
  packageManagers: string[];
  frameworks: StackSignal[];
  directories: string[];
  files: string[];
  agentFiles: DetectedAgentFiles;
  confidence: DetectionConfidence;
  projectName: string;
  /** Raw package.json contents, if found */
  packageJson: Record<string, unknown> | null;
}

export interface StackSignal {
  name: string;
  confidence: number;
  evidence: string[];
}

export interface DetectedAgentFiles {
  claudeMd: boolean;
  claudeLocalMd: boolean;
  claudeRules: string[]; // list of .claude/rules/*.md found
  agentsMd: boolean;
  cursorRules: boolean;
  windsurfRules: boolean;
  skills: string[]; // List of installed skill names
}

export interface DetectionConfidence {
  [stack: string]: number;
}

// ── Init Options ──────────────────────────────────────────────

export type InitMode = "minimal" | "opinionated";

export interface InitOptions {
  mode: InitMode;
  createLocal: boolean;
  importAgents: boolean;
  includeHooks: boolean;
  withSkills: boolean;
  skillsOnly: boolean;
  selectedOverlays: string[];
  dryRun: boolean;
  force: boolean;
  yes: boolean;
  cwd: string;
  stackOverride: string | null;
}

// ── Render Plan ───────────────────────────────────────────────

export interface RenderPlan {
  filesToCreate: PlannedFile[];
  filesToModify: PlannedFile[];
  filesToSkip: PlannedFile[];
  warnings: PlanWarning[];
}

export interface PlannedFile {
  /** Relative path from repo root */
  relativePath: string;
  /** Absolute path */
  absolutePath: string;
  content: string;
  source: FileSource;
  lineCount: number;
}

export type FileSource = "base" | "overlay" | "merge" | "user";

export interface PlanWarning {
  file: string;
  message: string;
  severity: "info" | "warn" | "error";
}

// ── Template Types ────────────────────────────────────────────

export interface TemplateSection {
  id: string;
  heading: string;
  bullets: string[];
  /** If set, only included when these overlays are active */
  requiredOverlays?: string[];
}

export interface TemplateContext {
  projectName: string;
  primaryLanguage: string;
  packageManager: string;
  testCommand: string;
  lintCommand: string;
  typecheckCommand: string;
  devCommand: string;
  buildCommand: string;
  frameworks: string[];
  repoStructureSummary: string[];
  importAgents: boolean;
  installedSkills: string[];
}

export interface RuleTemplate {
  id: string;
  targetPath: string;
  paths: string[];
  heading: string;
  bullets: string[];
  /** Only generated when these overlays are active */
  requiredOverlays?: string[];
}

// ── Overlay ───────────────────────────────────────────────────

export interface Overlay {
  id: string;
  /** Additional sections to add to root CLAUDE.md */
  rootSections: TemplateSection[];
  /** Additional rule files to create */
  rules: RuleTemplate[];
  /** Overrides for template context values */
  contextOverrides: Partial<TemplateContext>;
}

// ── Preset Result ─────────────────────────────────────────────

export interface PresetResult {
  activeOverlays: string[];
  context: TemplateContext;
  rootSections: TemplateSection[];
  rules: RuleTemplate[];
}

// ── Doctor ────────────────────────────────────────────────────

export type FindingSeverity = "high" | "medium" | "low";

export interface DoctorFinding {
  severity: FindingSeverity;
  message: string;
  file?: string;
  suggestion?: string;
}

export interface DoctorReport {
  findings: DoctorFinding[];
  score: number;
  summary: string;
}
