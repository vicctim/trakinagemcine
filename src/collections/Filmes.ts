import type { CollectionConfig } from 'payload'

export const Filmes: CollectionConfig = {
  slug: 'filmes',
  labels: { singular: 'Filme', plural: 'Filmes' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ano', 'edicao'],
    group: 'Conteúdo',
    description:
      '🎬 Curtas-metragens produzidos pelos jovens. Cada filme deve estar vinculado a uma Edição/Temporada.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
      admin: {
        description: 'Título do curta-metragem.',
      },
    },
    {
      name: 'slug',
      label: 'URL amigável (slug)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Será gerado automaticamente a partir do título. Aparece em /nossos-filmes/[slug].',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.titulo) {
              return data.titulo
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'sinopse',
      label: 'Sinopse',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Resumo do filme em 2-4 parágrafos. Aparece na página do filme e na descrição para Google/redes sociais.',
      },
    },
    {
      name: 'capa',
      label: 'Poster / Capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Imagem principal/poster do filme (recomendado: 1200×630px ou formato vertical 800×1200).',
      },
    },
    {
      name: 'youtubeUrl',
      label: 'Link do YouTube',
      type: 'text',
      required: true,
      admin: {
        description:
          'Cole o link completo do vídeo (ex: https://www.youtube.com/watch?v=ABC123 ou https://youtu.be/ABC123).',
      },
    },
    {
      name: 'edicao',
      label: 'Edição / Temporada',
      type: 'relationship',
      relationTo: 'edicoes',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'A qual temporada/edição este filme pertence?',
      },
    },
    {
      name: 'ano',
      label: 'Ano de produção',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Ano em que o filme foi produzido.',
      },
    },
    {
      name: 'duracao',
      label: 'Duração',
      type: 'text',
      admin: {
        placeholder: 'Ex: 12 min',
        description: 'Duração total do filme. Use formato livre (ex: "12 min", "1h 30min").',
      },
    },
    {
      name: 'premios',
      label: 'Prêmios conquistados (opcional)',
      type: 'relationship',
      relationTo: 'premios',
      hasMany: true,
      admin: {
        description: 'Selecione prêmios já cadastrados. Para criar um novo, vá em "Prêmios" no menu lateral.',
      },
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
    // Preparação Fase 2 (Multi-Tenant)
    // { name: 'tenantId', type: 'text', admin: { hidden: true } },
  ],
}
