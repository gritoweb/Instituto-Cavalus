import React from 'react'

import { Icon } from './Icon'

export type CourseCardData = {
  id: string
  title: string
  description: string
  href: string
  categoryNames: string[]
  categorySlugs: string[]
  priceOld?: string | null
  priceNow: string
  colorFrom: string
  colorTo: string
  coverUrl?: string | null
  coverAlt?: string
}

/** Card de curso (course) — 1:1 com index/cursos.html. */
export function CourseCard({ course, hidden }: { course: CourseCardData; hidden?: boolean }) {
  const { title, description, href, categoryNames, priceOld, priceNow, colorFrom, colorTo, coverUrl, coverAlt } =
    course

  return (
    <article
      hidden={hidden}
      data-cats={course.categorySlugs.join(' ')}
      className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-ink-300/25 bg-surface-0 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:border-brand-green/40 hover:shadow-lg"
    >
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: coverUrl
            ? undefined
            : `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.18) 0%, transparent 60%), linear-gradient(135deg, ${colorFrom} 0%, ${colorTo} 100%)`,
        }}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={coverAlt || ''} className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {categoryNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center rounded-[var(--radius-pill)] bg-brand-tint px-2.5 py-[3px] text-xs font-semibold uppercase tracking-wider text-brand-dark"
            >
              {name}
            </span>
          ))}
        </div>

        <h3 className="text-lg leading-snug">{title}</h3>

        <p className="m-0 text-sm leading-normal text-ink-500">{description}</p>

        <hr className="mt-1 border-0 border-t border-ink-300/30" />

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2.5">
          <div className="min-w-0 shrink leading-none">
            {priceOld ? (
              <span className="mb-0.5 block text-xs font-medium text-ink-500 line-through">
                {priceOld}
              </span>
            ) : null}
            <span className="font-display text-xl font-bold tabular-nums tracking-tight text-brand-green">
              R$ {priceNow}
            </span>
          </div>

          <a
            href={href}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-md)] bg-brand-green px-3.5 py-[9px] text-sm font-semibold text-white no-underline transition-all duration-200 ease-in-out hover:bg-brand-dark hover:text-white"
          >
            Comprar curso
            <Icon name="arrow-up-right" size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </article>
  )
}
