import React from 'react'

import { cn } from '../../utilities/cn'

type SectionProps = {
  alt?: boolean
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}

/** Seção padrão: padding vertical 64px (mobile) / 96px (desktop). `alt` aplica fundo surface-100. */
export function Section({ alt = false, className, ariaLabel, children }: SectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn('py-16 lg:py-24', alt && 'bg-surface-100', className)}
    >
      {children}
    </section>
  )
}
