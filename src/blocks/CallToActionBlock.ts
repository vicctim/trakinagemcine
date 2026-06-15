import type { Block } from 'payload'

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  labels: {
    singular: 'Botão de Ação (CTA)',
    plural: 'Botões de Ação (CTA)',
  },
  fields: [
    {
      name: 'text',
      label: 'Texto do botão',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex: "Quero participar".',
      },
    },
    {
      name: 'href',
      label: 'Link',
      type: 'text',
      required: true,
      admin: {
        description: 'Para onde o botão leva. Ex: /bora-filmar ou https://exemplo.com',
      },
    },
    {
      name: 'variant',
      label: 'Estilo',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Destaque (preenchido)', value: 'primary' },
        { label: 'Contorno', value: 'secondary' },
        { label: 'Discreto', value: 'ghost' },
      ],
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
    },
    {
      name: 'externo',
      label: 'Abrir em nova aba (link externo)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Marque se o link aponta para outro site.',
      },
    },
  ],
}
