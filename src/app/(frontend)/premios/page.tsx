import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import Image from 'next/image'
import { Trophy, Clapperboard } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Prêmios — Trakinagem Cine',
  description: 'Prêmios e seleções em festivais nacionais e internacionais do Trakinagem Cine.',
}

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export default async function PremiosPage() {
  const payload = await getPayloadClient()

  const { docs: premios } = await payload
    .find({
      collection: 'premios',
      sort: '-ano',
      limit: 50,
      depth: 2,
    })
    .catch(() => ({ docs: [] as any[] }))

  // Group by year
  const byYear = premios.reduce((acc: Record<string, any[]>, p: any) => {
    const year = p.ano?.toString() || 'Outros'
    if (!acc[year]) acc[year] = []
    acc[year].push(p)
    return acc
  }, {})

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <main className="page-premios">
      <section className="section page-header-section">
        <div className="container">
          <SectionHeader
            label="Reconhecimento"
            title="Prêmios e Festivais"
            accent="Prêmios"
            subtitle="Seleções e premiações em festivais nacionais e internacionais."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          {years.length > 0 ? (
            <div className="premios-timeline">
              {years.map((year) => (
                <div key={year} className="premios-year">
                  <h3 className="premios-year__label">{year}</h3>
                  <div className="premios-year__grid">
                    {byYear[year].map((premio: any) => {
                      const logoUrl = getMediaUrl(premio.logoFestival)
                      const filmeNome =
                        typeof premio.filme === 'object' ? premio.filme?.titulo : ''
                      return (
                        <article key={premio.id} className="premio-card">
                          {logoUrl && (
                            <div className="premio-card__logo">
                              <Image
                                src={logoUrl}
                                alt={premio.festival}
                                width={80}
                                height={80}
                                style={{ objectFit: 'contain' }}
                              />
                            </div>
                          )}
                          <div className="premio-card__body">
                            <span
                              className={`premio-card__badge premio-card__badge--${premio.resultado}`}
                            >
                              {premio.resultado === 'premiado' ? (
                                <><Trophy size={12} className="inline-icon" /> Premiado</>
                              ) : (
                                <><Clapperboard size={12} className="inline-icon" /> Selecionado</>
                              )}
                            </span>
                            <h4 className="premio-card__festival">{premio.festival}</h4>
                            {premio.categoria && (
                              <p className="premio-card__cat">{premio.categoria}</p>
                            )}
                            {filmeNome && (
                              <p className="premio-card__filme">Filme: {filmeNome}</p>
                            )}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon"><Trophy size={48} strokeWidth={1.2} /></div>
              <h3 className="empty-state__title">Nenhum prêmio cadastrado</h3>
              <p className="empty-state__text">
                Em breve adicionaremos os prêmios e seleções.
              </p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 120px; }

        .premios-year {
          margin-bottom: 3rem;
        }

        .premios-year__label {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          color: var(--color-accent);
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .premios-year__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .premios-year__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .premio-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          transition: border-color 0.2s;
        }

        .premio-card:hover {
          border-color: var(--color-border-hover);
        }

        .premio-card__logo {
          flex-shrink: 0;
          width: 80px;
          display: flex;
          align-items: center;
        }

        .premio-card__badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: inline-flex;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .inline-icon {
          margin-right: 4px;
        }

        .premio-card__badge--premiado { color: #f59e0b; }
        .premio-card__badge--selecionado { color: var(--color-text-muted); }

        .premio-card__festival {
          font-family: var(--font-heading);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .premio-card__cat {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
        }

        .premio-card__filme {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-top: 0.35rem;
        }

        .empty-state { text-align: center; padding: 4rem 2rem; }
        .empty-state__icon { display: flex; justify-content: center; margin-bottom: 1.5rem; opacity: 0.4; }
        .empty-state__title { font-family: var(--font-heading); margin-bottom: 0.75rem; }
        .empty-state__text { color: var(--color-text-secondary); max-width: 40ch; margin: 0 auto; }
      `}</style>
    </main>
  )
}
