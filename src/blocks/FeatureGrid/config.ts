import type { Block } from 'payload'

import { selectableIcons } from '../../components/ui/Icon'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Grade de Diferenciais', plural: 'Grades de Diferenciais' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Diferenciais' },
    { name: 'title', type: 'text', label: 'Título', required: true },
    { name: 'lede', type: 'textarea', label: 'Texto de apoio' },
    {
      name: 'features',
      type: 'array',
      label: 'Diferenciais',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Ícone',
          required: true,
          defaultValue: 'book',
          options: selectableIcons.map((value) => ({ label: value, value })),
        },
        { name: 'title', type: 'text', label: 'Título', required: true },
        { name: 'description', type: 'textarea', label: 'Descrição', required: true },
      ],
    },
  ],
}
