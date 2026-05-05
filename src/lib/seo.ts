import type { Metadata } from 'next'

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://trakinagemcine.victorsamuel.com.br'
const SITE_NAME = 'Trakinagem Cine'

/**
 * Extrai texto limpo de um documento richText do Lexical.
 * Percorre recursivamente os nodes e concatena `text` em string única.
 */
export function extractTextFromLexical(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText

  const root = richText.root || richText
  if (!root?.children) return ''

  const collect = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (typeof node.text === 'string') return node.text
    if (Array.isArray(node.children)) {
      return node.children.map(collect).join(' ')
    }
    return ''
  }

  return collect(root).replace(/\s+/g, ' ').trim()
}

/**
 * Trunca texto até `max` caracteres, terminando em palavra completa
 * e adicionando "…" se truncado.
 */
export function truncate(text: string, max: number): string {
  if (!text) return ''
  if (text.length <= max) return text
  const sliced = text.slice(0, max)
  const lastSpace = sliced.lastIndexOf(' ')
  const cut = lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced
  return cut.trimEnd() + '…'
}

export function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const base = DEFAULT_SITE_URL.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

interface SeoInput {
  /** Conteúdo SEO customizado pelo usuário (campo `seo` do documento) */
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: any
    noIndex?: boolean
  }
  /** Título do documento (fallback) */
  fallbackTitle: string
  /** Descrição/conteúdo do documento — pode ser string ou Lexical object */
  fallbackDescription?: string | any
  /** Imagem padrão (capa) caso não tenha ogImage explícita */
  fallbackImage?: any
  /** Path da página (ex: '/quentinhas/minha-noticia') */
  path: string
  /** Tipo OG (default: 'article') */
  ogType?: 'article' | 'website' | 'video.movie'
}

/**
 * Constrói o objeto Metadata do Next.js a partir de SEO customizado + fallbacks.
 * Reutilizável em todas as `generateMetadata` das páginas.
 */
export function buildMetadata(input: SeoInput): Metadata {
  const { seo, fallbackTitle, fallbackDescription, fallbackImage, path, ogType = 'article' } = input

  const title = seo?.metaTitle?.trim() || fallbackTitle
  const fullTitle = `${title} — ${SITE_NAME}`

  const rawDescription =
    seo?.metaDescription?.trim() ||
    (typeof fallbackDescription === 'string'
      ? fallbackDescription
      : extractTextFromLexical(fallbackDescription))
  const description = truncate(rawDescription, 160)

  const ogImageUrl = getMediaUrl(seo?.ogImage) || getMediaUrl(fallbackImage)
  const canonical = absoluteUrl(path)

  return {
    title: fullTitle,
    description: description || `${title} — ${SITE_NAME}`,
    alternates: { canonical },
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: ogType,
      title,
      description: description || undefined,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      ...(ogImageUrl
        ? {
            images: [
              { url: absoluteUrl(ogImageUrl), width: 1200, height: 630, alt: title },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      ...(ogImageUrl ? { images: [absoluteUrl(ogImageUrl)] } : {}),
    },
  }
}

// ─── JSON-LD Structured Data Builders ────────────────────────────────────────

interface ArticleSchemaInput {
  title: string
  description: string
  image?: string
  datePublished?: string
  dateModified?: string
  url: string
  author?: string
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: {
      '@type': 'Organization',
      name: input.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo-trakinagemcine.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.url),
    },
  }
}

interface MovieSchemaInput {
  title: string
  description: string
  image?: string
  year?: number | string
  duration?: string
  url: string
  trailerUrl?: string
}

export function movieSchema(input: MovieSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: input.title,
    description: input.description,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.year ? { datePublished: String(input.year) } : {}),
    ...(input.duration ? { duration: input.duration } : {}),
    url: absoluteUrl(input.url),
    ...(input.trailerUrl
      ? {
          trailer: {
            '@type': 'VideoObject',
            embedUrl: input.trailerUrl,
            name: input.title,
          },
        }
      : {}),
    productionCompany: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }
}

interface EventSchemaInput {
  title: string
  description: string
  image?: string
  year?: number | string
  url: string
}

export function eventSchema(input: EventSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.title,
    description: input.description,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.year
      ? { startDate: `${input.year}-01-01`, endDate: `${input.year}-12-31` }
      : {}),
    url: absoluteUrl(input.url),
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: DEFAULT_SITE_URL,
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  }
}
