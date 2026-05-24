import { useState, useEffect, useRef } from 'react'
import { RotateCcw, Terminal } from 'lucide-react'
import { terminalScripts } from '@/content/terminal-demo'
import type { DemoTab, TerminalStep } from '@/content/terminal-demo'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useT } from '@/lib/i18n'

export function TerminalDemo() {
  const [activeTab, setActiveTab] = useState<DemoTab>('init')
  const [visibleLines, setVisibleLines] = useState<TerminalStep[]>([])
  const [typedCommand, setTypedCommand] = useState('')
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const t = useT()
  
  const script = terminalScripts[activeTab]

  const runAnimation = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisibleLines([])
    setTypedCommand('')
    setIsTypingCommand(true)

    let charIndex = 0
    const fullCommand = script.command

    const typeCommand = () => {
      if (charIndex <= fullCommand.length) {
        setTypedCommand(fullCommand.slice(0, charIndex))
        charIndex++
        timerRef.current = setTimeout(typeCommand, 35)
      } else {
        setIsTypingCommand(false)
        renderLines(0)
      }
    }

    const renderLines = (lineIndex: number) => {
      if (lineIndex < script.steps.length) {
        const step = script.steps[lineIndex]
        if (step.type === 'command') {
          renderLines(lineIndex + 1)
          return
        }

        setVisibleLines((prev) => [...prev, step])
        timerRef.current = setTimeout(() => {
          renderLines(lineIndex + 1)
        }, step.delay || 250)
      }
    }

    timerRef.current = setTimeout(typeCommand, 200)
  }

  useEffect(() => {
    runAnimation()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [activeTab])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleLines, typedCommand])

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-border bg-card/45 backdrop-blur-md shadow-2xl shadow-black/45 overflow-hidden flex flex-col font-mono text-xs sm:text-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/25 border-b border-border/20 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span className="text-[10px] text-muted-foreground ml-2 flex items-center gap-1 font-sans">
            <Terminal className="w-3 h-3" /> bash
          </span>
        </div>
        
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as DemoTab)} className="w-auto">
          <TabsList className="h-7 bg-muted/30 p-0.5 rounded-md border border-border/10">
            <TabsTrigger value="init" className="px-2 py-0.5 text-[10px] rounded-sm cursor-pointer">init</TabsTrigger>
            <TabsTrigger value="doctor" className="px-2 py-0.5 text-[10px] rounded-sm cursor-pointer">doctor</TabsTrigger>
            <TabsTrigger value="audit" className="px-2 py-0.5 text-[10px] rounded-sm cursor-pointer">audit</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <button
          onClick={runAnimation}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-1 rounded-md transition-colors cursor-pointer shrink-0"
          title="Replay animation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Screen */}
      <div 
        ref={scrollRef}
        className="p-5 flex-1 min-h-[220px] max-h-[350px] overflow-y-auto text-left leading-relaxed text-foreground/90 selection:bg-primary/20 scroll-smooth"
      >
        {/* Shell prompt */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-primary shrink-0 select-none">$</span>
          <span className="text-foreground font-semibold">
            {typedCommand}
            {isTypingCommand && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse" />
            )}
          </span>
        </div>

        {/* Lines outputs */}
        <div className="flex flex-col gap-1 font-mono">
          {visibleLines.map((line, idx) => {
            let textColor = 'text-foreground/80'
            if (line.type === 'success') textColor = 'text-emerald-400 font-medium'
            if (line.type === 'warning') textColor = 'text-amber-400 font-medium'
            if (line.type === 'muted') textColor = 'text-muted-foreground'

            return (
              <div key={idx} className={`${textColor} whitespace-pre-wrap`}>
                {line.text}
              </div>
            )
          })}
          {!isTypingCommand && visibleLines.length === script.steps.filter(s => s.type !== 'command').length && (
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground select-none border-t border-border/10 pt-2 font-sans">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t.terminal.processCompleted}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
