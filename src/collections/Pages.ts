import type { CollectionConfig } from 'payload'

import { ArticlesArchive } from '../blocks/ArticlesArchive/config'
import { CategoriesExplore } from '../blocks/CategoriesExplore/config'
import { CourseDetail } from '../blocks/CourseDetail/config'
import { CoursesCatalog } from '../blocks/CoursesCatalog/config'
import { CtaBand } from '../blocks/CtaBand/config'
import { Faq } from '../blocks/Faq/config'
import { FeatureGrid } from '../blocks/FeatureGrid/config'
import { FeaturedCourses } from '../blocks/FeaturedCourses/config'
import { HeroEditorial } from '../blocks/HeroEditorial/config'
import { LatestArticles } from '../blocks/LatestArticles/config'
import { StatsStrip } from '../blocks/StatsStrip/config'
import { slugFrom } from '../utilities/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Página',
    plural: 'Páginas',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    group: 'Conteúdo',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Use "home" para a página inicial. Gerado a partir do título se vazio.',
      },
      hooks: {
        beforeValidate: [slugFrom('title')],
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Blocos',
      blocks: [
        HeroEditorial,
        StatsStrip,
        FeatureGrid,
        FeaturedCourses,
        CategoriesExplore,
        LatestArticles,
        Faq,
        CtaBand,
        ArticlesArchive,
        CoursesCatalog,
        CourseDetail,
      ],
    },
  ],
}
