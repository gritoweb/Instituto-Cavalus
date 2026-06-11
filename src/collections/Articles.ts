import type { CollectionConfig } from 'payload'

import { slugFrom } from '../utilities/slug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Artigo',
    plural: 'Artigos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Artigos',
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
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumo',
      required: true,
      admin: {
        description: 'Texto curto exibido no card (2 a 3 linhas).',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Capa',
      admin: {
        description: 'Opcional. Sem imagem, o card usa o gradiente da categoria.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoria',
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
        description: 'Gerado automaticamente a partir do título se deixado em branco.',
      },
      hooks: {
        beforeValidate: [slugFrom('title')],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de publicação',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' },
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Tempo de leitura (min)',
      min: 1,
      admin: {
        position: 'sidebar',
        description: 'Minutos estimados de leitura.',
      },
    },
  ],
}
