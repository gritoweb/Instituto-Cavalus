import React from 'react'

import { cn } from '../../utilities/cn'
import { Icon } from './Icon'

type SectionHeadProps = {
  eyebrow?: string | null
  title: string
  lede?: string | null
  linkLabel?: string | null
  linkHref?: string | null
  center?: boolean
  dark?: boolean
}

/** Cabeçalho de seção (section-head): eyebrow + h2 + lede opcional + link "Ver todos". */
export function SectionHead({
  eyebrow,
  title,
  lede,
  linkLabel,
  linkHref,
  center = false,
  dark = false,
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-wrap items-end justify-between gap-6',
        center && 'justify-center text-center',
      )}
    >
      <div className={cn('max-w-[720px]', center && 'mx-auto')}>
        {eyebrow ? (
          <span className={cn('eyebrow mb-3 block', dark && '!text-brand-tint')}>{eyebrow}</span>
        ) : null}
        <h2 className={cn('mb-3', dark && '!text-white')}>{title}</h2>
        {lede ? <p className={cn('lede m-0', dark && '!text-white/70')}>{lede}</p> : null}
      </div>

      {linkLabel && linkHref ? (
        <a
          href={linkHref}
          className={cn(
            'group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold',
            dark ? 'text-brand-tint hover:text-white' : 'text-brand-green',
          )}
        >
          {linkLabel}
          <Icon
            name="arrow-right"
            size={16}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </a>
      ) : null}
    </div>
  )
}
