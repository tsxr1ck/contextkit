import type { Translations } from '../types'

const en: Translations = {
  site: {
    name: 'ContextKit',
    tagline: 'ContextKit — Project context scaffolding for AI coding workflows',
    description: 'Scan your repo, generate durable context files, and keep AI coding workflows aligned with how your project actually works.',
    getStarted: 'Get Started',
    viewOnGithub: 'View on GitHub',
    copyCmd: 'Copy installation command',
  },
  nav: {
    features: 'Features',
    workflow: 'Workflow',
    outputs: 'Outputs',
    faq: 'FAQ',
    github: 'GitHub',
    language: 'Language',
    theme: 'Theme',
  },
  hero: {
    badge: 'AI Workflow Tooling',
    heading: 'Give your repo the context your AI tools keep missing.',
    subtitle:
      'ContextKit scans your codebase, detects targets and rules, scaffolds durable memory files, and maintains quality with custom diagnostic runs.',
    compatNote: 'Works with Bun, Node, React, Next.js, Vite, Monorepos & more.',
    getStarted: 'Get Started',
    viewOnGithub: 'View on GitHub',
  },
  proof: {
    label: 'Scaffolding Mapped to Your Tech Stack',
  },
  transformation: {
    badge: 'Transformation',
    title: 'Align Your Codebase with Your AI',
    subtitle:
      'AI coding assistants are incredibly powerful, but only if they understand how your project is built. Here is how ContextKit bridges the gap.',
    beforeTitle: 'Fragmented Workspace Context',
    afterTitle: 'Managed ContextKit Memory',
    beforePoints: [
      'AI guesses project rules and invents custom conventions',
      'Frequent build failures due to AI executing invalid commands',
      'Local secrets or machine paths accidentally leaked to AI prompts',
      'Fragmented context leads to repetitive prompt instructions',
    ],
    afterPoints: [
      'Durable, git-shared rules align every AI session instantly',
      'Explicit command scripts mapped dynamically for AI tools',
      'Local credentials safely isolated inside CLAUDE.local.md',
      'Centralized codebase memory reduces context overhead',
    ],
  },
  features: {
    badge: 'Features',
    title: 'Fully Equipped for AI Workflows',
    subtitle:
      'Everything you need to scan project structures, scaffold repeatable rules, and run health diagnostics on your workspace memory.',
    items: [
      {
        title: 'Smart Stack Detection',
        description:
          'Scans your repository for configuration files, lockfiles, and folder structures to auto-detect frameworks and runtimes.',
        tag: 'detect',
      },
      {
        title: 'Durable Context Scaffolding',
        description:
          'Generates clean, high-value CLAUDE.md files tailored to guide AI coding assistants with project context.',
        tag: 'scaffold',
      },
      {
        title: 'Private Local Layer',
        description:
          'Supports CLAUDE.local.md for machine-local credentials, API keys, or personal notes that stay out of Git.',
        tag: 'privacy',
      },
      {
        title: 'Repository Diagnostics',
        description:
          'Run the `doctor` command to audit repository hygiene and instantly identify missing setup requirements.',
        tag: 'doctor',
      },
      {
        title: 'Structural Quality Audits',
        description:
          'Run the `audit` command to score repository structures against standard practices and get actionable improvements.',
        tag: 'audit',
      },
      {
        title: 'Non-Interactive Automation',
        description:
          'Fully supports non-interactive CLI flags, making it trivial to script scaffolding inside templates or CI pipelines.',
        tag: 'automate',
      },
    ],
  },
  workflow: {
    badge: 'Workflow',
    title: 'Procedural Repository Alignment',
    subtitle:
      'Aligning project memory in seconds. Here is the step-by-step lifecycle of ContextKit.',
    steps: [
      {
        step: '01',
        title: 'Scan the Repository',
        description:
          'Run the CLI in the root of your project. It safely scans your files, package managers, and directories without altering code.',
      },
      {
        step: '02',
        title: 'Identify Stack & Patterns',
        description:
          'ContextKit identifies patterns like monorepos, Next.js setups, TypeScript compilation targets, and testing libraries.',
      },
      {
        step: '03',
        title: 'Generate Context Files',
        description:
          'Creates your team-shared CLAUDE.md structure and developer-local CLAUDE.local.md settings to align AI tools.',
      },
      {
        step: '04',
        title: 'Maintain Project Health',
        description:
          'Run `doctor` or `audit` periodically to evaluate configuration health, detect gaps, and keep context fresh.',
      },
    ],
  },
  outputs: {
    badge: 'Scaffolding Outputs',
    title: 'Living Project Memory Structure',
    subtitle:
      'Explore the exact files ContextKit generates to feed context, architectural limits, and local secrets safely to AI coding agents.',
    workspaceTree: 'WORKSPACE TREE',
    gitShared: 'git shared',
    ignored: 'ignored',
    versionControlled: 'Version Controlled',
    ignoredInGitignore: 'Ignored in .gitignore',
    files: {
      claude: {
        title: 'CLAUDE.md',
        content: `# ContextKit Project Overview
- Runtimes supported: Bun, Node.js
- Package manager: bun

# Repository Structure
- \`src/\` - Core CLI source code
- \`tests/\` - Unit tests & setup fixtures

# Core Commands
- Dev execution: \`bun run dev\`
- Build output: \`bun run build\`
- Test suite: \`bun test\`

# Development Rules
- Prefer strict typing across boundary imports.
- Keep components isolated, pure, and descriptive.`,
      },
      local: {
        title: 'CLAUDE.local.md',
        content: `# Local Environment Override Notes
- Developer: rick (Rick)

# Private Workspace Settings
- Custom build port: \`4000\`
- Local database credentials (mock):
  - DB_HOST=localhost
  - DB_PORT=5432

# Machine Scratchpad
- Investigating hot reload issue in web subproject.
- Note: CLAUDE.local.md is gitignored to avoid pushing keys.`,
      },
      readme: {
        title: 'README.md',
        content: `# ContextKit
Bootstrap and maintain codebase memory configurations for AI-assisted workflows.

## Quick Start
\`\`\`bash
bunx contextkit
\`\`\`

## Commands
- \`doctor\` - Runs repository diagnosis.
- \`audit\` - Scores repository quality.`,
      },
    },
  },
  faq: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle:
      'Everything you need to know about ContextKit, project memory files, and AI coordination.',
    items: [
      {
        question: 'Does it work on existing codebases?',
        answer:
          'Absolutely. ContextKit is designed to run on any repository. It scans your existing files to figure out your patterns, then scaffolds appropriate guidelines without disrupting your existing code or git history.',
      },
      {
        question: 'Do I need to install Bun to run ContextKit?',
        answer:
          'No. While the CLI is built with Bun, you can execute it easily on any machine using `npx contextkit` under Node, or `bunx contextkit` under Bun. It works across environments.',
      },
      {
        question: 'What files are created in my project?',
        answer:
          'It creates a shared project memory file `CLAUDE.md` (for repository architecture, rules, and commands, which you check into git) and an optional `CLAUDE.local.md` (for your personal local machine notes, ignored by git). It also sets up standard rule directories if needed.',
      },
      {
        question: 'Can I run ContextKit headlessly in pipelines?',
        answer:
          'Yes. By running the CLI with `--yes` or non-interactive parameters, you can bypass all terminal prompt inputs. This is ideal for repository templates, CI/CD checks, or automated dev environment configurations.',
      },
      {
        question: 'Does it support complex monorepos?',
        answer:
          'Yes. ContextKit detects monorepo layouts (such as Bun workspaces, Yarn/PNPM workspaces, Turborepo) and scaffolds rules that help AI assistants understand package isolation and monorepo boundaries.',
      },
    ],
  },
  cta: {
    badge: 'Zero Overhead',
    title: 'Scaffold Your AI Context Today',
    subtitle:
      'Stop pasting the same boilerplate rules into every new session. Align your repository\'s memory files in a single, lightweight command.',
    getStarted: 'Get Started',
    viewOnGithub: 'View on GitHub',
  },
  footer: {
    copyright: '  {year} ContextKit. Released under the MIT License.',
  },
  terminal: {
    processCompleted: 'Process completed.',
  },
}

export default en
