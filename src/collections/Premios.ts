import type { CollectionConfig } from 'payload'

export const Premios: CollectionConfig = {
  slug: 'premios',
  labels: { singular: 'Prêmio', plural: 'Prêmios' },
  admin: {
    useAsTitle: 'nomeDoFestival',
    defaultColumns: ['nomeDoFestival', 'categoria', 'resultado', 'anoDoEvento'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nomeDoFestival',
      label: 'Nome do Festival',
      type: 'text',
      required: true,
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'text',
      required: true,
    },
    {
      name: 'resultado',
      label: 'Resultado',
      type: 'select',
      required: true,
      options: [
        { label: 'Premiado', value: 'premiado' },
        { label: 'Selecionado', value: 'selecionado' },
      ],
    },
    {
      name: 'anoDoEvento',
      label: 'Ano do evento',
      type: 'number',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'filme',
      label: 'Filme',
      type: 'relationship',
      relationTo: 'filmes',
      admin: { position: 'sidebar' },
    },
    {
      name: 'logoDoFestival',
      label: 'Logo do festival',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
  ],
}
