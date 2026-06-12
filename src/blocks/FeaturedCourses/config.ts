import type { Block } from 'payload'

export const FeaturedCourses: Block = {
  slug: 'featuredCourses',
  labels: { singular: 'Cursos em Destaque', plural: 'Cursos em Destaque' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Catálogo' },
    { name: 'title', type: 'text', label: 'Título', required: true, defaultValue: 'Cursos em destaque' },
    {
      type: 'row',
      fields: [
        { name: 'linkLabel', type: 'text', label: 'Texto do link', defaultValue: 'Ver todos', admin: { width: '50%' } },
        { name: 'linkHref', type: 'text', label: 'Link', defaultValue: '/cursos', admin: { width: '50%' } },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Fonte dos cursos',
      defaultValue: 'featured',
      options: [
        { label: 'Marcados como destaque', value: 'featured' },
        { label: 'Mais recentes', value: 'latest' },
        { label: 'Selecionados manualmente', value: 'manual' },
      ],
    },
    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      label: 'Cursos (seleção manual)',
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Máximo de cursos',
      defaultValue: 8,
      admin: { condition: (_, s) => s?.source !== 'manual' },
    },
    { name: 'alt', type: 'checkbox', label: 'Fundo alternado (cinza)', defaultValue: true },
  ],
}
