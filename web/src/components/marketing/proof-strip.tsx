import { useT } from '@/lib/i18n'

export function ProofStrip() {
  const t = useT()
  const techs = [
    { name: 'Bun', logo: '⚡' },
    { name: 'Node.js', logo: '🟢' },
    { name: 'Next.js', logo: '▲' },
    { name: 'React', logo: '⚛' },
    { name: 'Vite', logo: '⚡' },
    { name: 'TypeScript', logo: '🔷' },
    { name: 'Turborepo', logo: '🌀' },
    { name: 'Yarn / PNPM', logo: '📦' },
  ]

  return (
    <div className="border-y border-border/15 py-5 bg-card/5 backdrop-blur-sm overflow-hidden select-none">
      <div className="container-shell">
        <p className="text-center text-[10px] sm:text-xs font-mono tracking-widest uppercase text-muted-foreground/75 mb-3.5">
          {t.proof.label}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3.5">
          {techs.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs shrink-0 select-none opacity-80">{tech.logo}</span>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
