import { TooltipProvider } from '@/components/ui/tooltip'
import { HomePage } from '@/pages/home'
import { ThemeProvider } from '@/lib/theme'
import { I18nProvider } from '@/lib/i18n'

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TooltipProvider>
          <HomePage />
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
