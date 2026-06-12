import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { LivePreviewBlocks } from './LivePreviewBlocks'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'
import { blockComponents, RenderBlocks, SERVER_DATA_BLOCKS, type LayoutBlock } from './RenderBlocks'

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

  // Fora do draft mode: render normal no servidor.
  if (!draft) {
    return <RenderBlocks blocks={page.layout} />
  }

  // Live preview: blocos de dados são pré-renderizados no servidor (slots por
  // block.id) e os apresentacionais atualizam ao vivo no client.
  const layout = (page.layout as LayoutBlock[] | null | undefined) ?? []
  const serverBlocks: Record<string, React.ReactNode> = {}
  for (const block of layout) {
    if (block.id != null && SERVER_DATA_BLOCKS.has(block.blockType)) {
      const Component = blockComponents[block.blockType]
      if (Component) serverBlocks[String(block.id)] = <Component {...block} />
    }
  }

  return (
    <>
      <RefreshRouteOnSave />
      <LivePreviewBlocks
        initialData={page}
        serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? ''}
        serverBlocks={serverBlocks}
      />
    </>
  )
}
