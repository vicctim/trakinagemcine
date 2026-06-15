import type { Block } from 'payload'

export const LogosBlock: Block = {
  slug: 'logos',
  labels: {
    singular: 'Barra de Logos',
    plural: 'Barras de Logos',
  },
  fields: [
    {
      name: 'label',
      label: 'Texto acima das logos (opcional)',
      type: 'text',
      admin: {
        description: 'Ex: "Apoio e Realização".',
      },
    },
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
        condition: (_data, siblingData) => siblingData?.tipoExibicao === 'imagem_unica',
      },
    },
    {
      name: 'logosIndividuais',
      label: 'Logos individuais',
      type: 'array',
      admin: {
        description: 'Adicione cada logo de patrocinador/apoiador separadamente.',
        condition: (_data, siblingData) => siblingData?.tipoExibicao === 'individual',
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
}
