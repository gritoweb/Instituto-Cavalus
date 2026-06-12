import React from 'react'

import { Container } from '../../components/ui/Container'
import { FeatureCard } from '../../components/ui/FeatureCard'
import type { IconName } from '../../components/ui/Icon'
import { SectionHead } from '../../components/ui/SectionHead'

export type FeatureGridProps = {
  eyebrow?: string | null
  title: string
  lede?: string | null
  features?: { icon: IconName; title: string; description: string; id?: string | null }[] | null
}

export function FeatureGridBlock({ eyebrow, title, lede, features }: FeatureGridProps) {
  return (
    <section className="py-16 lg:py-24" aria-label={title}>
      <Container>
        <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features?.map((f, i) => (
            <FeatureCard key={f.id ?? i} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </Container>
    </section>
  )
}
