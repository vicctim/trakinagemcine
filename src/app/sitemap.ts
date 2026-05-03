import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://trakinagemcine.victorsamuel.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/nesta-edicao`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bora-filmar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/como-filmar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/nossos-filmes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/quentinhas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/timeline`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/premios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/apoiadores`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/vamos-juntos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/privacidade`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic: Quentinhas posts
  const { docs: posts } = await payload
    .find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 100, depth: 0 })
    .catch(() => ({ docs: [] as any[] }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${BASE_URL}/quentinhas/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic: Timeline editions
  const { docs: edicoes } = await payload
    .find({ collection: 'edicoes', limit: 100, depth: 0 })
    .catch(() => ({ docs: [] as any[] }))

  const edicaoRoutes: MetadataRoute.Sitemap = edicoes.map((ed: any) => ({
    url: `${BASE_URL}/timeline/${ed.slug}`,
    lastModified: new Date(ed.updatedAt || ed.createdAt),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...postRoutes, ...edicaoRoutes]
}
