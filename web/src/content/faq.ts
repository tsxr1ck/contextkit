export type FaqItem = {
  question: string
  answer: string
}

export const faqList: FaqItem[] = [
  {
    question: 'Does it work on existing codebases?',
    answer: 'Absolutely. ContextKit is designed to run on any repository. It scans your existing files to figure out your patterns, then scaffolds appropriate guidelines without disrupting your existing code or git history.',
  },
  {
    question: 'Do I need to install Bun to run ContextKit?',
    answer: 'No. While the CLI is built with Bun, you can execute it easily on any machine using `npx contextkit` under Node, or `bunx contextkit` under Bun. It works across environments.',
  },
  {
    question: 'What files are created in my project?',
    answer: 'It creates a shared project memory file `CLAUDE.md` (for repository architecture, rules, and commands, which you check into git) and an optional `CLAUDE.local.md` (for your personal local machine notes, ignored by git). It also sets up standard rule directories if needed.',
  },
  {
    question: 'Can I run ContextKit headlessly in pipelines?',
    answer: 'Yes. By running the CLI with `--yes` or non-interactive parameters, you can bypass all terminal prompt inputs. This is ideal for repository templates, CI/CD checks, or automated dev environment configurations.',
  },
  {
    question: 'Does it support complex monorepos?',
    answer: 'Yes. ContextKit detects monorepo layouts (such as Bun workspaces, Yarn/PNPM workspaces, Turborepo) and scaffolds rules that help AI assistants understand package isolation and monorepo boundaries.',
  },
]
