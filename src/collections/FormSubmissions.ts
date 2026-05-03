import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Mensagem de Contato', plural: 'Mensagens de Contato' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'email', 'cidade', 'estado', 'createdAt'],
    group: 'CRM',
    description: 'Mensagens recebidas via formulário de contato do site.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // public — submitted by website visitors
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'empresa',
      label: 'Empresa / Instituição',
      type: 'text',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      required: true,
    },
    {
      name: 'telefone',
      label: 'Telefone',
      type: 'text',
    },
    {
      name: 'mensagem',
      label: 'Mensagem',
      type: 'textarea',
      required: true,
    },
    // ── Geolocation sidebar (IPDSA pattern) ──────────────────────────────────
    {
      name: 'ipOrigem',
      label: 'IP de origem',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'cidade',
      label: 'Cidade',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'pais',
      label: 'País',
      type: 'text',
      defaultValue: 'Brasil',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  timestamps: true,
}
