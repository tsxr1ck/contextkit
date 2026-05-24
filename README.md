# ContextKit 🧠

> **Scaffold concise, zero-dependency Claude Code memory files for any repository.**

**ContextKit** is a fast, stack-agnostic CLI tool built with Bun. It automatically detects your project's languages, frameworks, and architecture to generate a clean, modular memory structure for Claude Code.

Instead of a single bloated `CLAUDE.md`, ContextKit enforces a modular architecture using `.claude/rules/*.md`, keeping your root memory file concise, readable, and highly targeted.

---

## 🌟 Features

- **🪄 Auto-Detection**: Instantly recognizes your stack (TypeScript, Next.js, React, Python, Go, Node, Bun, etc.) and monorepo structures.
- **📂 Modular Scaffolding**: Generates a clean `CLAUDE.md` and isolates domain-specific rules (Frontend, Backend, Database) into `.claude/rules/`.
- **⚕️ Doctor & Auto-Fix**: Analyzes your existing memory setup, scores its health, and can automatically repair bloated files by extracting rules and removing fluff.
- **🤖 AutoSkills Integration**: Optionally installs curated, stack-specific AI agent skills via `autoskills`.
- **🪶 Zero Dependencies**: Built entirely with native Bun APIs.

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
Scaffolds Claude Code memory files for the current repository based on detected technologies.

```bash
contextkit init
```

**Options:**
- `--dry-run`, `-n`: Preview the files that will be created without writing them.
- `--force`, `-f`: Overwrite existing memory files.
- `--yes`, `-y`: Skip all interactive confirmation prompts.
- `--with-local`: Create a `CLAUDE.local.md` file (and automatically append it to your `.gitignore`) for personal notes.
- `--stack <name>`: Force a specific preset overlay (e.g., `next`, `react`, `bun`, `go`).
- `--with-skills`: Automatically install recommended AI agent skills via `autoskills`.
- `--skills-only`: Only run the skills installer, skipping the memory scaffolding.

---

### `doctor`
Inspects your existing memory setup, checks for Anthropic's recommended limits (like line counts), and reports on health score and issues.

```bash
contextkit doctor
```

**Options:**
- `--fix`: The magic auto-repair flag! Automatically extracts bloated sections into scoped rules, removes generic fluff (e.g., "write clean code"), and patches missing `AGENTS.md` bridges.
- `--check-skills`: Verifies the health and integrity of installed agent skills.

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

## 🙏 Credits

A huge thank you to the [autoskills](https://github.com/midudev/autoskills.git) project by midudev! 

ContextKit leverages `autoskills` as an optional, complementary post-init feature to acquire curated, stack-aware AI agent skills without polluting your project's core memory.

---

## 📄 License

MIT License. See the [LICENSE](LICENSE) file for details.
