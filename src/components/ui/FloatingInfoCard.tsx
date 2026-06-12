import React from 'react'

import { cn } from '../../utilities/cn'
import { Icon, type IconName } from './Icon'

type FloatingInfoCardProps = {
  icon: IconName
  title: string
  subtitle: string
  /** posição flutuante sobre a arte do hero */
  position: 'top' | 'mid' | 'bottom'
}

const positions: Record<FloatingInfoCardProps['position'], string> = {
  top: 'top-[6%] left-[-6%] max-w-[240px] max-lg:left-0 max-lg:top-[2%] max-sm:max-w-[200px]',
  mid: 'top-[46%] right-[-10%] max-w-[200px] max-lg:right-[-4%] max-sm:hidden',
  bottom:
    'bottom-[8%] right-[-6%] max-w-[230px] max-lg:right-0 max-lg:bottom-[2%] max-sm:max-w-[190px]',
}

/** Atraso escalonado da entrada por posição (efeito cascata). */
const delays: Record<FloatingInfoCardProps['position'], string> = {
  top: '[animation-delay:0.15s]',
  mid: '[animation-delay:0.3s]',
  bottom: '[animation-delay:0.45s]',
}

/** Cartão flutuante do hero (hero__card). */
export function FloatingInfoCard({ icon, title, subtitle, position }: FloatingInfoCardProps) {
  return (
    <div
      className={cn(
        'absolute z-[3] flex items-center gap-3 rounded-[var(--radius-lg)] border border-ink-300/[0.18] bg-white p-[14px_16px] max-sm:p-[10px_12px]',
        'animate-card-in',
        positions[position],
        delays[position],
      )}
      style={{ boxShadow: '0 12px 28px rgba(33,37,41,.10), 0 2px 6px rgba(33,37,41,.04)' }}
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-tint text-brand-dark">
        <Icon name={icon} size={20} strokeWidth={1.8} />
      </div>
      <div>
        <div className="font-display text-sm font-semibold leading-[1.2] text-ink-900 max-sm:text-[13px]">
          {title}
        </div>
        <div className="mt-0.5 text-xs font-medium text-ink-500 max-sm:text-[11px]">{subtitle}</div>
      </div>
    </div>
  )
}
