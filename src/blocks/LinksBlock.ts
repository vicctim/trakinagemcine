import type { Block } from 'payload'

export const LinksBlock: Block = {
  slug: 'links',
  labels: {
    singular: 'Lista de Links',
    plural: 'Listas de Links',
  },
  fields: [
    {
      name: 'title',
      label: 'Título da seção (opcional)',
      type: 'text',
      admin: {
        description: 'Título exibido acima da lista de links. Deixe em branco para não exibir.',
      },
    },
    {
      name: 'links',
      label: 'Links',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Adicione os links que aparecerão nesta lista, em ordem.',
      },
      fields: [
        {
          name: 'label',
          label: 'Texto do link',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Descrição (opcional)',
          type: 'text',
          admin: {
            description: 'Texto menor exibido junto ao link.',
          },
        },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          required: true,
          admin: {
            description: 'Para onde o link leva. Ex: /quentinhas ou https://exemplo.com',
          },
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
