import { getPayload } from 'payload'

import config from '@/payload.config'
import { mapCourse } from '../../utilities/content'
import { CoursesCatalogClient } from './Component.client'
import type { CategoryFilter } from '../ArticlesArchive/Component.client'

export type CoursesCatalogProps = {
  label?: string | null
  searchPlaceholder?: string | null
  coursesLimit?: number | null
  emptyTitle?: string | null
  emptyText?: string | null
}

export async function CoursesCatalogBlock(props: CoursesCatalogProps) {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'courses',
    limit: props.coursesLimit ?? 100,
    depth: 1,
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
  })

  const courses = docs.map(mapCourse)

  // categorias presentes nos cursos, com contagem
  const counts = new Map<string, { name: string; slug: string; count: number }>()
  for (const c of courses) {
    c.categorySlugs.forEach((slug, i) => {
      const name = c.categoryNames[i]
      const existing = counts.get(slug)
      if (existing) existing.count += 1
      else counts.set(slug, { name, slug, count: 1 })
    })
  }

  const categories: CategoryFilter[] = [
    { label: 'Todos', value: 'all', count: courses.length },
    ...Array.from(counts.values())
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((c) => ({ label: c.name, value: c.slug, count: c.count })),
  ]

  return (
    <section className="bg-surface-100 pb-20 pt-14 lg:pb-24 lg:pt-[72px]" aria-label="Catálogo de cursos">
      <CoursesCatalogClient
        label={props.label ?? 'Filtrar por categoria'}
        searchPlaceholder={props.searchPlaceholder ?? 'Buscar curso por nome ou tema…'}
        emptyTitle={props.emptyTitle ?? 'Nenhum curso encontrado'}
        emptyText={
          props.emptyText ?? 'Não encontramos cursos nessa categoria. Tente outra área ou volte a ver todos.'
        }
        courses={courses}
        categories={categories}
      />
    </section>
  )
}
