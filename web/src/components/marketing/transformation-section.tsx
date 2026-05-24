import { XCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import { SectionShell } from '@/components/layout/section-shell'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import { useT } from '@/lib/i18n'

export function TransformationSection() {
  const t = useT()

  return (
    <SectionShell id="transformation">
      <Reveal>
        <SectionHeading
          badge={t.transformation.badge}
          title={t.transformation.title}
          subtitle={t.transformation.subtitle}
        />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mt-4">
        {/* Before Card */}
        <Reveal delay={0.1} className="h-full">
          <div className="flex flex-col h-full rounded-2xl border border-destructive/10 bg-destructive/5 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl" />
            <h3 className="text-lg font-semibold text-destructive/80 flex items-center gap-2 mb-6 select-none">
              <XCircle className="w-5 h-5 shrink-0" /> {t.transformation.beforeTitle}
            </h3>
            <ul className="flex flex-col gap-4 mt-2">
              {t.transformation.beforePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-destructive/60 mt-0.5 font-bold shrink-0 select-none">&#8226;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* After Card */}
        <Reveal delay={0.2} className="h-full">
          <div className="flex flex-col h-full rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2 mb-6 select-none">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> {t.transformation.afterTitle}
            </h3>
            <ul className="flex flex-col gap-4 mt-2">
              {t.transformation.afterPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                  <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 select-none" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
