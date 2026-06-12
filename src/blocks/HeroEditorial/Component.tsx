import React from 'react'

import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { FloatingInfoCard } from '../../components/ui/FloatingInfoCard'
import { HeroArt } from '../../components/ui/HeroArt'
import type { IconName } from '../../components/ui/Icon'

export type HeroEditorialProps = {
  eyebrow?: string | null
  headlineBefore: string
  headlineEmphasis?: string | null
  headlineAfter?: string | null
  lede?: string | null
  actions?: { label: string; href: string; variant?: 'primary' | 'ghost' | null; id?: string | null }[] | null
  showArt?: boolean | null
  floatingCards?:
    | {
        icon: Extract<IconName, 'book' | 'users' | 'share-2' | 'award' | 'smartphone'>
        position: 'top' | 'mid' | 'bottom'
        title: string
        subtitle: string
        id?: string | null
      }[]
    | null
}

export function HeroEditorialBlock(props: HeroEditorialProps) {
  const { eyebrow, headlineBefore, headlineEmphasis, headlineAfter, lede, actions, showArt, floatingCards } =
    props

  return (
    <section className="relative overflow-hidden bg-white py-16 pb-[72px] lg:py-[88px] lg:pb-24" aria-label="Apresentação">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            {eyebrow ? (
              <span className="eyebrow mb-5 inline-flex items-center gap-2.5">
                <span className="inline-block h-px w-8 bg-brand-dark align-middle" />
                {eyebrow}
              </span>
            ) : null}

            <h1 className="display mb-6 max-w-[16ch]">
              {headlineBefore}
              {headlineEmphasis ? (
                <em className="italic font-medium text-brand-dark">
                  {' '}
                  {headlineEmphasis}
                </em>
              ) : null}
              {headlineAfter ? ` ${headlineAfter}` : null}
            </h1>

            {lede ? <p className="lede m-0">{lede}</p> : null}

            {actions?.length ? (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {actions.map((a, i) => (
                  <Button key={a.id ?? i} href={a.href} variant={a.variant ?? 'primary'} size="lg">
                    {a.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          {showArt ? (
            <HeroArt>
              {floatingCards?.map((card, i) => (
                <FloatingInfoCard
                  key={card.id ?? i}
                  icon={card.icon}
                  title={card.title}
                  subtitle={card.subtitle}
                  position={card.position}
                />
              ))}
            </HeroArt>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
