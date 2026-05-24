import { Terminal } from 'lucide-react'
import { siteConfig } from '@/content/site'
import { useT } from '@/lib/i18n'

export function SiteFooter() {
  const t = useT()

  return (
    <footer className="border-t border-border/10 py-12 bg-card/10 select-none">
      <div className="container-shell flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/10 border border-primary/25 text-primary">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">{siteConfig.name}</span>
        </div>
        <p className="text-xs text-muted-foreground text-center md:text-right">
          &copy;{t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
      </div>
    </footer>
  )
}
