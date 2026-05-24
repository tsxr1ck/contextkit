import { useState } from 'react'
import { Folder, FileCode, CheckCircle, Info } from 'lucide-react'
import { SectionShell } from '@/components/layout/section-shell'
import { SectionHeading } from '@/components/shared/section-heading'
import { Reveal } from '@/components/shared/reveal'
import { useT } from '@/lib/i18n'

type SelectedFile = 'claude' | 'local' | 'readme'

export function OutputShowcase() {
  const [selectedFile, setSelectedFile] = useState<SelectedFile>('claude')
  const t = useT()

  const fileContents = t.outputs.files

  return (
    <SectionShell id="outputs">
      <Reveal>
        <SectionHeading
          badge={t.outputs.badge}
          title={t.outputs.title}
          subtitle={t.outputs.subtitle}
        />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-4">
        {/* Left Column: Explorer Tree */}
        <Reveal delay={0.1} className="lg:col-span-4 h-full">
          <div className="flex flex-col h-full rounded-xl border border-border bg-card/25 backdrop-blur-md p-4 text-left select-none">
            <p className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mb-4 pl-2">
              {t.outputs.workspaceTree}
            </p>
            <div className="flex flex-col gap-1.5 font-mono text-xs text-foreground/85">
              <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
                <Folder className="w-4 h-4 shrink-0 text-primary/60" /> src/
              </div>
              <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
                <Folder className="w-4 h-4 shrink-0 text-primary/60" /> tests/
              </div>
              <button
                onClick={() => setSelectedFile('readme')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer text-left ${
                  selectedFile === 'readme'
                    ? 'bg-secondary/40 text-foreground font-semibold border-l-2 border-primary pl-1.5'
                    : 'hover:bg-muted/30'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0 text-muted-foreground" /> README.md
              </button>

              <div className="border-t border-border/10 my-2" />

              <button
                onClick={() => setSelectedFile('claude')}
                className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors cursor-pointer text-left ${
                  selectedFile === 'claude'
                    ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-1.5'
                    : 'hover:bg-primary/5 text-emerald-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 shrink-0" /> CLAUDE.md
                </span>
                <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                  {t.outputs.gitShared}
                </span>
              </button>

              <button
                onClick={() => setSelectedFile('local')}
                className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-colors cursor-pointer text-left ${
                  selectedFile === 'local'
                    ? 'bg-accent/10 text-accent font-semibold border-l-2 border-accent pl-1.5'
                    : 'hover:bg-accent/5 text-violet-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 shrink-0" /> CLAUDE.local.md
                </span>
                <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-normal">
                  {t.outputs.ignored}
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Code Preview */}
        <Reveal delay={0.2} className="lg:col-span-8 h-full">
          <div className="flex flex-col h-full rounded-xl border border-border bg-card/45 backdrop-blur-md overflow-hidden text-left font-mono">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/20 border-b border-border/20">
              <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5 select-none">
                <FileCode className="w-3.5 h-3.5 text-primary" /> {fileContents[selectedFile].title}
              </span>
              {selectedFile === 'local' ? (
                <span className="flex items-center gap-1 text-[9px] font-sans bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded select-none">
                  <Info className="w-2.5 h-2.5" /> {t.outputs.ignoredInGitignore}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-sans bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded select-none">
                  <CheckCircle className="w-2.5 h-2.5" /> {t.outputs.versionControlled}
                </span>
              )}
            </div>

            {/* Editor Area */}
            <div className="p-5 flex-1 max-h-[300px] overflow-y-auto text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap select-text selection:bg-primary/20">
              {fileContents[selectedFile].content}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
