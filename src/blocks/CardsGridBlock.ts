import type { Block } from 'payload'

export const CardsGridBlock: Block = {
  slug: 'cardsGrid',
  labels: {
    singular: 'Grade de Cards',
    plural: 'Grades de Cards',
  },
  fields: [
    {
      name: 'label',
      label: 'Selo (opcional)',
      type: 'text',
      admin: {
        description: 'Texto pequeno em destaque acima do título da seção.',
      },
    },
    {
      name: 'title',
      label: 'Título da seção (opcional)',
      type: 'text',
      admin: {
        description: 'Título exibido acima dos cards. Deixe em branco para não exibir.',
      },
    },
    {
      name: 'subtitle',
      label: 'Subtítulo (opcional)',
      type: 'textarea',
      admin: {
        description: 'Texto menor abaixo do título da seção.',
      },
    },
    {
      name: 'variant',
      label: 'Estilo dos cards',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Padrão', value: 'default' },
        { label: 'Filme', value: 'film' },
        { label: 'Edição', value: 'edition' },
      ],
      admin: {
        description: 'Estilo visual aplicado a todos os cards desta grade.',
      },
    },
    {
      name: 'items',
      label: 'Cards',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Adicione os cards que aparecerão nesta seção, em ordem.',
      },
      fields: [
        {
          name: 'title',
          label: 'Título',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          label: 'Subtítulo (opcional)',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Descrição (opcional)',
          type: 'textarea',
        },
        {
          name: 'image',
          label: 'Imagem (opcional)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'tag',
          label: 'Etiqueta (opcional)',
          type: 'text',
          admin: {
            description: 'Pequena etiqueta exibida no card. Ex: "Novo", "Premiado".',
          },
        },
        {
          name: 'date',
          label: 'Data (opcional)',
          type: 'text',
          admin: {
            description: 'Texto de data exibido no card. Ex: "Maio de 2026".',
          },
        },
        {
          name: 'href',
          label: 'Link (opcional)',
          type: 'text',
          admin: {
            description: 'Para onde o card leva ao ser clicado. Ex: /quentinhas/minha-noticia',
          },
        },
      ],
    },
  ],
}
