'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

import { Brand } from '../../components/ui/Brand'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { cn } from '../../utilities/cn'

export type HeaderNavItem = { label: string; href: string; id?: string | null }
export type HeaderData = {
  navItems?: HeaderNavItem[] | null
  cta?: { label?: string | null; href?: string | null } | null
}

export function Header({ navItems, cta }: HeaderData) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const items = navItems ?? []
  const ctaLabel = cta?.label ?? 'Ver cursos'
  const ctaHref = cta?.href ?? '/cursos'

  const isCurrent = (href: string) =>
    href.startsWith('/') && (pathname === href || pathname?.startsWith(`${href}/`))

  return (
    <header className="sticky top-0 z-50 border-b border-ink-300/25 bg-white text-ink-900" role="banner">
      <div className="mx-auto flex h-[72px] w-full max-w-[var(--container-site)] items-center justify-between gap-6 px-4 md:px-6 lg:h-[88px] lg:px-8">
        <Brand href="/" />

        <nav className="ml-auto hidden items-center gap-9 lg:flex" aria-label="Principal">
          {items.map((item, i) => {
            const current = isCurrent(item.href)
            return (
              <a
                key={item.id ?? i}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'relative py-1.5 text-sm font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-brand-green after:transition-[width] after:duration-200 after:content-[""] hover:text-brand-green hover:after:w-full',
                  current ? 'text-brand-green after:w-full' : 'text-ink-900 after:w-0',
                )}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className='flex gap-5'>
          <Button href={ctaHref} variant="primary" size="sm" className="hidden lg:inline-flex">
            {ctaLabel}
          </Button>

          <button
            type="button"
            aria-label="Abrir menu"
            aria-controls="mmenu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center bg-transparent p-2 text-ink-900 lg:hidden"
          >
            <Icon name="menu" size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mmenu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false)
        }}
        className={cn(
          'fixed inset-0 z-[100] bg-ink-900/50 transition-opacity duration-200',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div
          className={cn(
            'absolute bottom-0 right-0 top-0 flex w-[min(86vw,360px)] flex-col gap-6 bg-white p-6 transition-transform duration-[240ms] ease-in-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="h-11 w-11 self-end bg-transparent p-2 text-ink-700"
          >
            <Icon name="x" size={24} strokeWidth={2} />
          </button>

          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink-300/30 px-3 py-3.5 font-display text-xl font-semibold text-ink-900 hover:text-brand-green"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <Button href={ctaHref} variant="primary" className="w-full">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </header>
  )
}
