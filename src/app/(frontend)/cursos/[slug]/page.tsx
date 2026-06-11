import type { Metadata } from 'next'
import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { CourseDetailBlock } from '@/blocks/CourseDetail/Component'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

async function queryCourseBySlug(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'courses',
    limit: 1,
    depth: 1,
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await queryCourseBySlug(slug)
  return generateMeta(course)
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const course = await queryCourseBySlug(slug)
  if (!course) notFound()

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <CourseDetailBlock course={course} />
    </>
  )
}
