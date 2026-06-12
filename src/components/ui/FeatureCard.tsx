import React from 'react'

import { Icon, type IconName } from './Icon'

type FeatureCardProps = {
  icon: IconName
  title: string
  description: string
}

/** Card de diferencial (feature) — seção "Por que estudar". */
export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-ink-300/25 bg-surface-0 px-7 py-8 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-brand-green hover:shadow-md">
      <div className="mb-6 grid h-14 w-14 place-items-center rounded-[var(--radius-md)] bg-brand-tint text-brand-dark">
        <Icon name={icon} size={26} strokeWidth={1.8} />
      </div>
      <h4 className="mb-2.5">{title}</h4>
      <p className="m-0 text-sm text-ink-700">{description}</p>
    </div>
  )
}
