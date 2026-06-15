import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Vídeo do YouTube',
    plural: 'Vídeos do YouTube',
  },
  fields: [
    {
      name: 'title',
      label: 'Título do vídeo (opcional)',
      type: 'text',
      admin: {
        description: 'Exibido como legenda/título do vídeo.',
      },
    },
    {
      name: 'url',
      label: 'Link do YouTube',
      type: 'text',
      required: true,
      admin: {
        description: 'Cole o link completo do vídeo no YouTube. Ex: https://www.youtube.com/watch?v=XXXXXXXXXXX',
      },
    },
  ],
}
