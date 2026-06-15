import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

export const dynamic = 'force-dynamic'

async function fetchPage(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload
    .find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })
    .catch(() => ({ docs: [] as any[] }))

  return docs[0] || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchPage(slug.join('/'))

  if (!page) return { title: 'Página não encontrada — Trakinagem Cine' }

  return buildMetadata({
    seo: page.seo,
    fallbackTitle: page.title,
    path: `/${slug.join('/')}`,
    ogType: 'website',
  })
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = await fetchPage(slug.join('/'))

  if (!page) notFound()

  return (
    <main>
      <BlockRenderer blocks={page.layout} />
    </main>
  )
}
