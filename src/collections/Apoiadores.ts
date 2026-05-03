import type { CollectionConfig } from 'payload'

export const Apoiadores: CollectionConfig = {
  slug: 'apoiadores',
  labels: { singular: 'Apoiador', plural: 'Apoiadores' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'categoria'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Lei de Incentivo', value: 'lei_incentivo' },
        { label: 'Patrocinador', value: 'patrocinador' },
        { label: 'Apoiador', value: 'apoiador' },
        { label: 'Parceiro', value: 'parceiro' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'edicoes',
      label: 'Edições apoiadas',
      type: 'relationship',
      relationTo: 'edicoes',
      hasMany: true,
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
  ],
}
