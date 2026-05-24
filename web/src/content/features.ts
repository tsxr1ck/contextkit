export type Feature = {
  title: string
  description: string
  tag: string
}

export const featuresList: Feature[] = [
  {
    title: 'Smart Stack Detection',
    description: 'Scans your repository for configuration files, lockfiles, and folder structures to auto-detect frameworks and runtimes.',
    tag: 'detect',
  },
  {
    title: 'Durable Context Scaffolding',
    description: 'Generates clean, high-value CLAUDE.md files tailored to guide AI coding assistants with project context.',
    tag: 'scaffold',
  },
  {
    title: 'Private Local Layer',
    description: 'Supports CLAUDE.local.md for machine-local credentials, API keys, or personal notes that stay out of Git.',
    tag: 'privacy',
  },
  {
    title: 'Repository Diagnostics',
    description: 'Run the `doctor` command to audit repository hygiene and instantly identify missing setup requirements.',
    tag: 'doctor',
  },
  {
    title: 'Structural Quality Audits',
    description: 'Run the `audit` command to score repository structures against standard practices and get actionable improvements.',
    tag: 'audit',
  },
  {
    title: 'Non-Interactive Automation',
    description: 'Fully supports non-interactive CLI flags, making it trivial to script scaffolding inside templates or CI pipelines.',
    tag: 'automate',
  },
]
