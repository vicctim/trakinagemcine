import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/nesta-edicao`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bora-filmar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/como-filmar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/nossos-filmes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/nossas-inspiracoes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/quentinhas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/timeline`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/premios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/apoiadores`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/vamos-juntos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/privacidade`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic: Quentinhas posts (excluding noindex)
  const { docs: posts } = await payload
    .find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 500, depth: 0 })
    .catch(() => ({ docs: [] as any[] }))

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p: any) => !p.seo?.noIndex)
    .map((post: any) => ({
      url: `${BASE_URL}/quentinhas/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  // Dynamic: Timeline editions
  const { docs: edicoes } = await payload
    .find({ collection: 'edicoes', limit: 100, depth: 0 })
    .catch(() => ({ docs: [] as any[] }))

  const edicaoRoutes: MetadataRoute.Sitemap = edicoes
    .filter((e: any) => !e.seo?.noIndex)
    .map((ed: any) => ({
      url: `${BASE_URL}/timeline/${ed.slug}`,
      lastModified: new Date(ed.updatedAt || ed.createdAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }))

  // Dynamic: Filmes (individual pages)
  const { docs: filmes } = await payload
    .find({ collection: 'filmes', limit: 500, depth: 0 })
    .catch(() => ({ docs: [] as any[] }))

  const filmeRoutes: MetadataRoute.Sitemap = filmes
    .filter((f: any) => !f.seo?.noIndex)
    .map((f: any) => ({
      url: `${BASE_URL}/nossos-filmes/${f.slug}`,
      lastModified: new Date(f.updatedAt || f.createdAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }))

  return [...staticRoutes, ...postRoutes, ...edicaoRoutes, ...filmeRoutes]
}
