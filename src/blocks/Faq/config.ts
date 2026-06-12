import type { Block } from 'payload'

export const Faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Eyebrow', defaultValue: 'Tire suas dúvidas' },
    { name: 'title', type: 'text', label: 'Título', required: true, defaultValue: 'Perguntas frequentes' },
    {
      name: 'items',
      type: 'array',
      label: 'Perguntas',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', label: 'Pergunta', required: true },
        { name: 'answer', type: 'textarea', label: 'Resposta', required: true },
        { name: 'open', type: 'checkbox', label: 'Aberta por padrão', defaultValue: false },
      ],
    },
  ],
}
