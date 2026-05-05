import type { CollectionConfig } from 'payload'

export const Apoiadores: CollectionConfig = {
  slug: 'apoiadores',
  labels: { singular: 'Apoiador', plural: 'Apoiadores' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'categoria'],
    group: 'Conteúdo',
    description:
      '🤝 Empresas, instituições e parceiros que apoiam o projeto. Logos aparecem na home, em "Nesta Edição" e na página "Apoiadores".',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nome',
      label: 'Nome do apoiador',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome da empresa ou instituição. Aparece como tooltip ao passar o mouse no logo.',
      },
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Logomarca em PNG transparente, fundo branco ou SVG. Mínimo 300px de largura.',
      },
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'select',
      required: true,
      options: [
        { label: '🏛️ Lei de Incentivo', value: 'lei_incentivo' },
        { label: '⭐ Patrocinador', value: 'patrocinador' },
        { label: '🤝 Apoiador', value: 'apoiador' },
        { label: '🔗 Parceiro', value: 'parceiro' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Categoria do apoio. Define em qual seção da página de apoiadores o logo será agrupado.',
      },
    },
    {
      name: 'edicoes',
      label: 'Edições apoiadas',
      type: 'relationship',
      relationTo: 'edicoes',
      hasMany: true,
      admin: {
        description: 'Selecione todas as edições onde este apoiador participou.',
      },
    },
    {
      name: 'website',
      label: 'Website (opcional)',
      type: 'text',
      admin: {
        description: 'URL completa (https://...). O logo vira link clicável.',
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
