import type { GlobalConfig } from 'payload'

export const SmtpConfig: GlobalConfig = {
  slug: 'smtp-config',
  label: 'Configurações de E-mail (SMTP)',
  admin: {
    group: 'Configurações',
    description: 'Configure o servidor de e-mail para envio de notificações automáticas do formulário de contato.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'provider',
          label: 'Provedor',
          type: 'select',
          defaultValue: 'resend',
          required: true,
          options: [
            { label: 'Resend (Recomendado)', value: 'resend' },
            { label: 'Amazon SES', value: 'ses' },
            { label: 'SendGrid', value: 'sendgrid' },
            { label: 'SMTP Genérico', value: 'smtp' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'enabled',
          label: 'Notificações ativas',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%', description: 'Enviar e-mail quando formulário for submetido' },
        },
      ],
    },
    {
      name: 'apiKey',
      label: 'API Key / Senha',
      type: 'text',
      admin: {
        description: 'Para Resend: re_xxxx | Para SES/SendGrid: sua chave de API',
        placeholder: 're_xxxxxxxxxxxxxxxx',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fromEmail',
          label: 'E-mail de Origem (From)',
          type: 'email',
          defaultValue: 'noreply@trakinagemcine.com.br',
          admin: { width: '50%' },
        },
        {
          name: 'fromName',
          label: 'Nome de Origem',
          type: 'text',
          defaultValue: 'Trakinagem Cine',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'notifyEmail',
      label: 'E-mail de Destino (quem recebe)',
      type: 'email',
      defaultValue: 'contato@trakinagemcine.com.br',
      admin: {
        description: 'Endereço que receberá os alertas de novas mensagens de contato',
      },
    },
    {
      label: 'Configurações SMTP Avançadas',
      type: 'collapsible',
      admin: {
        description: 'Apenas para provedor SMTP Genérico',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'smtpHost',
              label: 'Host',
              type: 'text',
              admin: { width: '60%', placeholder: 'smtp.example.com' },
            },
            {
              name: 'smtpPort',
              label: 'Porta',
              type: 'number',
              defaultValue: 587,
              admin: { width: '40%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'smtpUser',
              label: 'Usuário SMTP',
              type: 'text',
              admin: { width: '50%' },
            },
            {
              name: 'smtpTls',
              label: 'Usar TLS/SSL',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'instructions',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/SmtpInstructions#SmtpInstructions',
        },
      },
    },
  ],
}
