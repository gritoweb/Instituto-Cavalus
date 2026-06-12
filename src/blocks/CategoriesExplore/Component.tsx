import { getPayload } from 'payload'

import config from '@/payload.config'
import { CategoryCard } from '../../components/ui/CategoryCard'
import { Container } from '../../components/ui/Container'
import type { IconName } from '../../components/ui/Icon'
import { SectionHead } from '../../components/ui/SectionHead'

export type CategoriesExploreProps = {
  eyebrow?: string | null
  title: string
  linkBase?: string | null
}

export async function CategoriesExploreBlock(props: CategoriesExploreProps) {
  const payload = await getPayload({ config: await config })
  const base = props.linkBase ?? '/cursos'

  const [{ docs: categories }, { docs: courses }] = await Promise.all([
    payload.find({ collection: 'categories', limit: 100, depth: 0 }),
    payload.find({
      collection: 'courses',
      limit: 1000,
      depth: 0,
      where: { _status: { equals: 'published' } },
    }),
  ])

  // conta cursos por categoria
  const counts = new Map<number | string, number>()
  for (const course of courses as any[]) {
    const ids: (number | string)[] = Array.isArray(course.categories) ? course.categories : []
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const withIcon = (categories as any[]).filter((c) => c.icon)

  return (
    <section className="py-16 lg:py-24" aria-label={props.title}>
      <Container>
        <SectionHead eyebrow={props.eyebrow} title={props.title} />
        <div className="grid  gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {withIcon.map((cat) => {
            const n = counts.get(cat.id) ?? 0
            return (
              <CategoryCard
                key={cat.id}
                icon={cat.icon as IconName}
                name={cat.name}
                count={`${n} curso${n === 1 ? '' : 's'}`}
                href={`${base}?categoria=${cat.slug}`}
              />
            )
          })}
        </div>
      </Container>
    </section>
  )
}
