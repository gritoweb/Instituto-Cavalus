import type { Block } from 'payload'

export const StatsStrip: Block = {
  slug: 'statsStrip',
  labels: { singular: 'Faixa de Números', plural: 'Faixas de Números' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Números',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'prefix',
              type: 'text',
              label: 'Prefixo (verde)',
              admin: { width: '20%', placeholder: '+' },
            },
            { name: 'value', type: 'text', label: 'Valor', required: true, admin: { width: '30%', placeholder: '10' } },
            {
              name: 'caption',
              type: 'text',
              label: 'Legenda',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
