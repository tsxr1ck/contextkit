import { SectionShell } from '@/components/layout/section-shell'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useT } from '@/lib/i18n'

export function FaqSection() {
  const t = useT()
  const faqList = t.faq.items

  return (
    <SectionShell id="faq">
      <Reveal>
        <SectionHeading
          badge={t.faq.badge}
          title={t.faq.title}
          subtitle={t.faq.subtitle}
        />
      </Reveal>

      <Reveal delay={0.1} className="max-w-3xl mx-auto mt-4">
        <Accordion type="single" collapsible className="w-full">
          {faqList.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-border/15 py-1">
              <AccordionTrigger className="text-left hover:no-underline text-foreground/95 font-medium py-4 text-sm sm:text-base cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </SectionShell>
  )
}
