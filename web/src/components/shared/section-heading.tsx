import type { ReactNode } from 'react'

export function SectionHeading({
  badge,
  title,
  subtitle,
  className = '',
}: {
  badge?: string
  title: string | ReactNode
  subtitle?: string | ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center text-center max-w-2xl mx-auto mb-12 md:mb-16 ${className}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-primary/10 border border-primary/25 text-primary mb-3.5 select-none">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
