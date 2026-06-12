import type { Block } from 'payload'

export const CategoriesExplore: Block = {
  slug: 'categoriesExplore',
  labels: { singular: 'Explorar por Área', plural: 'Explorar por Área' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Áreas de estudo' },
    { name: 'title', type: 'text', label: 'Título', required: true, defaultValue: 'Explore por área' },
    {
      name: 'linkBase',
      type: 'text',
      label: 'Link base dos cards',
      defaultValue: '/cursos',
    },
  ],
}
