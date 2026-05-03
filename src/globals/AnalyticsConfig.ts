import type { GlobalConfig } from 'payload'

export const AnalyticsConfig: GlobalConfig = {
  slug: 'analytics-config',
  label: 'Analytics & Rastreamento',
  admin: {
    group: 'Configurações',
    description: 'Configure scripts de analytics e rastreamento do site.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Google Analytics
    {
      name: 'googleAnalytics',
      label: 'Google Analytics / GA4',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'gaEnabled',
              label: 'Ativar GA4',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '30%' },
            },
            {
              name: 'gaMeasurementId',
              label: 'Measurement ID',
              type: 'text',
              admin: {
                width: '70%',
                placeholder: 'G-XXXXXXXXXX',
                description: 'Ex: G-ABC123DEF4',
                condition: (data) => data?.googleAnalytics?.gaEnabled,
              },
            },
          ],
        },
      ],
    },
    // Meta Pixel
    {
      name: 'metaPixel',
      label: 'Meta Pixel (Facebook)',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pixelEnabled',
              label: 'Ativar Meta Pixel',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '30%' },
            },
            {
              name: 'pixelId',
              label: 'Pixel ID',
              type: 'text',
              admin: {
                width: '70%',
                placeholder: '123456789012345',
                condition: (data) => data?.metaPixel?.pixelEnabled,
              },
            },
          ],
        },
      ],
    },
    // Google Tag Manager
    {
      name: 'tagManager',
      label: 'Google Tag Manager',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'gtmEnabled',
              label: 'Ativar GTM',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '30%' },
            },
            {
              name: 'gtmId',
              label: 'Container ID',
              type: 'text',
              admin: {
                width: '70%',
                placeholder: 'GTM-XXXXXXX',
                condition: (data) => data?.tagManager?.gtmEnabled,
              },
            },
          ],
        },
      ],
    },
    // Custom scripts
    {
      label: 'Scripts Personalizados',
      type: 'collapsible',
      admin: {
        description: 'Para integrar outras ferramentas (Hotjar, ClarityMicrosoft, Plausible, etc.)',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'headScript',
          label: 'Script no <head>',
          type: 'textarea',
          admin: {
            description: 'Inserido antes de </head>. Inclua a tag <script> completa.',
            rows: 5,
          },
        },
        {
          name: 'bodyScript',
          label: 'Script no <body>',
          type: 'textarea',
          admin: {
            description: 'Inserido após <body>. Para noscript do GTM.',
            rows: 5,
          },
        },
      ],
    },
    // Cookie consent
    {
      name: 'cookieConsent',
      label: 'Privacidade & Consentimento (LGPD)',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'bannerEnabled',
              label: 'Mostrar banner de cookies',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'privacyPageUrl',
              label: 'URL da Política de Privacidade',
              type: 'text',
              defaultValue: '/privacidade',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'bannerText',
          label: 'Texto do banner',
          type: 'textarea',
          defaultValue:
            'Usamos cookies para melhorar sua experiência no site. Ao continuar navegando, você concorda com nossa Política de Privacidade.',
          admin: { rows: 3 },
        },
      ],
    },
    // Analytics Widget
    {
      name: 'analyticsWidget',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/AnalyticsWidget#AnalyticsWidget',
        },
      },
    },
  ],
}
