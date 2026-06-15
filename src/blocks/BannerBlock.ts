import type { Block } from 'payload'

export const BannerBlock: Block = {
  slug: 'banner',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  fields: [
    {
      name: 'image',
      label: 'Imagem de fundo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtítulo (opcional)',
      type: 'textarea',
    },
    {
      name: 'overlay',
      label: 'Sombreamento sobre a imagem',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Nenhum', value: 'none' },
        { label: 'Escuro', value: 'dark' },
        { label: 'Gradiente', value: 'gradient' },
      ],
      admin: {
        description: 'Ajuda a manter o texto legível sobre a imagem.',
      },
    },
    {
      name: 'ctaText',
      label: 'Texto do botão (opcional)',
      type: 'text',
      admin: {
        description: 'Deixe em branco para não exibir um botão.',
      },
    },
    {
      name: 'ctaHref',
      label: 'Link do botão (opcional)',
      type: 'text',
      admin: {
        description: 'Para onde o botão leva. Ex: /bora-filmar ou https://exemplo.com',
      },
    },
    {
      name: 'ctaExterno',
      label: 'Abrir em nova aba (link externo)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Marque se o link do botão aponta para outro site.',
      },
    },
  ],
}
