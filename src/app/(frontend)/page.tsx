import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()

  // Fetch SiteConfig global
  const siteConfig = await payload.findGlobal({ slug: 'site-config' }).catch(() => null)

  // Fetch latest 3 published posts
  const postsResult = await payload
    .find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 1,
    })
    .catch(() => ({ docs: [] }))

  // Fetch latest 4 films
  const filmesResult = await payload
    .find({
      collection: 'filmes',
      sort: '-ano',
      limit: 4,
      depth: 1,
    })
    .catch(() => ({ docs: [] }))

  // Fetch apoiadores
  const apoiadoresResult = await payload
    .find({
      collection: 'apoiadores',
      limit: 20,
      depth: 1,
    })
    .catch(() => ({ docs: [] }))

  return (
    <HomeClient
      siteConfig={siteConfig}
      posts={postsResult.docs}
      filmes={filmesResult.docs}
      apoiadores={apoiadoresResult.docs}
    />
  )
}
