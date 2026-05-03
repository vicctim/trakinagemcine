import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import FilmesClient from './FilmesClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nossos Filmes — Trakinagem Cine',
  description:
    'Catálogo de curtas-metragens produzidos pelos jovens nas oficinas do Trakinagem Cine.',
}

export default async function NossosFilmesPage() {
  const payload = await getPayloadClient()

  const { docs: filmes } = await payload
    .find({
      collection: 'filmes',
      sort: '-ano',
      limit: 100,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  // Extract unique edition names for filter
  const edicoes = [
    ...new Set(
      filmes
        .map((f: any) => (typeof f.edicao === 'object' ? f.edicao?.titulo : null))
        .filter(Boolean),
    ),
  ] as string[]

  return <FilmesClient filmes={filmes} edicoes={edicoes} />
}
