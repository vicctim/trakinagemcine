import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídias' },
  admin: {
    group: 'Sistema',
    description:
      '🖼️ Biblioteca central de imagens, vídeos e PDFs. Faça upload aqui antes de criar conteúdo — depois é só selecionar a imagem nos campos de cada post/filme.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo (Alt)',
      type: 'text',
      required: true,
      admin: {
        description:
          'Descrição curta da imagem para acessibilidade (ex: "Jovens segurando câmera no set"). Ajuda no SEO e leitores de tela.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        withoutEnlargement: true,
      },
    ],
  },
}
