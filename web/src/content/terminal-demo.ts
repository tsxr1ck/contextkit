export type TerminalStep = {
  type: 'command' | 'output' | 'success' | 'muted' | 'error' | 'warning'
  text: string
  delay?: number // ms to wait after rendering this line
}

export type DemoTab = 'init' | 'watch' | 'doctor' | 'audit'

export const terminalScripts: Record<DemoTab, { command: string; steps: TerminalStep[] }> = {
  init: {
    command: 'bunx contextkit',
    steps: [
      { type: 'command', text: 'bunx contextkit', delay: 400 },
      { type: 'output', text: '┌  contextkit init', delay: 200 },
      { type: 'output', text: '│', delay: 0 },
      { type: 'success', text: '◇  Repository analyzed', delay: 400 },
      { type: 'output', text: '│', delay: 0 },
      { type: 'success', text: '◇  Detection results', delay: 200 },
      { type: 'output', text: '  Language    : typescript, bun, node, javascript', delay: 100 },
      { type: 'output', text: '  Package mgr : bun, pnpm', delay: 100 },
      { type: 'output', text: '  Framework   : react, vite, tailwind', delay: 100 },
      { type: 'output', text: '  Git         : yes', delay: 300 },
      { type: 'output', text: '│', delay: 0 },
      { type: 'success', text: '◇  Install recommended AI agent skills?', delay: 500 },
      { type: 'muted', text: '│  Yes', delay: 200 },
      { type: 'output', text: '│', delay: 0 },
      { type: 'success', text: '◇  Skills installed', delay: 600 },
      { type: 'output', text: '│', delay: 0 },
      { type: 'success', text: '◇  File plan', delay: 400 },
      { type: 'output', text: '  ✔ create  CLAUDE.md', delay: 100 },
      { type: 'output', text: '  ✔ create  CLAUDE.local.md', delay: 100 },
      { type: 'output', text: '  ✔ create  .claude/rules/frontend.md', delay: 100 },
      { type: 'output', text: '  ✔ create  .claude/rules/backend.md', delay: 100 },
      { type: 'output', text: '│', delay: 0 },
      { type: 'success', text: '└  Memory scaffolding complete', delay: 500 },
      { type: 'output', text: '\n  5 created\n\n  Next steps:\n  • Review generated files\n  • Run contextkit doctor to check your setup.', delay: 200 }
    ],
  },
  doctor: {
    command: 'bunx contextkit doctor',
    steps: [
      { type: 'command', text: 'bunx contextkit doctor', delay: 400 },
      { type: 'muted', text: '🩺 Running repository diagnostics...', delay: 600 },
      { type: 'output', text: '   ├─ Checking bun.lock... OK', delay: 150 },
      { type: 'warning', text: '   ├─ Checking tsconfig.json strict flags... WARNING', delay: 200 },
      { type: 'muted', text: '   │  └─ "strict" compilation mode is disabled or missing', delay: 150 },
      { type: 'output', text: '   ├─ Checking CLAUDE.md commands... OK', delay: 150 },
      { type: 'output', text: '   └─ Checking local overrides config... OK', delay: 350 },
      { type: 'muted', text: '💡 Recommendation:', delay: 300 },
      { type: 'output', text: '   👉 Enable "strict": true inside your compilerOptions', delay: 200 },
      { type: 'output', text: '   👉 Run "bun run typecheck" to verify strict compiler passes', delay: 200 },
      { type: 'warning', text: '🩺 Doctor audit completed with 1 warning.', delay: 200 },
    ],
  },
  audit: {
    command: 'bunx contextkit audit',
    steps: [
      { type: 'command', text: 'bunx contextkit audit', delay: 400 },
      { type: 'muted', text: '📊 Auditing repository structure quality...', delay: 600 },
      { type: 'output', text: '   ├─ Readme completeness: 85/100', delay: 150 },
      { type: 'output', text: '   ├─ AI Scaffolding coverage: 90/100', delay: 150 },
      { type: 'output', text: '   ├─ Type coverage level: 95/100', delay: 150 },
      { type: 'output', text: '   └─ Rule isolation boundaries: 100/100', delay: 350 },
      { type: 'success', text: '✨ Overall Repository Quality Score: A- (92.5%)', delay: 300 },
      { type: 'success', text: '   ✔ High compliance with AI coding tool conventions.', delay: 200 },
    ],
  },
}
