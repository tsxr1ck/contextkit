export type Locale = 'en' | 'es'

export interface Translations {
  site: {
    name: string
    tagline: string
    description: string
    getStarted: string
    viewOnGithub: string
    copyCmd: string
  }
  nav: {
    features: string
    workflow: string
    outputs: string
    faq: string
    github: string
    language: string
    theme: string
  }
  hero: {
    badge: string
    heading: string
    subtitle: string
    compatNote: string
    getStarted: string
    viewOnGithub: string
  }
  proof: {
    label: string
  }
  transformation: {
    badge: string
    title: string
    subtitle: string
    beforeTitle: string
    afterTitle: string
    beforePoints: string[]
    afterPoints: string[]
  }
  features: {
    badge: string
    title: string
    subtitle: string
    items: Array<{ title: string; description: string; tag: string }>
  }
  workflow: {
    badge: string
    title: string
    subtitle: string
    steps: Array<{ step: string; title: string; description: string }>
  }
  outputs: {
    badge: string
    title: string
    subtitle: string
    workspaceTree: string
    gitShared: string
    ignored: string
    versionControlled: string
    ignoredInGitignore: string
    files: Record<string, { title: string; content: string }>
  }
  faq: {
    badge: string
    title: string
    subtitle: string
    items: Array<{ question: string; answer: string }>
  }
  cta: {
    badge: string
    title: string
    subtitle: string
    getStarted: string
    viewOnGithub: string
  }
  footer: {
    copyright: string
  }
  terminal: {
    processCompleted: string
  }
}
