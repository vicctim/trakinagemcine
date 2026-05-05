import type { CollectionConfig } from 'payload'
import { seoFields } from '../fields/seo'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Quentinha', plural: 'Quentinhas' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    group: 'Conteúdo',
    description:
      '📰 Notícias, bastidores e novidades do projeto. Para aparecer no site, mude o Status para "Publicado".',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      admin: {
        description: 'Título principal da notícia (aparece em listagens, no topo da página e no Google).',
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
        description:
          'Endereço da página. Deixe em branco — será gerado automaticamente a partir do título. Ex: "minha-noticia" gera /quentinhas/minha-noticia',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
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
      name: 'content',
      label: 'Conteúdo',
      type: 'richText',
      required: true,
      admin: {
        description: 'Texto completo da notícia. Use cabeçalhos, negrito, listas e imagens para deixar mais legível.',
      },
    },
    {
      name: 'coverImage',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Imagem principal da notícia (recomendado: 1200×630px). Aparece em listagens, no topo do post e ao compartilhar nas redes sociais.',
      },
    },
    {
      name: 'pressImages',
      label: 'Imagens para imprensa (opcional)',
      type: 'array',
      admin: {
        description: 'Imagens adicionais em alta resolução para download por jornalistas/imprensa.',
      },
      fields: [
        {
          name: 'image',
          label: 'Imagem',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      label: 'Tags (palavras-chave)',
      type: 'array',
      admin: {
        description: 'Palavras-chave para categorizar a notícia. Ex: "edição 2026", "premiação", "bastidores".',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Data de publicação',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Data exibida no site. Pode ser futura para agendar.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: '📝 Rascunho (não aparece no site)', value: 'draft' },
        { label: '✅ Publicado (visível no site)', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Mude para "Publicado" quando estiver pronto para o conteúdo aparecer no site.',
      },
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
    ...seoFields,
    // Preparação Fase 2 (Multi-Tenant)
    // { name: 'tenantId', type: 'text', admin: { hidden: true } },
  ],
}
