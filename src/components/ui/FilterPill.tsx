'use client'

import React from 'react'

import { cn } from '../../utilities/cn'

type FilterPillProps = {
  label: string
  count: number
  active?: boolean
  onClick?: () => void
}

/** Pill de filtro de categoria (filter) com contador e estado ativo. */
export function FilterPill({ label, count, active = false, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-[7px] whitespace-nowrap rounded-[var(--radius-pill)] border px-4 py-[9px] text-sm font-semibold transition-all duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2',
        active
          ? 'border-brand-green bg-brand-green text-white'
          : 'border-ink-300/40 bg-surface-0 text-ink-700 hover:border-brand-green hover:bg-brand-tint-soft hover:text-brand-dark',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-[var(--radius-pill)] px-[7px] py-px text-xs font-semibold tabular-nums transition-all duration-200',
          active ? 'bg-white/[0.22] text-white' : 'bg-surface-100 text-ink-500',
        )}
      >
        {count}
      </span>
    </button>
  )
}
