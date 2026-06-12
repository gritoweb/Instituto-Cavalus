import type { Block } from 'payload'

export const CourseDetail: Block = {
  slug: 'courseDetail',
  labels: { singular: 'Detalhe do Curso', plural: 'Detalhes do Curso' },
  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      label: 'Curso',
      required: true,
      admin: {
        description: 'Todo o conteúdo é puxado do curso selecionado.',
      },
    },
  ],
}
