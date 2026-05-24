import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Locale, Translations } from './types'
import { I18nContext } from './useTranslation'
import en from './locales/en'
import es from './locales/es'

const locales: Record<Locale, Translations> = { en, es }

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('contextkit-locale')
  if (stored === 'en' || stored === 'es') return stored
  const browserLang = navigator.language.slice(0, 2)
  if (browserLang === 'es') return 'es'
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('contextkit-locale', l)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
