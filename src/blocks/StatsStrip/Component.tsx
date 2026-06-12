'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Container } from '../../components/ui/Container'

export type StatsStripProps = {
  items?: { prefix?: string | null; value: string; caption: string; id?: string | null }[] | null
}

/** Quebra "1.200" / "4,9" / "98%" em número-alvo (pt-BR), casas decimais e sufixo. */
function parseValue(raw: string) {
  const match = raw.match(/^[\d.,]+/)
  if (!match) return null
  const numericStr = match[0]
  const suffix = raw.slice(numericStr.length)
  const decimals = numericStr.includes(',') ? (numericStr.split(',')[1]?.length ?? 0) : 0
  const target = parseFloat(numericStr.replace(/\./g, '').replace(',', '.'))
  if (Number.isNaN(target)) return null
  return { target, decimals, suffix }
}

function Counter({ value }: { value: string }) {
  const parsed = useMemo(() => parseValue(value), [value])
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const [display, setDisplay] = useState(() => (parsed ? '0' : value))

  useEffect(() => {
    if (!parsed) return
    const el = ref.current
    if (!el) return

    const format = (n: number) =>
      n.toLocaleString('pt-BR', {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(format(parsed.target))
      return
    }

    let raf = 0
    let start = 0
    const duration = 1600

    const tick = (now: number) => {
      if (!start) start = now
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(format(parsed.target * eased))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(format(parsed.target)) // trava no valor exato
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true // garante uma única execução
          observer.disconnect()
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [parsed])

  return (
    <span ref={ref}>
      {display}
      {parsed?.suffix}
    </span>
  )
}

export function StatsStripBlock({ items }: StatsStripProps) {
  if (!items?.length) return null
  return (
    <section className="bg-brand-tint-soft py-11" aria-label="Números do Instituto">
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {items.map((item, i) => (
            <div key={item.id ?? i} className="flex flex-col gap-1">
              <span className="font-display text-[clamp(28px,3vw,36px)] font-bold leading-none tracking-[-0.015em] tabular-nums text-ink-900">
                {item.prefix ? <span className="text-brand-green">{item.prefix}</span> : null}
                <Counter value={item.value} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">
                {item.caption}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
