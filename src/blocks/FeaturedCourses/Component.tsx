import { getPayload } from 'payload'

import config from '@/payload.config'
import { Container } from '../../components/ui/Container'
import { CourseCard } from '../../components/ui/CourseCard'
import { SectionHead } from '../../components/ui/SectionHead'
import { cn } from '../../utilities/cn'
import { mapCourse } from '../../utilities/content'

export type FeaturedCoursesProps = {
  eyebrow?: string | null
  title: string
  linkLabel?: string | null
  linkHref?: string | null
  source?: 'featured' | 'latest' | 'manual' | null
  courses?: (number | string | Record<string, unknown>)[] | null
  limit?: number | null
  alt?: boolean | null
}

export async function FeaturedCoursesBlock(props: FeaturedCoursesProps) {
  const payload = await getPayload({ config: await config })
  const limit = props.limit ?? 8

  let docs: any[] = []
  if (props.source === 'manual') {
    docs = (props.courses ?? []).filter((c) => c && typeof c === 'object') as any[]
  } else {
    const res = await payload.find({
      collection: 'courses',
      limit,
      depth: 1,
      sort: '-createdAt',
      where: {
        _status: { equals: 'published' },
        ...(props.source === 'featured' ? { featured: { equals: true } } : {}),
      },
    })
    docs = res.docs
  }

  const courses = docs.map(mapCourse)

  return (
    <section
      id="cursos"
      aria-label={props.title}
      className={cn('py-16 lg:py-24', props.alt && 'bg-surface-100')}
    >
      <Container>
        <SectionHead
          eyebrow={props.eyebrow}
          title={props.title}
          linkLabel={props.linkLabel}
          linkHref={props.linkHref}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Container>
    </section>
  )
}
