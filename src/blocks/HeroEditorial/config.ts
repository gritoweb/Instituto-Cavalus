import type { Block } from 'payload'

export const HeroEditorial: Block = {
  slug: 'heroEditorial',
  labels: {
    singular: 'Hero Editorial',
    plural: 'Heroes Editoriais',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (texto acima do título)',
      defaultValue: 'Blog do Instituto Cavalus',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'headlineBefore',
          type: 'text',
          label: 'Título — antes da ênfase',
          required: true,
          admin: { width: '40%' },
        },
        {
          name: 'headlineEmphasis',
          type: 'text',
          label: 'Título — trecho em ênfase (itálico)',
          admin: { width: '30%' },
        },
        {
          name: 'headlineAfter',
          type: 'text',
          label: 'Título — depois da ênfase',
          admin: { width: '30%' },
        },
      ],
    },
    {
      name: 'lede',
      type: 'textarea',
      label: 'Texto de apoio (lede)',
    },
    {
      name: 'actions',
      type: 'array',
      label: 'Botões (opcional)',
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
              defaultValue: 'primary',
              options: [
                { label: 'Primário', value: 'primary' },
                { label: 'Contorno', value: 'ghost' },
              ],
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
    {
      name: 'showArt',
      type: 'checkbox',
      label: 'Mostrar arte (cavalo + cartões)',
      defaultValue: true,
    },
    {
      name: 'floatingCards',
      type: 'array',
      label: 'Cartões flutuantes',
      maxRows: 3,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showArt),
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Ícone',
              required: true,
              defaultValue: 'book',
              options: [
                { label: 'Livro', value: 'book' },
                { label: 'Pessoas', value: 'users' },
                { label: 'Compartilhar', value: 'share-2' },
                { label: 'Certificado', value: 'award' },
                { label: 'Celular', value: 'smartphone' },
              ],
              admin: { width: '34%' },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Posição',
              required: true,
              defaultValue: 'top',
              options: [
                { label: 'Topo', value: 'top' },
                { label: 'Meio', value: 'mid' },
                { label: 'Base', value: 'bottom' },
              ],
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', label: 'Título', required: true, admin: { width: '50%' } },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtítulo',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
