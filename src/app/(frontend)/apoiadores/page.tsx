import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import Image from 'next/image'
import { Handshake } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Apoiadores — Trakinagem Cine',
  description: 'Conheça os parceiros e apoiadores que acreditam no cinema do Trakinagem Cine.',
}

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

const categoryLabels: Record<string, string> = {
  lei_incentivo: 'Lei de Incentivo',
  patrocinador: 'Patrocinadores',
  apoiador: 'Apoiadores',
  parceiro: 'Parceiros',
}

export default async function ApoiadoresPage() {
  const payload = await getPayloadClient()

  const { docs: apoiadores } = await payload
    .find({
      collection: 'apoiadores',
      limit: 100,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  // Group by category
  const byCategory = apoiadores.reduce((acc: Record<string, any[]>, a: any) => {
    const cat = a.categoria || 'apoiador'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(a)
    return acc
  }, {})

  const categoryOrder = ['lei_incentivo', 'patrocinador', 'apoiador', 'parceiro']
  const orderedCategories = categoryOrder.filter((c) => byCategory[c]?.length > 0)

  return (
    <main className="page-apoiadores">
      <section className="section page-header-section">
        <div className="container">
          <SectionHeader
            label="Quem acredita no cinema"
            title="Apoiadores"
            accent="Apoiadores"
            subtitle="Empresas, instituições e pessoas que tornam o Trakinagem Cine possível."
            align="center"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          {orderedCategories.length > 0 ? (
            orderedCategories.map((cat) => (
              <div key={cat} className="apoiador-group">
                <h3 className="apoiador-group__title">{categoryLabels[cat] || cat}</h3>
                <div className="apoiador-group__grid">
                  {byCategory[cat].map((ap: any) => {
                    const logoUrl = getMediaUrl(ap.logo)
                    if (!logoUrl) return null
                    return (
                      <div key={ap.id} className="apoiador-item" title={ap.nome}>
                        <Image
                          src={logoUrl}
                          alt={ap.nome}
                          width={160}
                          height={70}
                          style={{ objectFit: 'contain' }}
                        />
                        <span className="apoiador-item__name">{ap.nome}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<Handshake size={48} strokeWidth={1.2} />}
              title="Nenhum apoiador cadastrado"
              description="Em breve adicionaremos nossos apoiadores."
            />
          )}
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 120px; }

        .apoiador-group {
          margin-bottom: 3rem;
        }

        .apoiador-group__title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border);
          text-align: center;
        }

        .apoiador-group__grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }

        .apoiador-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem;
          opacity: 0.6;
          filter: grayscale(100%);
          transition: all 0.3s ease;
        }

        .apoiador-item:hover {
          opacity: 1;
          filter: grayscale(0%);
        }

        .apoiador-item__name {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

      `}</style>
    </main>
  )
}
