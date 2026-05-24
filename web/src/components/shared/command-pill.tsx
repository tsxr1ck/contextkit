import { useState } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'
import { siteConfig } from '@/content/site'

export function CommandPill() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.installCmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy command:', err)
    }
  }

  return (
    <div className="inline-flex items-center gap-3 px-4.5 py-2 rounded-full border border-border bg-card/60 backdrop-blur-md shadow-lg shadow-black/20 select-none max-w-full">
      <Terminal className="w-4 h-4 text-primary shrink-0" />
      <code className="text-xs sm:text-sm font-mono text-foreground font-semibold overflow-x-auto whitespace-nowrap">
        {siteConfig.installCmd}
      </code>
      <button
        onClick={copyToClipboard}
        className="ml-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
        aria-label="Copy installation command"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  )
}
