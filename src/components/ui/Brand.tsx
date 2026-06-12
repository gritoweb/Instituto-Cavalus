import React from 'react'

import { cn } from '../../utilities/cn'

type BrandProps = {
  href?: string
  /** Variante escura (footer): textos em branco. */
  onDark?: boolean
  className?: string
}

/** Logo: marca circular "C" + nome "Instituto Cavalus" e subtítulo. */
export function Brand({ href = '/', onDark = false, className }: BrandProps) {
  const textColor = onDark ? 'text-white' : 'text-ink-900'
  return (
    <a
      href={href}
      aria-label="Instituto Cavalus — página inicial"
      className={cn(
        'inline-flex items-center gap-3 font-bold tracking-[-0.005em] hover:text-ink-900',
        textColor,
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-[38px] w-[38px] shrink-0 place-items-center justify-center rounded-full bg-brand-green font-display text-xl font-bold text-white"
      >
        C
      </span>
      <span
        className={cn(
          'font-display text-[19px] font-semibold leading-[1.1] tracking-[-0.01em]',
          textColor,
        )}
      >
        Instituto Cavalus
        <small className="mt-0.5 block font-body text-[11px] font-medium uppercase tracking-[0.1em] text-ink-500">
          Educação equestre
        </small>
      </span>
    </a>
  )
}
