'use client'

import React, { useState } from 'react'

import { Container } from '../../components/ui/Container'
import { Icon } from '../../components/ui/Icon'
import { SectionHead } from '../../components/ui/SectionHead'

export type FaqProps = {
  eyebrow?: string | null
  title: string
  items?: { question: string; answer: string; open?: boolean | null; id?: string | null }[] | null
}

function FaqItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string
  answer: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className="border-b border-ink-300 py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 pr-2 text-left font-display text-[18px] font-semibold leading-[1.35] text-ink-900 transition-colors duration-200 hover:text-brand-dark"
      >
        {question}
        <Icon
          name="chevron-down"
          size={24}
          strokeWidth={2}
          className={`shrink-0 text-brand-dark transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-w-[64ch] pb-6 pr-2 text-base leading-[1.65] text-ink-700">
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqBlock({ eyebrow, title, items }: FaqProps) {
  return (
    <section className="py-16 lg:py-24" aria-label="Perguntas frequentes">
      <Container>
        <SectionHead eyebrow={eyebrow} title={title} center />
        <div className="mx-auto max-w-[820px]">
          {items?.map((item, i) => (
            <FaqItem
              key={item.id ?? i}
              question={item.question}
              answer={item.answer}
              defaultOpen={item.open ?? false}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
