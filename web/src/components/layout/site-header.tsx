import { useState, useEffect, useContext } from 'react'
import { Menu, Terminal, Sun, Moon } from 'lucide-react'
import { GithubIcon as Github } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { siteConfig } from '@/content/site'
import { useT, I18nContext } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const t = useT()
  const { locale, setLocale } = useContext(I18nContext)!
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.workflow, href: '#workflow' },
    { label: t.nav.outputs, href: '#outputs' },
    { label: t.nav.faq, href: '#faq' },
  ]

  const cycleLocale = () => {
    const next: Locale = locale === 'en' ? 'es' : 'en'
    setLocale(next)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 border-b border-border/30 backdrop-blur-md py-3'
          : 'bg-transparent py-5.5'
      }`}
    >
      <div className="container-shell flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-semibold text-lg select-none">
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Terminal className="w-4.5 h-4.5" />
          </div>
          <span className="tracking-tight text-foreground font-bold">{siteConfig.name}</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="cursor-pointer"
            aria-label={t.nav.theme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={cycleLocale}
            className="cursor-pointer text-xs font-mono tracking-wider uppercase"
          >
            {locale === 'en' ? 'ES' : 'EN'}
          </Button>

          <Button variant="ghost" size="icon" asChild className="cursor-pointer">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-4.5 h-4.5" />
            </a>
          </Button>
          <Button asChild size="sm" className="rounded-full cursor-pointer">
            <a href="#features">{t.site.getStarted}</a>
          </Button>
        </div>

        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="cursor-pointer"
            aria-label={t.nav.theme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={cycleLocale}
            className="cursor-pointer text-xs font-mono tracking-wider uppercase"
          >
            {locale === 'en' ? 'ES' : 'EN'}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-border/30 w-[240px]">
              <SheetTitle className="text-left font-bold tracking-tight text-foreground">{siteConfig.name}</SheetTitle>
              <div className="flex flex-col gap-5 mt-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-4 border-t border-border/20 pt-5">
                  <Button variant="outline" asChild className="w-full cursor-pointer">
                    <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  </Button>
                  <Button asChild className="w-full rounded-full cursor-pointer">
                    <a href="#features">{t.site.getStarted}</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
