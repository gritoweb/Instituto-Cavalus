import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'
import { RenderBlocks } from './RenderBlocks'

/** Busca uma página pelo slug, respeitando draft mode. */
export async function queryPageBySlug(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    limit: 1,
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return docs[0] ?? null
}

/** Busca uma página pelo slug e renderiza seus blocos. */
export async function PageView({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
