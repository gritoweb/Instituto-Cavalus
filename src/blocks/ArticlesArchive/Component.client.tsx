'use client'

import React, { useMemo, useState } from 'react'

import { ArticleCard, type ArticleCardData } from '../../components/ui/ArticleCard'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { FilterPill } from '../../components/ui/FilterPill'
import { Icon } from '../../components/ui/Icon'
import { SearchInput } from '../../components/ui/SearchInput'

export type CategoryFilter = { label: string; value: string; count: number }

type ArticlesArchiveClientProps = {
  label: string
  searchPlaceholder: string
  emptyTitle: string
  emptyText: string
  articles: ArticleCardData[]
  categories: CategoryFilter[]
}

/** Normaliza para busca tolerante a acentos. */
function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function ArticlesArchiveClient({
  label,
  searchPlaceholder,
  emptyTitle,
  emptyText,
  articles,
  categories,
}: ArticlesArchiveClientProps) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  // texto pesquisável por artigo (calculado uma vez)
  const indexed = useMemo(
    () =>
      articles.map((a) => ({
        article: a,
        search: norm(`${a.title} ${a.excerpt} ${a.categoryName}`),
      })),
    [articles],
  )

  const q = norm(query.trim())
  const results = indexed.map(({ article, search }) => {
    const matchCat = filter === 'all' || article.categorySlugs.includes(filter)
    const matchQuery = q === '' || search.includes(q)
    return { article, visible: matchCat && matchQuery }
  })

  const visibleCount = results.filter((r) => r.visible).length
  const isEmpty = visibleCount === 0

  const emptyMessage = query.trim()
    ? `Não encontramos artigos para "${query.trim()}". Tente outra palavra-chave ou categoria.`
    : emptyText

  const resetFilters = () => {
    setFilter('all')
    setQuery('')
  }

  return (
    <Container>
      {/* Filterbar */}
      <div className="mb-10 rounded-[var(--radius-lg)] border border-ink-300/25 bg-white p-6 shadow-sm md:px-8 md:py-7">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <span className="inline-flex items-center gap-2 font-display text-[15px] font-semibold text-ink-900">
            <Icon name="sliders" size={18} strokeWidth={1.8} className="text-brand-dark" />
            {label}
          </span>
          <span className="text-sm font-medium text-ink-500">
            <b className="font-semibold text-ink-900">{visibleCount}</b> artigos encontrados
          </span>
        </div>

        <SearchInput
          value={query}
          placeholder={searchPlaceholder}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />

        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Categorias">
          {categories.map((cat) => (
            <FilterPill
              key={cat.value}
              label={cat.label}
              count={cat.count}
              active={filter === cat.value}
              onClick={() => setFilter(cat.value)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ display: isEmpty ? 'none' : undefined }}
      >
        {results.map(({ article, visible }) => (
          <ArticleCard key={article.id} article={article} hidden={!visible} />
        ))}
      </div>

      {/* Estado vazio */}
      {isEmpty ? (
        <div
          role="status"
          className="rounded-[var(--radius-lg)] border border-dashed border-ink-300/50 bg-surface-0 px-6 py-[72px] text-center"
        >
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-brand-tint-soft text-brand-dark">
            <Icon name="search" size={28} strokeWidth={1.8} />
          </div>
          <h3 className="mb-2">{emptyTitle}</h3>
          <p className="mx-auto mb-6 max-w-[42ch] text-[15px] text-ink-500">{emptyMessage}</p>
          <Button variant="ghost" onClick={resetFilters}>
            Ver todos os artigos
          </Button>
        </div>
      ) : null}
    </Container>
  )
}
