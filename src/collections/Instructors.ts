import type { CollectionConfig } from 'payload'

export const Instructors: CollectionConfig = {
  slug: 'instructors',
  labels: {
    singular: 'Instrutor',
    plural: 'Instrutores',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    group: 'Cursos',
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
      name: 'role',
      type: 'text',
      label: 'Cargo',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
    },
  ],
}
