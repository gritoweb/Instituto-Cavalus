import type { CollectionConfig } from 'payload'

import { selectableIcons } from '../components/ui/Icon'
import { slugFrom } from '../utilities/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoria',
    plural: 'Categorias',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Artigos',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Gerado automaticamente a partir do nome se deixado em branco.',
      },
      hooks: {
        beforeValidate: [slugFrom('name')],
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Ícone (grid de áreas)',
      options: selectableIcons.map((value) => ({ label: value, value })),
      admin: {
        description: 'Usado nos cards de "Explore por área".',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'coverColorFrom',
          type: 'text',
          label: 'Cor da capa (início)',
          defaultValue: '#314a2a',
          admin: {
            description: 'HEX do gradiente da capa quando o artigo não tem imagem.',
            width: '50%',
          },
        },
        {
          name: 'coverColorTo',
          type: 'text',
          label: 'Cor da capa (fim)',
          defaultValue: '#1a2f1d',
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
