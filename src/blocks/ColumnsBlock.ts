import type { Block } from 'payload'

export const ColumnsBlock: Block = {
  slug: 'columns',
  labels: {
    singular: 'Colunas',
    plural: 'Colunas',
  },
  fields: [
    {
      name: 'title',
      label: 'Título da seção (opcional)',
      type: 'text',
      admin: {
        description: 'Título exibido acima das colunas. Deixe em branco para não exibir.',
      },
    },
    {
      name: 'columns',
      label: 'Colunas',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      admin: {
        description: 'Adicione de 2 a 4 colunas, lado a lado (em telas pequenas, ficam uma abaixo da outra).',
      },
      fields: [
        {
          name: 'image',
          label: 'Imagem (opcional)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          label: 'Título (opcional)',
          type: 'text',
        },
        {
          name: 'content',
          label: 'Conteúdo',
          type: 'richText',
          admin: {
            description: 'Texto livre desta coluna. Use títulos, negrito, itálico, listas e links.',
          },
        },
      ],
    },
  ],
}
