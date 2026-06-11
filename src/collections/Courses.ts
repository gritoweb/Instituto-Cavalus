import type { CollectionConfig } from 'payload'

import { slugFrom } from '../utilities/slug'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: {
    singular: 'Curso',
    plural: 'Cursos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceNow', '_status'],
    group: 'Cursos',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Card',
          fields: [
            { name: 'title', type: 'text', label: 'Título', required: true },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descrição curta (card)',
              required: true,
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Categorias',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'priceOld',
                  type: 'text',
                  label: 'Preço de (riscado)',
                  admin: { width: '50%', placeholder: 'R$ 397' },
                },
                {
                  name: 'priceNow',
                  type: 'text',
                  label: 'Preço por',
                  required: true,
                  admin: { width: '50%', placeholder: 'R$ 297' },
                },
              ],
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Capa (opcional)',
              admin: { description: 'Sem imagem, usa o gradiente abaixo.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'coverColorFrom',
                  type: 'text',
                  label: 'Gradiente (início)',
                  defaultValue: '#314a2a',
                  admin: { width: '50%' },
                },
                {
                  name: 'coverColorTo',
                  type: 'text',
                  label: 'Gradiente (fim)',
                  defaultValue: '#1a2f1d',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Página do curso',
          fields: [
            { name: 'lede', type: 'textarea', label: 'Chamada (lede)' },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem destacada',
            },
            { name: 'featuredCaption', type: 'text', label: 'Legenda da imagem' },
            { name: 'body', type: 'richText', label: 'Conteúdo' },
            {
              name: 'whatYouLearn',
              type: 'array',
              label: 'O que você vai aprender',
              fields: [
                { name: 'strong', type: 'text', label: 'Destaque' },
                { name: 'text', type: 'textarea', label: 'Texto' },
              ],
            },
            {
              name: 'forWho',
              type: 'array',
              label: 'Para quem é',
              fields: [
                { name: 'strong', type: 'text', label: 'Destaque' },
                { name: 'text', type: 'textarea', label: 'Texto' },
              ],
            },
            {
              name: 'modules',
              type: 'array',
              label: 'Conteúdo programático (módulos)',
              fields: [
                { name: 'title', type: 'text', label: 'Título', required: true },
                { name: 'description', type: 'textarea', label: 'Descrição' },
                { name: 'duration', type: 'text', label: 'Duração', admin: { placeholder: '1h20' } },
              ],
            },
            {
              name: 'bonus',
              type: 'group',
              label: 'Bônus (callout)',
              fields: [
                { name: 'title', type: 'text', label: 'Título' },
                { name: 'text', type: 'textarea', label: 'Texto' },
              ],
            },
            {
              name: 'quote',
              type: 'group',
              label: 'Citação',
              fields: [
                { name: 'text', type: 'textarea', label: 'Frase' },
                { name: 'cite', type: 'text', label: 'Autor' },
              ],
            },
            {
              name: 'instructor',
              type: 'group',
              label: 'Instrutor',
              fields: [
                { name: 'initials', type: 'text', label: 'Iniciais (avatar)' },
                { name: 'name', type: 'text', label: 'Nome' },
                { name: 'role', type: 'text', label: 'Cargo' },
                { name: 'bio', type: 'textarea', label: 'Bio' },
              ],
            },
          ],
        },
        {
          label: 'Sidebar / Compra',
          fields: [
            { name: 'priceInstallment', type: 'text', label: 'Parcelamento', admin: { placeholder: '12× de R$ 29,75' } },
            {
              name: 'details',
              type: 'array',
              label: 'Itens inclusos',
              fields: [
                { name: 'title', type: 'text', label: 'Título', required: true },
                { name: 'sub', type: 'text', label: 'Subtexto' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaLabel',
                  type: 'text',
                  label: 'Texto do botão',
                  defaultValue: 'Fazer matrícula',
                  admin: { width: '50%' },
                },
                {
                  name: 'ctaUrl',
                  type: 'text',
                  label: 'Link de checkout',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Gerado a partir do título se vazio.',
      },
      hooks: {
        beforeValidate: [slugFrom('title')],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destaque na home',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
