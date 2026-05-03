import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configurações do Site',
  admin: {
    group: 'Sistema',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      label: 'Nome do site',
      type: 'text',
      defaultValue: 'Trakinagem Cine',
    },
    {
      name: 'siteDescription',
      label: 'Descrição (meta)',
      type: 'textarea',
      defaultValue:
        'Projeto cultural e educativo que ensina produção audiovisual a jovens em situação de vulnerabilidade social.',
    },
    {
      name: 'heroImage',
      label: 'Imagem do Hero (Home)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroTitle',
      label: 'Título do Hero',
      type: 'text',
      defaultValue: 'Cinema transforma vidas',
    },
    {
      name: 'heroSubtitle',
      label: 'Subtítulo do Hero',
      type: 'textarea',
    },
    {
      name: 'socialLinks',
      label: 'Redes Sociais',
      type: 'group',
      fields: [
        { name: 'instagram', label: 'Instagram', type: 'text' },
        { name: 'youtube', label: 'YouTube', type: 'text' },
        { name: 'facebook', label: 'Facebook', type: 'text' },
      ],
    },
    {
      name: 'contactEmail',
      label: 'E-mail de contato',
      type: 'email',
    },
    {
      name: 'contactPhone',
      label: 'Telefone',
      type: 'text',
    },
    {
      name: 'theme',
      label: 'Tema do Site',
      type: 'select',
      defaultValue: 'default',
      admin: {
        position: 'sidebar',
        description: 'Alterna o visual público do site. Não requer rebuild.',
      },
      options: [
        { label: 'Padrão (claro, vermelho e verde)', value: 'default' },
        { label: 'Editorial (escuro, naval, verde)', value: 'editorial' },
      ],
    },
  ],
}
