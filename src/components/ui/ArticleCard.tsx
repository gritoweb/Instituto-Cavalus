import React from 'react'

import { Chip } from './Chip'
import { Icon } from './Icon'

export type ArticleCardData = {
  id: string
  title: string
  excerpt: string
  href: string
  categoryName: string
  /** slugs das categorias do artigo (para o filtro) */
  categorySlugs: string[]
  dateLabel: string
  readingLabel: string
  coverUrl?: string | null
  coverAlt?: string
  colorFrom: string
  colorTo: string
}

type ArticleCardProps = {
  article: ArticleCardData
  hidden?: boolean
}

/** Card de artigo (article) — 1:1 com artigos.html. */
export function ArticleCard({ article, hidden }: ArticleCardProps) {
  const {
    title,
    excerpt,
    href,
    categoryName,
    dateLabel,
    readingLabel,
    coverUrl,
    coverAlt,
    colorFrom,
    colorTo,
  } = article

  return (
    <article
      hidden={hidden}
      data-cats={article.categorySlugs.join(' ')}
      className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-ink-300/25 bg-surface-0 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:border-brand-green/40 hover:shadow-lg"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{
          background: coverUrl
            ? undefined
            : `radial-gradient(circle at 20% 20%, rgba(255,255,255,.15), transparent 50%), linear-gradient(135deg, ${colorFrom} 0%, ${colorTo} 100%)`,
        }}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={coverAlt || ''} className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          <Chip>{categoryName}</Chip>
        </div>

        <h3 className="m-0 font-display text-[18px] font-semibold leading-[1.3] text-ink-900">
          {title}
        </h3>

        <p className="m-0 text-sm leading-[1.55] text-ink-500">{excerpt}</p>

        <hr className="mt-1 border-0 border-t border-ink-300/30" />

        <div className="mt-auto flex min-w-0 flex-col items-start gap-3.5">
          <div className="inline-flex min-w-0 shrink items-center gap-2.5 text-[13px] font-medium text-ink-500">
            <span>{dateLabel}</span>
            <span aria-hidden className="h-[3px] w-[3px] shrink-0 rounded-full bg-ink-300" />
            <span>{readingLabel}</span>
          </div>

          <a
            href={href}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-md)] bg-brand-green px-3.5 py-[9px] text-[13px] font-semibold text-white no-underline transition-all duration-200 ease-in-out hover:bg-brand-dark hover:text-white"
          >
            Leia mais
            <Icon name="arrow-right" size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </article>
  )
}
