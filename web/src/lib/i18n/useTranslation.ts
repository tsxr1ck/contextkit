import { createContext, useContext } from 'react'
import type { Locale, Translations } from './types'

export interface I18nContextValue {
  locale: Locale
  t: Translations
  setLocale: (l: Locale) => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useT(): Translations {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used within I18nProvider')
  return ctx.t
}

export type { Locale, Translations }
