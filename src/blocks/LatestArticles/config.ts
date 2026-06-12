import type { Block } from 'payload'

export const LatestArticles: Block = {
  slug: 'latestArticles',
  labels: { singular: 'Últimos Artigos', plural: 'Últimos Artigos' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Conhecimento equestre' },
    { name: 'title', type: 'text', label: 'Título', required: true, defaultValue: 'Do nosso blog' },
    {
      type: 'row',
      fields: [
        { name: 'linkLabel', type: 'text', label: 'Texto do link', defaultValue: 'Ver todos', admin: { width: '50%' } },
        { name: 'linkHref', type: 'text', label: 'Link', defaultValue: '/artigos', admin: { width: '50%' } },
      ],
    },
    { name: 'limit', type: 'number', label: 'Máximo de artigos', defaultValue: 3 },
  ],
}
