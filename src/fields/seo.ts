import type { Field } from 'payload'

/**
 * Bloco reutilizável de campos SEO. Adicione `seoFields` ao array de fields
 * de qualquer collection para habilitar metadata customizada por documento.
 *
 * Uso:
 *   import { seoFields } from '@/fields/seo'
 *   fields: [...seoFields, ...outrosCampos]
 *
 * Aparece na sidebar como aba "SEO" — fica fora da área principal de edição.
 */
export const seoFields: Field[] = [
  {
    type: 'collapsible',
    label: '🔎 SEO (Otimização para buscadores)',
    admin: {
      initCollapsed: true,
      description:
        'Personalize como esta página aparece no Google e quando compartilhada em redes sociais. Se deixar em branco, valores serão gerados automaticamente.',
    },
    fields: [
      {
        name: 'seo',
        type: 'group',
        label: false,
        fields: [
          {
            name: 'metaTitle',
            label: 'Título para Google (Meta Title)',
            type: 'text',
            maxLength: 70,
            admin: {
              description:
                'Título mostrado nos resultados do Google. Máx 70 caracteres. Se vazio, usa o título do conteúdo.',
            },
          },
          {
            name: 'metaDescription',
            label: 'Descrição para Google (Meta Description)',
            type: 'textarea',
            maxLength: 200,
            admin: {
              description:
                'Resumo de 1-2 frases mostrado abaixo do título no Google. Máx 200 caracteres. Se vazio, gerado automaticamente do conteúdo.',
            },
          },
          {
            name: 'ogImage',
            label: 'Imagem para redes sociais (Open Graph)',
            type: 'upload',
            relationTo: 'media',
            admin: {
              description:
                'Imagem mostrada quando o link é compartilhado no WhatsApp, Facebook, Twitter etc. Recomendado: 1200×630px. Se vazio, usa a imagem de capa.',
            },
          },
          {
            name: 'noIndex',
            label: 'Ocultar do Google (não indexar)',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              description:
                'Marque para impedir que esta página apareça em buscadores. Útil para páginas de testes/rascunhos.',
            },
          },
        ],
      },
    ],
  },
]
