import { ArrowUpRight } from 'lucide-react'
import { GithubIcon as Github } from '@/components/shared/icons'
import { SectionShell } from '@/components/layout/section-shell'
import { Reveal } from '@/components/shared/reveal'
import { CommandPill } from '@/components/shared/command-pill'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/content/site'
import { useT } from '@/lib/i18n'

export function FinalCta() {
  const t = useT()

  return (
    <SectionShell id="cta" className="border-b-0 py-20  md:py-28 select-none">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100vw]  -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-[600px] h-[150px] bg-primary/4 rounded-full blur-[70px] -z-10" />

      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <Reveal>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary mb-1">
            {t.cta.badge}
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            {t.cta.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
            {t.cta.subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-2 max-w-full">
          <CommandPill />
        </Reveal>
        <Reveal delay={0.2} className="flex flex-wrap justify-center gap-3 mt-3">
          <Button asChild className="rounded-full cursor-pointer">
            <a href="#features">{t.cta.getStarted}</a>
          </Button>
          <Button variant="outline" asChild className="rounded-full cursor-pointer">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> {t.cta.viewOnGithub} <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </Button>
        </Reveal>
      </div>
    </SectionShell>
  )
}
