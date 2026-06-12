import { getPayload } from 'payload'

import config from '@/payload.config'
import { ArticleCard } from '../../components/ui/ArticleCard'
import { Container } from '../../components/ui/Container'
import { SectionHead } from '../../components/ui/SectionHead'
import { mapArticle } from '../../utilities/content'

export type LatestArticlesProps = {
  eyebrow?: string | null
  title: string
  linkLabel?: string | null
  linkHref?: string | null
  limit?: number | null
}

export async function LatestArticlesBlock(props: LatestArticlesProps) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'articles',
    limit: props.limit ?? 3,
    depth: 1,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })
  const articles = docs.map(mapArticle)

  return (
    <section
      id="artigos"
      aria-label="Últimos artigos do blog"
      className="relative bg-brand-ink py-16 text-white/85 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.06)_50%,transparent_100%)] before:content-[''] lg:py-24"
    >
      <Container>
        <SectionHead
          eyebrow={props.eyebrow}
          title={props.title}
          linkLabel={props.linkLabel}
          linkHref={props.linkHref}
          dark
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </section>
  )
}
