import { ArrowRight } from 'lucide-react'
import { GithubIcon as Github } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { CommandPill } from '@/components/shared/command-pill'
import { TerminalDemo } from './terminal-demo'
import { siteConfig } from '@/content/site'
import { Reveal } from '@/components/shared/reveal'
import { useT } from '@/lib/i18n'

export function HeroSection() {
  const t = useT()

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-border/20 select-none">
      {/* Background radial accent line */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent -z-10" />

      <div className="container-shell grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Content Column */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-2xl mx-auto lg:mx-0">
          <Reveal>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary">
              {t.hero.badge}
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] text-balance">
              {t.hero.heading}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
              {t.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="w-full max-w-md lg:max-w-none">
            <CommandPill />
          </Reveal>

          <Reveal delay={0.2} className="flex flex-wrap justify-center lg:justify-start gap-3 w-full">
            <Button asChild size="lg" className="rounded-full cursor-pointer">
              <a href="#features">
                {t.hero.getStarted} <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full cursor-pointer">
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="w-4 h-4" /> {t.hero.viewOnGithub}
              </a>
            </Button>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="text-[10px] font-mono text-muted-foreground/60">
              {t.hero.compatNote}
            </p>
          </Reveal>
        </div>

        {/* Right Visual Column */}
        <Reveal delay={0.15} className="lg:col-span-6 w-full relative">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-3xl -z-10" />
          <TerminalDemo />
        </Reveal>
      </div>
    </section>
  )
}
