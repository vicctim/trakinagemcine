import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Imagem',
    plural: 'Imagens',
  },
  fields: [
    {
      name: 'image',
      label: 'Imagem',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      label: 'Legenda (opcional)',
      type: 'text',
      admin: {
        description: 'Texto exibido abaixo da imagem.',
      },
    },
    {
      name: 'alt',
      label: 'Texto alternativo (opcional)',
      type: 'text',
      admin: {
        description: 'Substitui o texto alternativo da imagem, usado para acessibilidade e SEO.',
      },
    },
    {
      name: 'size',
      label: 'Tamanho',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Largura total', value: 'full' },
        { label: 'Médio', value: 'medium' },
        { label: 'Pequeno', value: 'small' },
      ],
      admin: {
        description: 'Define o quão larga a imagem aparece na página.',
      },
    },
    {
      name: 'align',
      label: 'Alinhamento',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Esquerda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Direita', value: 'right' },
      ],
      admin: {
        description: 'Posição da imagem quando o tamanho não é largura total.',
      },
    },
  ],
}
