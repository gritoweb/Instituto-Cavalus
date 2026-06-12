import React from 'react'

import { cn } from '../../utilities/cn'

type ChipProps = {
  children: React.ReactNode
  className?: string
}

/** Pill de categoria (article__chip): fundo tint, texto dark, uppercase. */
export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-pill)] bg-brand-tint px-2.5 py-[3px] text-[10px] font-semibold uppercase leading-[1.4] tracking-[0.06em] text-brand-dark',
        className,
      )}
    >
      {children}
    </span>
  )
}
