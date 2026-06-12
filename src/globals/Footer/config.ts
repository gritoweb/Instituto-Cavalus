import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Rodapé',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
      defaultValue:
        'Vitrine de cursos do universo equestre brasileiro, do Instituto Cavalus — ligado ao Portal Cavalus, a maior comunidade equestre do país.',
    },
    {
      name: 'navTitle',
      type: 'text',
      label: 'Título da coluna de navegação',
      defaultValue: 'Navegação',
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Links de navegação',
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
      name: 'contact',
      type: 'group',
      label: 'Contato',
      fields: [
        { name: 'email', type: 'text', label: 'E-mail' },
        { name: 'phone', type: 'text', label: 'Telefone' },
        { name: 'location', type: 'text', label: 'Cidade/UF' },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Redes sociais',
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Plataforma',
              required: true,
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Facebook', value: 'facebook' },
              ],
              admin: { width: '40%' },
            },
            { name: 'href', type: 'text', label: 'Link', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      defaultValue: '© 2026 Instituto Cavalus. Todos os direitos reservados.',
    },
    {
      name: 'note',
      type: 'text',
      label: 'Nota (direita)',
      defaultValue: 'Parte do Portal Cavalus',
    },
  ],
}
