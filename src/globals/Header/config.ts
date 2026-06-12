import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Cabeçalho',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Itens do menu',
      maxRows: 8,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Rótulo', required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', label: 'Link', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Botão de destaque',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Texto',
              defaultValue: 'Ver cursos',
              admin: { width: '50%' },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Link',
              defaultValue: '/cursos',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
