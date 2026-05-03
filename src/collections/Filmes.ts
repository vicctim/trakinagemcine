import type { CollectionConfig } from 'payload'

export const Filmes: CollectionConfig = {
  slug: 'filmes',
  labels: { singular: 'Filme', plural: 'Filmes' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ano', 'edicao'],
    group: 'Conteúdo',
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
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
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
    },
    {
      name: 'capa',
      label: 'Poster / Capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'youtubeUrl',
      label: 'Link do YouTube',
      type: 'text',
      required: true,
    },
    {
      name: 'edicao',
      label: 'Edição / Temporada',
      type: 'relationship',
      relationTo: 'edicoes',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'ano',
      label: 'Ano de produção',
      type: 'number',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'duracao',
      label: 'Duração',
      type: 'text',
      admin: {
        placeholder: 'Ex: 12 min',
      },
    },
    {
      name: 'premios',
      label: 'Prêmios',
      type: 'relationship',
      relationTo: 'premios',
      hasMany: true,
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
