import type { Metadata } from 'next'
import React from 'react'

import { PageView, queryPageBySlug } from '@/components/PageView'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug('home')
  return generateMeta(page)
}

export default async function HomePage() {
  return <PageView slug="home" />
}
