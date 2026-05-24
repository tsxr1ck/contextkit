import type { ReactNode } from 'react'

export function SectionShell({
  children,
  id,
  className = '',
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <section
      id={id}
      className={`relative py-16 md:py-24 border-b border-border/20 ${className}`}
    >
      <div className="container-shell relative z-10">{children}</div>
    </section>
  )
}
