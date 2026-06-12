'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React, { Fragment, useEffect } from 'react'

import { CtaBandBlock } from '../blocks/CtaBand/Component'
import { FaqBlock } from '../blocks/Faq/Component'
import { FeatureGridBlock } from '../blocks/FeatureGrid/Component'
import { HeroEditorialBlock } from '../blocks/HeroEditorial/Component'
import { StatsStripBlock } from '../blocks/StatsStrip/Component'
import type { LayoutBlock } from './RenderBlocks'

/** Blocos apresentacionais — atualizam ao vivo a cada tecla digitada no admin. */
const liveBlocks: Record<string, React.ComponentType<any>> = {
  heroEditorial: HeroEditorialBlock,
  featureGrid: FeatureGridBlock,
  ctaBand: CtaBandBlock,
  statsStrip: StatsStripBlock,
  faq: FaqBlock,
}

type LivePreviewData = Record<string, any>

type Props = {
  /** Dados iniciais da página (vindos do servidor) para evitar flicker. */
  initialData: LivePreviewData
  serverURL: string
  /** Blocos de dados pré-renderizados no servidor, indexados por block.id. */
  serverBlocks: Record<string, React.ReactNode>
}

/**
 * Renderiza a página em modo live preview: blocos apresentacionais reagem ao
 * postMessage do admin (mudam ao digitar); blocos de dados usam o nó já
 * renderizado no servidor (atualizam ao salvar).
 */
export function LivePreviewBlocks({ initialData, serverURL, serverBlocks }: Props) {
  const { data } = useLivePreview<LivePreviewData>({ initialData, serverURL, depth: 2 })

  // Rola até o bloco quando o admin clica no header (SCROLL_TO_BLOCK).
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type !== 'SCROLL_TO_BLOCK') return
      const blockIndex = e.data.blockIndex
      if (typeof blockIndex !== 'number') return
      const el = document.querySelector(`[data-block-index="${blockIndex}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const blocks = (data?.layout as LayoutBlock[] | null | undefined) ?? []
  if (!blocks.length) return null

  return (
    <Fragment>
      {blocks.map((block, i) => {
        const key = block.id ?? i
        const Live = liveBlocks[block.blockType]
        if (Live)
          return (
            <div key={key} data-block-index={i}>
              <Live {...block} />
            </div>
          )

        const slot = block.id != null ? serverBlocks[String(block.id)] : undefined
        return slot ? (
          <div key={key} data-block-index={i}>
            {slot}
          </div>
        ) : null
      })}
    </Fragment>
  )
}
