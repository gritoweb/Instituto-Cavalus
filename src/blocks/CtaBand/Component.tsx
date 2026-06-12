import React from 'react'

import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'

export type CtaBandProps = {
  eyebrow?: string | null
  title: string
  text?: string | null
  actions?: { label: string; href: string; variant?: 'white' | 'outline-white' | null; id?: string | null }[] | null
}

export function CtaBandBlock({ eyebrow, title, text, actions }: CtaBandProps) {
  return (
    <section
      aria-label="Comece agora"
      className="py-24 text-center text-white [background:radial-gradient(circle_at_80%_20%,rgba(255,255,255,.08)_0%,transparent_45%),linear-gradient(135deg,var(--color-brand-green)_0%,var(--color-brand-dark)_100%)]"
    >
      <Container>
        {eyebrow ? <span className="eyebrow !text-white/85">{eyebrow}</span> : null}
        <h2 className="mx-auto mt-3 max-w-[720px] !text-white">{title}</h2>
        {text ? (
          <p className="mx-auto mb-8 mt-4 max-w-[560px] text-[17px] text-white/90">{text}</p>
        ) : null}
        {actions?.length ? (
          <div className="inline-flex flex-wrap justify-center gap-3">
            {actions.map((a, i) => (
              <Button key={a.id ?? i} href={a.href} variant={a.variant ?? 'white'} size="lg">
                {a.label}
              </Button>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
