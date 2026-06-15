import type { CollectionConfig } from 'payload'
import { seoFields } from '../fields/seo'
import { pageBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    group: 'Construtor de Páginas',
    description:
      '🧱 Crie páginas novas montando o conteúdo com blocos prontos. Para aparecer no site, mude o Status para "Publicado" e adicione a página em um menu (Navegação).',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      required: true,
      admin: {
        description: 'Título da página (aparece no navegador e no Google).',
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
          'Endereço da página. Deixe em branco — será gerado automaticamente a partir do título. Ex: "sobre-nos" gera /sobre-nos',
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
      name: 'layout',
      label: 'Conteúdo da página',
      type: 'blocks',
      minRows: 1,
      blocks: pageBlocks,
      admin: {
        description:
          'Monte a página adicionando blocos. Clique em "+ Adicionar Bloco" para escolher um tipo, e arraste pelo ícone ⠿ para reordenar.',
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
        description: 'Mude para "Publicado" quando a página estiver pronta para o público.',
      },
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
    ...seoFields,
  ],
}
