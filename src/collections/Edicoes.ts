import type { CollectionConfig } from 'payload'
import { seoFields } from '../fields/seo'

export const Edicoes: CollectionConfig = {
  slug: 'edicoes',
  labels: { singular: 'Edição', plural: 'Edições' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ano', 'status'],
    group: 'Conteúdo',
    description:
      '🗓️ Cada temporada do projeto é uma "Edição". Apenas UMA edição pode estar Ativa por vez (mostrada em "Nesta Edição"). As demais ficam em "Arquivada" e aparecem na Timeline.',
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
      admin: {
        description: 'Nome da edição/temporada. Ex: "Trakinagem Cine 2026 — Belo Horizonte".',
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
        description: 'Será gerado automaticamente. Aparece em /timeline/[slug].',
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
        description: 'Ano de realização da edição.',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'ativa',
      options: [
        { label: '🟢 Ativa (exibida em "Nesta Edição")', value: 'ativa' },
        { label: '📦 Arquivada (aparece na Timeline)', value: 'arquivada' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Ao marcar uma edição como Ativa, as outras ativas serão automaticamente arquivadas.',
      },
    },
    {
      name: 'resumo',
      label: 'Resumo / Descrição',
      type: 'richText',
      required: true,
      admin: {
        description: 'Texto que descreve a edição. Aparece nas páginas "Nesta Edição" e Timeline.',
      },
    },
    {
      name: 'imagemCapa',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Imagem em destaque da edição (recomendado: 1200×630px ou maior).',
      },
    },
    {
      name: 'fotos',
      label: 'Galeria de fotos',
      type: 'array',
      admin: {
        description: 'Fotos dos bastidores, oficinas, eventos da edição. Aparecem em galeria.',
      },
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
      admin: {
        description: 'Vídeos relacionados à edição: trailers, making-of, eventos.',
      },
      fields: [
        {
          name: 'url',
          label: 'URL do YouTube',
          type: 'text',
          required: true,
          admin: {
            description: 'Cole o link completo do YouTube (ex: https://youtu.be/ABC123).',
          },
        },
      ],
    },
    {
      name: 'parceirosInstitucionais',
      label: 'Parceiros institucionais',
      type: 'array',
      admin: {
        description: 'Instituições parceiras citadas (sem logo). Para apoiadores com logo, use o campo abaixo.',
      },
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
      admin: {
        description:
          'Selecione os apoiadores desta edição. Para criar um novo, vá em "Apoiadores" no menu.',
      },
    },
    {
      name: 'logosRodape',
      label: '🏷️ Logos de Rodapé',
      type: 'group',
      admin: {
        description:
          'Logos exibidas no rodapé do site. A edição mais recente define o rodapé global. Em páginas de edição específica, exibe as logos daquela edição.',
      },
      fields: [
        {
          name: 'tipoExibicao',
          label: 'Tipo de exibição',
          type: 'select',
          defaultValue: 'imagem_unica',
          options: [
            {
              label: '🖼️ Imagem única (todas as logos agrupadas em uma imagem)',
              value: 'imagem_unica',
            },
            {
              label: '📋 Logos individuais (cada logo separada com link)',
              value: 'individual',
            },
          ],
          admin: {
            description:
              'Escolha se vai enviar uma imagem única com todas as logos ou cadastrar cada logo separadamente.',
          },
        },
        {
          name: 'imagemUnica',
          label: 'Imagem com todas as logos',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Envie uma imagem (PNG transparente recomendado) com todas as logos já montadas. Recomendado: largura mínima 1200px.',
            condition: (_data: any, siblingData: any) =>
              siblingData?.tipoExibicao === 'imagem_unica',
          },
        },
        {
          name: 'logosIndividuais',
          label: 'Logos individuais',
          type: 'array',
          admin: {
            description: 'Adicione cada logo de patrocinador/apoiador separadamente.',
            condition: (_data: any, siblingData: any) =>
              siblingData?.tipoExibicao === 'individual',
          },
          fields: [
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Logomarca em PNG transparente ou SVG. Mínimo 200px de largura.',
              },
            },
            {
              name: 'nome',
              label: 'Nome do patrocinador/apoiador',
              type: 'text',
              required: true,
              admin: {
                description: 'Aparece como tooltip ao passar o mouse na logo.',
              },
            },
            {
              name: 'link',
              label: 'Link (opcional)',
              type: 'text',
              admin: {
                description: 'URL do site do patrocinador (https://...). A logo vira link clicável.',
              },
            },
          ],
        },
      ],
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
