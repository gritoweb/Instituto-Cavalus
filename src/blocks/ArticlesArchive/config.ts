import type { Block } from 'payload'

export const ArticlesArchive: Block = {
  slug: 'articlesArchive',
  labels: {
    singular: 'Arquivo de Artigos',
    plural: 'Arquivos de Artigos',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Rótulo do filtro',
      defaultValue: 'Filtrar por categoria',
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      label: 'Placeholder da busca',
      defaultValue: 'Buscar artigos por título ou tema…',
    },
    {
      name: 'articlesLimit',
      type: 'number',
      label: 'Máximo de artigos carregados',
      defaultValue: 12,
      min: 1,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'emptyTitle',
          type: 'text',
          label: 'Estado vazio — título',
          defaultValue: 'Nenhum artigo encontrado',
          admin: { width: '50%' },
        },
        {
          name: 'emptyText',
          type: 'text',
          label: 'Estado vazio — texto',
          defaultValue:
            'Não encontramos artigos nessa categoria. Tente outra área ou volte a ver todos.',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
