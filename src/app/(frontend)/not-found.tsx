import type { Metadata } from 'next'
import React from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'

export const metadata: Metadata = {
  title: 'Página não encontrada — Instituto Cavalus',
  description: 'A página que você procurava não existe ou foi movida.',
}

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Artigos', href: '/artigos' },
]

export default function NotFound() {
  return (
    <section className="bg-white py-24 lg:py-32" aria-label="Página não encontrada">
      <Container className="flex flex-col items-center text-center">
        <span className="eyebrow mb-7 inline-flex items-center gap-2.5">
          <span className="inline-block h-px w-8 bg-brand-dark" aria-hidden />
          Erro 404
          <span className="inline-block h-px w-8 bg-brand-dark" aria-hidden />
        </span>

        <p className="error-code select-none" aria-hidden>
          404
        </p>

        <h1 className="mt-3 max-w-[20ch]">
          Parece que você{' '}
          <em className="font-medium italic text-brand-dark">puxou as rédeas</em> no caminho errado.
        </h1>

        <p className="lede mx-auto mt-6">
          A página que você procurava saiu do páreo, mudou de endereço ou nunca existiu. Mas o
          campo é grande — vamos te levar de volta ao bom caminho.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg" variant="primary">
            Voltar para a home
          </Button>
          <Button href="/cursos" size="lg" variant="ghost">
            Ver cursos
            <Icon name="arrow-right" size={18} aria-hidden />
          </Button>
        </div>

        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ink-300/25 pt-7"
          aria-label="Atalhos"
        >
          <span className="muted font-semibold">Ou explore:</span>
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href} className="font-medium text-ink-700 hover:text-brand-dark">
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </section>
  )
}
