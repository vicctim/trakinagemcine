import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Galeria de Fotos',
    plural: 'Galerias de Fotos',
  },
  fields: [
    {
      name: 'title',
      label: 'Título da seção (opcional)',
      type: 'text',
      admin: {
        description: 'Título exibido acima da galeria. Deixe em branco para não exibir.',
      },
    },
    {
      name: 'images',
      label: 'Fotos',
      type: 'array',
      minRows: 1,
      admin: {
        description:
          'Adicione as fotos da galeria. O visitante pode clicar para ver em tela cheia.',
      },
      fields: [
        {
          name: 'image',
          label: 'Foto',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
