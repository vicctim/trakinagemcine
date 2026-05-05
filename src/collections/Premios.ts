import type { CollectionConfig } from 'payload'

export const Premios: CollectionConfig = {
  slug: 'premios',
  labels: { singular: 'Prêmio', plural: 'Prêmios' },
  admin: {
    useAsTitle: 'nomeDoFestival',
    defaultColumns: ['nomeDoFestival', 'categoria', 'resultado', 'anoDoEvento'],
    group: 'Conteúdo',
    description:
      '🏆 Prêmios e seleções recebidos pelos filmes em festivais. Cada prêmio é vinculado a um filme.',
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
      admin: {
        description: 'Nome oficial do festival. Ex: "Festival de Brasília do Cinema Brasileiro".',
      },
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'text',
      required: true,
      admin: {
        description: 'Categoria do prêmio. Ex: "Melhor Curta-Metragem", "Mostra Competitiva", "Júri Popular".',
      },
    },
    {
      name: 'resultado',
      label: 'Resultado',
      type: 'select',
      required: true,
      options: [
        { label: '🏆 Premiado', value: 'premiado' },
        { label: '🎯 Selecionado', value: 'selecionado' },
      ],
      admin: {
        description: '"Premiado" = ganhou. "Selecionado" = participou da mostra/competição.',
      },
    },
    {
      name: 'anoDoEvento',
      label: 'Ano do evento',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Ano em que o festival ocorreu.',
      },
    },
    {
      name: 'filme',
      label: 'Filme premiado',
      type: 'relationship',
      relationTo: 'filmes',
      admin: {
        position: 'sidebar',
        description: 'Selecione o filme que recebeu o prêmio/seleção.',
      },
    },
    {
      name: 'logoDoFestival',
      label: 'Logo do festival (opcional)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo do festival para destaque visual. PNG com fundo transparente recomendado.',
      },
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
  ],
}
