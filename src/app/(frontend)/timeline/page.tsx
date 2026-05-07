import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import TimelineClient from './TimelineClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Timeline — Trakinagem Cine',
  description: 'Histórico de todas as edições do Trakinagem Cine desde a primeira temporada.',
}

export default async function TimelinePage() {
  const payload = await getPayloadClient()

  const { docs: edicoes } = await payload
    .find({
      collection: 'edicoes',
      sort: '-ano',
      limit: 50,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  return (
    <main className="page-timeline">
      <section className="section page-header-section">
        <div className="container">
          <SectionHeader
            label="Histórico"
            title="Timeline"
            accent="Timeline"
            subtitle="Todas as edições do Trakinagem Cine, da mais recente à primeira."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          {edicoes.length > 0 ? (
            <TimelineClient edicoes={edicoes as any[]} />
          ) : (
            <EmptyState
              icon={<Calendar size={48} strokeWidth={1.2} />}
              title="Nenhuma edição cadastrada"
              description="Em breve adicionaremos o histórico de todas as edições."
            />
          )}
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 120px; }
      `}</style>
    </main>
  )
}
