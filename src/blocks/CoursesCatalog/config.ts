import type { Block } from 'payload'

export const CoursesCatalog: Block = {
  slug: 'coursesCatalog',
  labels: { singular: 'Catálogo de Cursos', plural: 'Catálogos de Cursos' },
  fields: [
    { name: 'label', type: 'text', label: 'Rótulo do filtro', defaultValue: 'Filtrar por categoria' },
    {
      name: 'searchPlaceholder',
      type: 'text',
      label: 'Placeholder da busca',
      defaultValue: 'Buscar curso por nome ou tema…',
    },
    { name: 'coursesLimit', type: 'number', label: 'Máximo de cursos', defaultValue: 100, min: 1 },
    {
      type: 'row',
      fields: [
        {
          name: 'emptyTitle',
          type: 'text',
          label: 'Estado vazio — título',
          defaultValue: 'Nenhum curso encontrado',
          admin: { width: '50%' },
        },
        {
          name: 'emptyText',
          type: 'text',
          label: 'Estado vazio — texto',
          defaultValue:
            'Não encontramos cursos nessa categoria. Tente outra área ou volte a ver todos.',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
