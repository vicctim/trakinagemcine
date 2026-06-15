import type { Block } from 'payload'

export const ButtonsBlock: Block = {
  slug: 'buttons',
  labels: {
    singular: 'Grupo de Botões',
    plural: 'Grupos de Botões',
  },
  fields: [
    {
      name: 'title',
      label: 'Título da seção (opcional)',
      type: 'text',
      admin: {
        description: 'Título exibido acima dos botões. Deixe em branco para não exibir.',
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
    },
    {
      name: 'buttons',
      label: 'Botões',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Adicione os botões que aparecerão nesta seção, em ordem.',
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
          name: 'externo',
          label: 'Abrir em nova aba (link externo)',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Marque se o link aponta para outro site.',
          },
        },
      ],
    },
  ],
}
