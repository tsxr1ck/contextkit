import { ChevronRight } from 'lucide-react'
import { SectionShell } from '@/components/layout/section-shell'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import { useT } from '@/lib/i18n'

export function WorkflowSection() {
  const t = useT()
  const steps = t.workflow.steps

  return (
    <SectionShell id="workflow">
      <Reveal>
        <SectionHeading
          badge={t.workflow.badge}
          title={t.workflow.title}
          subtitle={t.workflow.subtitle}
        />
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mt-4">
        {steps.map((step, idx) => (
          <Reveal key={step.step} delay={idx * 0.05} className="h-full relative">
            <div className="flex flex-col h-full p-6 rounded-xl border border-border bg-card/25 backdrop-blur-md relative group hover:border-primary/20 transition-all">
              {/* Step indicator */}
              <div className="text-2xl sm:text-3xl font-mono font-bold text-primary/10 group-hover:text-primary/20 transition-colors mb-4 select-none">
                {step.step}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
            
            {/* Horizontal Connector Arrow */}
            {idx < 3 && (
              <div className="hidden lg:flex items-center absolute top-1/2 -right-3.5 -translate-y-1/2 z-20 text-muted-foreground/30 select-none">
                <ChevronRight className="w-5 h-5" />
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
