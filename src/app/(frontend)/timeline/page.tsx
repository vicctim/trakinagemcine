import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import TimelineClient from './TimelineClient'

export const revalidate = 600

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
            <div className="empty-state">
              <div className="empty-state__icon"><Calendar size={48} strokeWidth={1.2} /></div>
              <h3 className="empty-state__title">Nenhuma edição cadastrada</h3>
              <p className="empty-state__text">
                Em breve adicionaremos o histórico de todas as edições.
              </p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 120px; }

        .empty-state { text-align: center; padding: 4rem 2rem; }
        .empty-state__icon { display: flex; justify-content: center; margin-bottom: 1.5rem; opacity: 0.4; }
        .empty-state__title { font-family: var(--font-heading); margin-bottom: 0.75rem; }
        .empty-state__text { color: var(--color-text-secondary); max-width: 40ch; margin: 0 auto; }
      `}</style>
    </main>
  )
}
