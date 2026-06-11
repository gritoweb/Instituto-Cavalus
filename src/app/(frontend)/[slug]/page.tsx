import type { Metadata } from 'next'
import React from 'react'

import { PageView, queryPageBySlug } from '@/components/PageView'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await queryPageBySlug(slug)
  return generateMeta(page)
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageView slug={slug} />
}
