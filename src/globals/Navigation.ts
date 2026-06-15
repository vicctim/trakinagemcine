import type { Field, GlobalConfig } from 'payload'

const ROTAS_EXISTENTES =
  'Ex: /quentinhas, /nossos-filmes, /timeline, /nesta-edicao, /premios, /apoiadores, /nossas-inspiracoes, /bora-filmar, /como-filmar, /vamos-juntos, /privacidade'

function linkFields(): Field[] {
  return [
    {
      name: 'tipoLink',
      label: 'Para onde este item leva',
      type: 'select',
      defaultValue: 'rota',
      options: [
        { label: '🧱 Página criada no Construtor de Páginas', value: 'pagina' },
        { label: '🔗 Rota existente do site', value: 'rota' },
        { label: '🌐 Link externo (outro site)', value: 'externo' },
      ],
    },
    {
      name: 'pagina',
      label: 'Página',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_data, siblingData) => siblingData?.tipoLink === 'pagina',
        description: 'Escolha uma página publicada no Construtor de Páginas.',
      },
    },
    {
      name: 'rota',
      label: 'Endereço (rota)',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.tipoLink === 'rota' || !siblingData?.tipoLink,
        description: `Endereço já existente no site, começando com "/". ${ROTAS_EXISTENTES}. Deixe em branco se este item só abre um submenu.`,
      },
    },
    {
      name: 'url',
      label: 'URL externa',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.tipoLink === 'externo',
        description: 'Endereço completo de outro site. Ex: https://exemplo.com',
      },
    },
  ]
}

function menuItemFields(includeSubmenu: boolean): Field[] {
  const fields: Field[] = [
    {
      name: 'label',
      label: 'Texto do menu',
      type: 'text',
      required: true,
      admin: {
        description: 'Texto exibido no cabeçalho do site.',
      },
    },
    ...linkFields(),
  ]

  if (includeSubmenu) {
    fields.push({
      name: 'submenu',
      label: 'Submenu',
      type: 'array',
      admin: {
        description:
          'Itens que aparecem ao passar o mouse/clicar neste item. Deixe vazio para um link simples sem submenu.',
      },
      fields: menuItemFields(false),
    })
  }

  return fields
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menu de Navegação',
  admin: {
    group: 'Navegação',
    description:
      '🧭 Gerencie os links e submenus do cabeçalho do site. Os itens podem apontar para páginas criadas no Construtor de Páginas, rotas já existentes do site, ou links externos.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'menuPrincipal',
      label: 'Menu principal (esquerda)',
      type: 'array',
      admin: {
        description: 'Itens exibidos do lado esquerdo do cabeçalho, ao lado da logo.',
      },
      fields: menuItemFields(true),
      defaultValue: [
        { label: 'Quentinhas', tipoLink: 'rota', rota: '/quentinhas' },
        {
          label: 'Festival',
          tipoLink: 'rota',
          rota: '',
          submenu: [
            { label: 'Nesta Edição', tipoLink: 'rota', rota: '/nesta-edicao' },
            { label: 'Edições Anteriores', tipoLink: 'rota', rota: '/timeline' },
            { label: 'Nossos Filmes', tipoLink: 'rota', rota: '/nossos-filmes' },
            { label: 'Prêmios', tipoLink: 'rota', rota: '/premios' },
          ],
        },
        {
          label: 'Participar',
          tipoLink: 'rota',
          rota: '',
          submenu: [
            { label: 'Bora Filmar!', tipoLink: 'rota', rota: '/bora-filmar' },
            { label: 'Como Filmar?', tipoLink: 'rota', rota: '/como-filmar' },
          ],
        },
      ],
    },
    {
      name: 'menuSecundario',
      label: 'Menu secundário (direita)',
      type: 'array',
      admin: {
        description: 'Itens exibidos do lado direito do cabeçalho.',
      },
      fields: menuItemFields(true),
      defaultValue: [
        { label: 'Apoiadores', tipoLink: 'rota', rota: '/apoiadores' },
        { label: 'Inspirações', tipoLink: 'rota', rota: '/nossas-inspiracoes' },
        { label: 'Vamos Juntos?', tipoLink: 'rota', rota: '/vamos-juntos' },
      ],
    },
  ],
}
