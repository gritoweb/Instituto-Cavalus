import React from 'react'

import { Icon, type IconName } from './Icon'

type CategoryCardProps = {
  icon: IconName
  name: string
  count?: string | null
  href: string
}

/** Card de categoria/área (cat) — seção "Explore por área". Hover muda o ícone para verde. */
export function CategoryCard({ icon, name, count, href }: CategoryCardProps) {
  return (
    <a
      href={href}
      className="group flex cursor-pointer flex-col gap-4 rounded-[var(--radius-lg)] border-[1.5px] border-ink-300/30 bg-surface-0 px-6 py-7 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-brand-green hover:shadow-md"
    >
      <div className="grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-brand-tint text-brand-dark transition-all duration-200 ease-in-out group-hover:bg-brand-green group-hover:text-white">
        <Icon name={icon} size={22} strokeWidth={1.8} />
      </div>
      <div className="font-display text-lg font-semibold leading-tight text-ink-900">{name}</div>
      {count ? (
        <div className="mt-auto text-sm font-medium tracking-wide text-ink-500">{count}</div>
      ) : null}
    </a>
  )
}
