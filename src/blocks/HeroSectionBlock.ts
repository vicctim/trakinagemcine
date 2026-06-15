import type { Block } from 'payload'

export const HeroSectionBlock: Block = {
  slug: 'heroSection',
  labels: {
    singular: 'Título de Seção',
    plural: 'Títulos de Seção',
  },
  fields: [
    {
      name: 'label',
      label: 'Selo (opcional)',
      type: 'text',
      admin: {
        description: 'Texto pequeno em destaque acima do título. Ex: "Sobre nós".',
      },
    },
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      admin: {
        description: 'Título principal desta seção.',
      },
    },
    {
      name: 'accent',
      label: 'Palavra em destaque (opcional)',
      type: 'text',
      admin: {
        description:
          'Se essa palavra aparecer dentro do título, ela ficará pintada na cor de destaque do site. Ex: título "Cinema transforma vidas" + destaque "transforma".',
      },
    },
    {
      name: 'subtitle',
      label: 'Subtítulo (opcional)',
      type: 'textarea',
      admin: {
        description: 'Texto menor abaixo do título, explicando melhor o assunto.',
      },
    },
    {
      name: 'align',
      label: 'Alinhamento',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
      ],
      admin: {
        description: 'Como o título e o subtítulo ficam alinhados na tela.',
      },
    },
  ],
}
