import React, { Fragment } from 'react'

import { ArticlesArchiveBlock } from '../blocks/ArticlesArchive/Component'
import { CategoriesExploreBlock } from '../blocks/CategoriesExplore/Component'
import { CourseDetailBlock } from '../blocks/CourseDetail/Component'
import { CoursesCatalogBlock } from '../blocks/CoursesCatalog/Component'
import { CtaBandBlock } from '../blocks/CtaBand/Component'
import { FaqBlock } from '../blocks/Faq/Component'
import { FeatureGridBlock } from '../blocks/FeatureGrid/Component'
import { FeaturedCoursesBlock } from '../blocks/FeaturedCourses/Component'
import { HeroEditorialBlock } from '../blocks/HeroEditorial/Component'
import { LatestArticlesBlock } from '../blocks/LatestArticles/Component'
import { StatsStripBlock } from '../blocks/StatsStrip/Component'

export const blockComponents: Record<string, React.ComponentType<any>> = {
  heroEditorial: HeroEditorialBlock,
  statsStrip: StatsStripBlock,
  featureGrid: FeatureGridBlock,
  featuredCourses: FeaturedCoursesBlock,
  categoriesExplore: CategoriesExploreBlock,
  latestArticles: LatestArticlesBlock,
  faq: FaqBlock,
  ctaBand: CtaBandBlock,
  articlesArchive: ArticlesArchiveBlock,
  coursesCatalog: CoursesCatalogBlock,
  courseDetail: CourseDetailBlock,
}

export type LayoutBlock = { blockType: string; id?: string | null; [key: string]: unknown }

/**
 * Blocos que buscam dados no servidor (getPayload) — não podem renderizar no
 * client. No live preview eles são pré-renderizados no servidor e injetados como
 * slots; só atualizam ao salvar (via RefreshRouteOnSave).
 */
export const SERVER_DATA_BLOCKS = new Set<string>([
  'featuredCourses',
  'categoriesExplore',
  'latestArticles',
  'articlesArchive',
  'coursesCatalog',
  'courseDetail',
])

export async function RenderBlocks({ blocks }: { blocks?: LayoutBlock[] | null }) {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id ?? i} {...block} />
      })}
    </Fragment>
  )
}
