import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Texto',
    plural: 'Textos',
  },
  fields: [
    {
      name: 'content',
      label: 'Conteúdo',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Texto livre. Use títulos, negrito, itálico, listas e links para organizar o conteúdo.',
      },
    },
  ],
}
