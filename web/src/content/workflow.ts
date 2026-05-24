export type WorkflowStep = {
  step: string
  title: string
  description: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    step: '01',
    title: 'Scan the Repository',
    description: 'Run the CLI in the root of your project. It safely scans your files, package managers, and directories without altering code.',
  },
  {
    step: '02',
    title: 'Identify Stack & Patterns',
    description: 'ContextKit identifies patterns like monorepos, Next.js setups, TypeScript compilation targets, and testing libraries.',
  },
  {
    step: '03',
    title: 'Generate Context Files',
    description: 'Creates your team-shared CLAUDE.md structure and developer-local CLAUDE.local.md settings to align AI tools.',
  },
  {
    step: '04',
    title: 'Maintain Project Health',
    description: 'Run `doctor` or `audit` periodically to evaluate configuration health, detect gaps, and keep context fresh.',
  },
]
