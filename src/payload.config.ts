import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { pt } from '@payloadcms/translations/languages/pt'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Edicoes } from './collections/Edicoes'
import { Filmes } from './collections/Filmes'
import { Premios } from './collections/Premios'
import { Apoiadores } from './collections/Apoiadores'
import { FormSubmissions } from './collections/FormSubmissions'
import { Pages } from './collections/Pages'

// Globals
import { SiteConfig } from './globals/SiteConfig'
import { SmtpConfig } from './globals/SmtpConfig'
import { AnalyticsConfig } from './globals/AnalyticsConfig'
import { BackupConfig } from './globals/BackupConfig'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Trakinagem Cine',
    },

    // ─── Custom Dashboard ─────────────────────────────────────────────────
    components: {
      afterDashboard: ['/components/admin/Dashboard#Dashboard'],
    },

    // ─── Sidebar Links de Apoio ───────────────────────────────────────────
    livePreview: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      collections: ['posts', 'filmes', 'edicoes', 'pages'],
    },
  },

  // ─── Collections (com grupos organizados) ────────────────────────────────
  collections: [
    // Grupo: Conteúdo
    Posts,
    Filmes,
    Edicoes,
    Premios,
    Apoiadores,

    // Grupo: CRM
    FormSubmissions,

    // Grupo: Construtor de Páginas
    Pages,

    // Grupo: Sistema
    Users,
    Media,
  ],

  // ─── Globals (com grupos organizados) ────────────────────────────────────
  globals: [
    SiteConfig,
    SmtpConfig,
    AnalyticsConfig,
    BackupConfig,
    Navigation,
  ],

  // ─── Internationalization (pt-BR) ───────────────────────────────────────
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  sharp,
  plugins: [],
})
