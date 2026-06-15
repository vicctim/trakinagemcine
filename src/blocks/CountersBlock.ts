import type { Block } from 'payload'

export const CountersBlock: Block = {
  slug: 'counters',
  labels: {
    singular: 'Números/Contadores',
    plural: 'Blocos de Números',
  },
  fields: [
    {
      name: 'title',
      label: 'Título da seção (opcional)',
      type: 'text',
      admin: {
        description: 'Título exibido acima dos números. Deixe em branco para não exibir.',
      },
    },
    {
      name: 'items',
      label: 'Números',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Cada item é um número que conta de 0 até o valor definido quando aparece na tela.',
      },
      fields: [
        {
          name: 'end',
          label: 'Valor final',
          type: 'number',
          required: true,
          admin: {
            description: 'Número final do contador. Ex: 1500.',
          },
        },
        {
          name: 'prefix',
          label: 'Prefixo (opcional)',
          type: 'text',
          admin: {
            description: 'Texto antes do número. Ex: "+".',
          },
        },
        {
          name: 'suffix',
          label: 'Sufixo (opcional)',
          type: 'text',
          admin: {
            description: 'Texto depois do número. Ex: "alunos", "%".',
          },
        },
        {
          name: 'label',
          label: 'Legenda',
          type: 'text',
          required: true,
          admin: {
            description: 'Descrição abaixo do número. Ex: "Jovens impactados".',
          },
        },
      ],
    },
  ],
}
