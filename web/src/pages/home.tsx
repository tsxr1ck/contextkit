import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { HeroSection } from '@/components/marketing/hero-section'
import { ProofStrip } from '@/components/marketing/proof-strip'
import { TransformationSection } from '@/components/marketing/transformation-section'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { WorkflowSection } from '@/components/marketing/workflow-section'
import { OutputShowcase } from '@/components/marketing/output-showcase'
import { FaqSection } from '@/components/marketing/faq-section'
import { FinalCta } from '@/components/marketing/final-cta'
import { GridBackdrop } from '@/components/shared/grid-backdrop'

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <GridBackdrop />
      <SiteHeader />
      <main>
        <HeroSection />
        <ProofStrip />
        <TransformationSection />
        <FeatureGrid />
        <WorkflowSection />
        <OutputShowcase />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
