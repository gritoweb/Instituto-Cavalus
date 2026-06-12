import type { Block } from 'payload'

export const CtaBand: Block = {
  slug: 'ctaBand',
  labels: { singular: 'Faixa de CTA', plural: 'Faixas de CTA' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Hora de começar' },
    { name: 'title', type: 'text', label: 'Título', required: true },
    { name: 'text', type: 'textarea', label: 'Texto' },
    {
      name: 'actions',
      type: 'array',
      label: 'Botões',
      maxRows: 2,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Texto', required: true, admin: { width: '40%' } },
            { name: 'href', type: 'text', label: 'Link', required: true, admin: { width: '35%' } },
            {
              name: 'variant',
              type: 'select',
              label: 'Estilo',
              defaultValue: 'white',
              options: [
                { label: 'Branco', value: 'white' },
                { label: 'Contorno branco', value: 'outline-white' },
              ],
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
  ],
}
