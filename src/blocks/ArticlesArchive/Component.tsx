import { getPayload } from 'payload'

import config from '@/payload.config'
import type { ArticleCardData } from '../../components/ui/ArticleCard'
import { mapArticle } from '../../utilities/content'
import { ArticlesArchiveClient, type CategoryFilter } from './Component.client'

export type ArticlesArchiveProps = {
  label?: string | null
  searchPlaceholder?: string | null
  articlesLimit?: number | null
  emptyTitle?: string | null
  emptyText?: string | null
}

export async function ArticlesArchiveBlock(props: ArticlesArchiveProps) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'articles',
    limit: props.articlesLimit ?? 12,
    depth: 1,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  const categoryCounts = new Map<string, { name: string; slug: string; count: number }>()

  const articles: ArticleCardData[] = docs.map((doc: any) => {
    const card = mapArticle(doc)
    const slug = card.categorySlugs[0]
    const existing = categoryCounts.get(slug)
    if (existing) existing.count += 1
    else categoryCounts.set(slug, { name: card.categoryName, slug, count: 1 })
    return card
  })

  const categories: CategoryFilter[] = [
    { label: 'Todos', value: 'all', count: articles.length },
    ...Array.from(categoryCounts.values())
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((c) => ({ label: c.name, value: c.slug, count: c.count })),
  ]

  return (
    <section className="bg-surface-100 pb-20 pt-14 lg:pb-24 lg:pt-[72px]" aria-label="Artigos">
      <ArticlesArchiveClient
        label={props.label ?? 'Filtrar por categoria'}
        searchPlaceholder={props.searchPlaceholder ?? 'Buscar artigos por título ou tema…'}
        emptyTitle={props.emptyTitle ?? 'Nenhum artigo encontrado'}
        emptyText={
          props.emptyText ??
          'Não encontramos artigos nessa categoria. Tente outra área ou volte a ver todos.'
        }
        articles={articles}
        categories={categories}
      />
    </section>
  )
}
