import React from 'react'
import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { ArchiveButton } from '@/components/ui/ArchiveButton'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nesta Edição — Trakinagem Cine',
  description: 'Acompanhe a edição atual do Trakinagem Cine: galeria, vídeos e parceiros.',
}

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export default async function NestaEdicaoPage() {
  const payload = await getPayloadClient()

  const { docs: edicoes } = await payload
    .find({
      collection: 'edicoes',
      where: { status: { equals: 'ativa' } },
      limit: 1,
      depth: 2,
    })
    .catch(() => ({ docs: [] as any[] }))

  const edicao = edicoes[0]

  const cookieStore = await cookies()
  const isAdmin = cookieStore.has('payload-token')

  if (!edicao) {
    return (
      <main className="page-edicao">
        <section className="section" style={{ paddingTop: 120 }}>
          <div className="container">
            <div className="empty-state">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', opacity: 0.4 }}>
                <Calendar size={48} strokeWidth={1.2} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.75rem' }}>
                Nenhuma edição ativa no momento
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                A próxima temporada será anunciada em breve. Enquanto isso, confira nosso{' '}
                <a href="/timeline" style={{ color: 'var(--color-accent)' }}>
                  histórico
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const capaUrl = getMediaUrl(edicao.imagemCapa)
  const fotos = edicao.fotos || []
  const videos = edicao.videoLinks || []
  const parceiros: any[] = edicao.parceirosInstitucionais || []

  return (
    <main className="page-edicao">
      <section className="section page-header-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <SectionHeader
              label={`Temporada ${edicao.ano}`}
              title={edicao.titulo}
              subtitle={edicao.descricao || ''}
            />
            {isAdmin && (
              <ArchiveButton edicaoId={edicao.id} edicaoTitulo={edicao.titulo} />
            )}
          </div>
        </div>
      </section>

      {capaUrl && (
        <section className="section">
          <div className="container">
            <div className="edicao-hero">
              <Image
                src={capaUrl}
                alt={edicao.titulo}
                width={1200}
                height={600}
                className="edicao-hero__image"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {fotos.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h3 className="sub-title">Galeria de Fotos</h3>
            <div className="gallery-grid">
              {fotos.map((foto: any, i: number) => {
                const url = getMediaUrl(foto.foto)
                if (!url) return null
                return (
                  <div key={i} className="gallery-item">
                    <Image
                      src={url}
                      alt={foto.foto?.alt || `Foto ${i + 1}`}
                      width={400}
                      height={300}
                      className="gallery-item__image"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="section">
          <div className="container">
            <h3 className="sub-title">Vídeos</h3>
            <div className="videos-grid">
              {videos.map((v: any, i: number) => (
                <div key={i}>
                  <YouTubeEmbed videoId={v.url} title={v.titulo || `Vídeo ${i + 1}`} />
                  {v.titulo && <p className="video-label">{v.titulo}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parceiros Institucionais */}
      {parceiros.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h3 className="sub-title" style={{ textAlign: 'center' }}>Parceiros Institucionais</h3>
            <ul className="parceiros-list">
              {parceiros.map((p: any, i: number) => (
                <li key={i} className="parceiro-item">{p.nome}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <style>{`
        .page-header-section { padding-top: 120px; }

        .edicao-hero__image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .sub-title {
          font-family: var(--font-heading);
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          border-radius: 6px;
          overflow: hidden;
        }

        .gallery-item__image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .gallery-item__image {
          transform: scale(1.03);
        }

        .videos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 700px;
        }

        @media (min-width: 768px) {
          .videos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .video-label {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          margin-top: 0.5rem;
        }

        .parceiros-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .parceiro-item {
          background: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 0.6rem 1.25rem;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }
      `}</style>
    </main>
  )
}
