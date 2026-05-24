import { Search, Layers, Lock, Activity, ClipboardCheck, Cpu } from 'lucide-react'
import { SectionShell } from '@/components/layout/section-shell'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import { useT } from '@/lib/i18n'

export function FeatureGrid() {
  const t = useT()
  const featuresList = t.features.items

  const getIcon = (tag: string) => {
    switch (tag) {
      case 'detect':
        return <Search className="w-5 h-5 text-primary" />
      case 'scaffold':
        return <Layers className="w-5 h-5 text-primary" />
      case 'privacy':
        return <Lock className="w-5 h-5 text-primary" />
      case 'doctor':
        return <Activity className="w-5 h-5 text-primary" />
      case 'audit':
        return <ClipboardCheck className="w-5 h-5 text-primary" />
      case 'automate':
        return <Cpu className="w-5 h-5 text-primary" />
      default:
        return <Layers className="w-5 h-5 text-primary" />
    }
  }

  const getMonoLabel = (tag: string) => {
    switch (tag) {
      case 'detect':
        return 'AUTO-DETECT'
      case 'scaffold':
        return 'CLAUDE.md'
      case 'privacy':
        return 'CLAUDE.local.md'
      case 'doctor':
        return 'contextkit doctor'
      case 'audit':
        return 'contextkit audit'
      case 'automate':
        return '--no-interactive'
      default:
        return ''
    }
  }

  return (
    <SectionShell id="features">
      <Reveal>
        <SectionHeading
          badge={t.features.badge}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {featuresList.map((feat, idx) => (
          <Reveal key={feat.tag} delay={idx * 0.05} className="h-full">
            <div className="flex flex-col justify-between h-full p-6 rounded-xl border border-border bg-card/25 backdrop-blur-md hover:border-primary/30 transition-all group">
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 border border-primary/15 group-hover:bg-primary/10 group-hover:border-primary/25 transition-all mb-4 select-none">
                  {getIcon(feat.tag)}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  {feat.description}
                </p>
              </div>
              <div className="text-[10px] font-mono tracking-wider text-muted-foreground/50 select-none uppercase border-t border-border/10 pt-3">
                {getMonoLabel(feat.tag)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
