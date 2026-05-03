import type { CollectionConfig } from 'payload'

export const Edicoes: CollectionConfig = {
  slug: 'edicoes',
  labels: { singular: 'Edição', plural: 'Edições' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ano', 'status'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (doc.status === 'ativa' && previousDoc?.status !== 'ativa') {
          const { docs: otherActive } = await req.payload.find({
            collection: 'edicoes',
            where: {
              and: [
                { status: { equals: 'ativa' } },
                { id: { not_equals: doc.id } },
              ],
            },
            limit: 100,
            depth: 0,
          })
          for (const ed of otherActive) {
            await req.payload.update({
              collection: 'edicoes',
              id: ed.id,
              data: { status: 'arquivada' },
            })
          }
        }
        return doc
      },
    ],
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
      admin: {
        position: 'sidebar',
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
      name: 'ano',
      label: 'Ano',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'ativa',
      options: [
        { label: 'Ativa', value: 'ativa' },
        { label: 'Arquivada', value: 'arquivada' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Ativa = exibida em "Nesta Edição". Arquivada = aparece na Timeline.',
      },
    },
    {
      name: 'resumo',
      label: 'Resumo',
      type: 'richText',
      required: true,
    },
    {
      name: 'imagemCapa',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'fotos',
      label: 'Galeria de fotos',
      type: 'array',
      fields: [
        {
          name: 'foto',
          label: 'Foto',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'videoLinks',
      label: 'Vídeos (YouTube)',
      type: 'array',
      fields: [
        {
          name: 'url',
          label: 'URL do YouTube',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'parceirosInstitucionais',
      label: 'Parceiros institucionais',
      type: 'array',
      fields: [
        {
          name: 'nome',
          label: 'Nome da instituição',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'apoiadores',
      label: 'Apoiadores desta edição',
      type: 'relationship',
      relationTo: 'apoiadores',
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
