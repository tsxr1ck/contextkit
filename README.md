# ContextKit 🧠

> **Scaffold concise Claude Code memory files for any repository.**

**ContextKit** is a fast, stack-agnostic CLI tool built with Bun. It automatically detects your project's languages, frameworks, and architecture to generate a clean, modular memory structure for Claude Code.

Instead of a single bloated `CLAUDE.md`, ContextKit enforces a modular architecture using `.claude/rules/*.md`, keeping your root memory file concise, readable, and highly targeted.

---

## 🌟 Features

- **👀 Persistent Watcher (v0.2.1)**: Runs as a background daemon with a rich Ink-based Terminal UI, actively monitoring your project to update context on file saves.
- **🪶 Lean Mode (AST Pruning)**: Intelligently strips function bodies while preserving signatures, types, and interfaces, dramatically reducing token counts.
- **🪄 Auto-Detection**: Instantly recognizes your stack (TypeScript, Next.js, React, Python, Go, Node, Bun, etc.), monorepo structures, and AI providers (Claude Code, Cursor, Windsurf, Aider, OpenCode).
- **📂 Modular Scaffolding**: Generates a clean `CLAUDE.md` and isolates domain-specific rules (Frontend, Backend, Database) into `.claude/rules/`.
- **🎨 Polished UX**: Features both a static wizard (`init`) using `@clack/prompts` and a persistent live dashboard (`watch`) built with `ink` and `zustand`.
- **⚕️ Doctor & Auto-Fix**: Analyzes your existing memory setup, scores its health, and can automatically repair bloated files by extracting rules and removing fluff.
- **📊 Quality Audit**: Scored quality report across brevity, specificity, modularity, verification, compatibility, and enforcement fit.
- **🤖 AutoSkills Integration**: Optionally installs curated, stack-specific AI agent skills via `autoskills`.

---

## 🚀 Getting Started

You can run ContextKit directly in any project without installing it, or link it globally:

### Run directly via `bunx`
```bash
bunx contextkit init
```

### Install Globally
```bash
bun install -g contextkit
# or if developing locally:
npm link
```

---

## 🛠️ Commands

### `init`
Scaffolds Claude Code memory files for the current repository based on detected technologies. Runs an interactive guided setup by default.

```bash
contextkit init
```

**Options:**
- `--dry-run`, `-n`: Preview the files that will be created without writing them.
- `--force`, `-f`: Overwrite existing memory files.
- `--yes`, `-y`: Skip all interactive confirmation prompts (non-interactive mode).
- `--json`: Output results as JSON — ideal for scripting and CI environments.
- `--with-local`: Create a `CLAUDE.local.md` file (and automatically append it to your `.gitignore`) for personal notes.
- `--stack <name>`: Force a specific preset overlay (e.g., `next`, `react`, `bun`, `go`).
- `--import-agents`: Import an existing `AGENTS.md` into the generated CLAUDE.md.
- `--with-skills`: Automatically install recommended AI agent skills via `autoskills`.
- `--skills-only`: Only run the skills installer, skipping the memory scaffolding.
- `--mode <mode>`: Template mode — `minimal` (essentials only) or `opinionated` (full conventions, default).
- `--with-hooks`: Include hook scaffolding for mandatory actions (coming soon).

---

### `watch` (New in v0.2.1)
Launches the persistent Ink TUI dashboard. It actively monitors your project directory using `chokidar`, tracks your current Git branch, displays estimated token savings (via Lean Mode), and rebuilds context dynamically when files change.

```bash
contextkit watch
```

---

### `doctor`
Inspects your existing memory setup, checks for Anthropic's recommended limits (like line counts), and reports on health score and issues.

```bash
contextkit doctor
```

**Options:**
- `--fix`: The magic auto-repair flag! Automatically extracts bloated sections into scoped rules, removes generic fluff (e.g., "write clean code"), and patches missing `AGENTS.md` bridges.
- `--check-skills`: Verifies the health and integrity of installed agent skills.
- `--dry-run`, `-n`: Preview fixes without writing.
- `-y`: Skip confirmation when combined with `--fix`.

---

### `audit`
Scores your memory setup across six quality categories and prints a compact report card.

```bash
contextkit audit
```

**Options:**
- `--json`: Output the audit as structured JSON for scripting.

**Categories scored (0-10):**
| Category | What it measures |
|----------|-----------------|
| Brevity | CLAUDE.md line count and actionable content density |
| Specificity | Repo-specific instructions vs generic advice |
| Modularity | Use of `.claude/rules/` for segmented guidance |
| Verification | Commands section coverage (lint, test, typecheck) |
| Compatibility | Workflow compatibility with Claude Code |
| Enforcement | Mandatory actions in hooks vs prose |

---

### `upgrade`
Refreshes your memory structure and updates your installed supplementary skills.

```bash
contextkit upgrade --refresh-skills
```

---

## 🧠 Memory Architecture

ContextKit opinionatedly structures your repo memory based on Anthropic's best practices:

1. **`CLAUDE.md`**: The portable, team-shareable root file. Kept under 150 lines. Contains core project commands, overarching workflow, and repository layout.
2. **`.claude/rules/*.md`**: Scoped domain guidance. Examples include `frontend.md` (targeting `src/components/**/*`) or `database.md`.
3. **`CLAUDE.local.md` (Optional)**: A gitignored file for your personal session notes, API keys, or scratchpad tasks.

---

## 🤖 CI / Automation

Run non-interactively with `--yes` and `--json`:

```bash
# Non-interactive scaffolding
contextkit init --yes --stack bun --with-local

# JSON output for scripts
contextkit init --json
contextkit audit --json
```

---

## 🙏 Credits

A huge thank you to the [autoskills](https://github.com/midudev/autoskills.git) project by midudev!

ContextKit leverages `autoskills` as an optional, complementary post-init feature to acquire curated, stack-aware AI agent skills without polluting your project's core memory.

---

## 📄 License

MIT License. See the [LICENSE](LICENSE) file for details.
