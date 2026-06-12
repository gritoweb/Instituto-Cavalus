import type { ArticleCardData } from '../components/ui/ArticleCard'
import type { CourseCardData } from '../components/ui/CourseCard'

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** Formata data como "14 mai 2026" (1:1 com o HTML). */
export function formatDate(value?: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`
}

export function mapArticle(doc: any): ArticleCardData {
  const category = doc.category && typeof doc.category === 'object' ? doc.category : null
  const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
  const slug = category?.slug ?? 'sem-categoria'
  return {
    id: String(doc.id),
    title: doc.title,
    excerpt: doc.excerpt,
    href: `/artigos/${doc.slug}`,
    categoryName: category?.name ?? 'Sem categoria',
    categorySlugs: [slug],
    dateLabel: formatDate(doc.publishedAt),
    readingLabel: doc.readingTime ? `${doc.readingTime} min de leitura` : '',
    coverUrl: cover?.url ?? null,
    coverAlt: cover?.alt ?? '',
    colorFrom: category?.coverColorFrom ?? '#314a2a',
    colorTo: category?.coverColorTo ?? '#1a2f1d',
  }
}

export function mapCourse(doc: any): CourseCardData {
  const cats = Array.isArray(doc.categories)
    ? doc.categories.filter((c: unknown) => c && typeof c === 'object')
    : []
  const cover = doc.cover && typeof doc.cover === 'object' ? doc.cover : null
  return {
    id: String(doc.id),
    title: doc.title,
    description: doc.description,
    href: `/cursos/${doc.slug}`,
    categoryNames: cats.map((c: any) => c.name),
    categorySlugs: cats.map((c: any) => c.slug),
    priceOld: doc.priceOld ?? null,
    priceNow: doc.priceNow,
    colorFrom: doc.coverColorFrom ?? cats[0]?.coverColorFrom ?? '#314a2a',
    colorTo: doc.coverColorTo ?? cats[0]?.coverColorTo ?? '#1a2f1d',
    coverUrl: cover?.url ?? null,
    coverAlt: cover?.alt ?? '',
  }
}
