import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 600

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://trakinagemcine.victorsamuel.com.br'
  const payload = await getPayloadClient()
  const { docs } = await payload
    .find({ collection: 'edicoes', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))

  const edicao = docs[0]
  if (!edicao) return { title: 'Edição não encontrada' }

  const capaUrl = getMediaUrl(edicao.imagemCapa)

  return {
    title: `${edicao.titulo} — Timeline`,
    description: `Conheça a ${edicao.titulo} do Trakinagem Cine, edição de ${edicao.ano}.`,
    alternates: {
      canonical: `${BASE}/timeline/${slug}`,
    },
    openGraph: {
      title: edicao.titulo,
      description: `Edição ${edicao.ano} do Trakinagem Cine`,
      ...(capaUrl ? { images: [{ url: capaUrl, width: 1200, height: 630, alt: edicao.titulo }] } : {}),
    },
  }
}

export default async function EdicaoSlugPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload
    .find({
      collection: 'edicoes',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    .catch(() => ({ docs: [] as any[] }))

  const edicao = docs[0]
  if (!edicao) notFound()

  const capaUrl = getMediaUrl(edicao.imagemCapa)
  const fotos: any[] = edicao.fotos || []
  const videos: any[] = edicao.videoLinks || []
  const parceiros: any[] = edicao.parceirosInstitucionais || []

  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://trakinagemcine.victorsamuel.com.br'

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: edicao.titulo,
    description: typeof edicao.resumo === 'string' ? edicao.resumo.slice(0, 300) : `Edição ${edicao.ano} do Trakinagem Cine`,
    startDate: String(edicao.ano),
    organizer: {
      '@type': 'Organization',
      name: 'Trakinagem Cine',
      url: BASE,
    },
    url: `${BASE}/timeline/${slug}`,
    ...(capaUrl ? { image: capaUrl } : {}),
  }

  return (
    <main className="page-edicao-detalhe">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/timeline" className="breadcrumb__link">← Timeline</Link>
            <span className="breadcrumb__sep">/</span>
            <span className="breadcrumb__current">{edicao.titulo}</span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="section page-header-section">
        <div className="container">
          <SectionHeader
            label={`Temporada ${edicao.ano}`}
            title={edicao.titulo}
            accent={edicao.titulo}
            subtitle=""
          />
          <div className="edicao-meta">
            <span className={`edicao-status edicao-status--${edicao.status}`}>
              {edicao.status === 'ativa' ? 'Edição Atual' : 'Arquivada'}
            </span>
            <span className="edicao-year">
              <Calendar size={14} className="inline-icon" />
              {edicao.ano}
            </span>
          </div>
        </div>
      </section>

      {/* Capa */}
      {capaUrl && (
        <section className="section section-capa">
          <div className="container">
            <div className="capa-wrapper">
              <Image
                src={capaUrl}
                alt={edicao.titulo}
                width={1200}
                height={540}
                className="capa-image"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Resumo */}
      <section className="section">
        <div className="container container--narrow">
          <h2 className="resumo-title">Sobre esta edição</h2>
          {edicao.resumo && (
            <div className="resumo-body">
              {typeof edicao.resumo === 'string'
                ? edicao.resumo
                : 'Conteúdo desta edição em breve.'}
            </div>
          )}
        </div>
      </section>

      {/* Galeria de Fotos */}
      {fotos.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h3 className="section-subtitle">Galeria de Fotos</h3>
            <div className="gallery-grid">
              {fotos.map((item: any, i: number) => {
                const url = getMediaUrl(item.foto)
                if (!url) return null
                return (
                  <div key={i} className="gallery-item">
                    <Image
                      src={url}
                      alt={item.foto?.alt || `Foto ${i + 1}`}
                      width={400}
                      height={300}
                      className="gallery-item__img"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Vídeos */}
      {videos.length > 0 && (
        <section className="section">
          <div className="container">
            <h3 className="section-subtitle">Vídeos</h3>
            <div className="videos-grid">
              {videos.map((v: any, i: number) => (
                <YouTubeEmbed key={i} videoId={v.url} title={`Vídeo ${i + 1}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parceiros */}
      {parceiros.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h3 className="section-subtitle" style={{ textAlign: 'center' }}>Parceiros Institucionais</h3>
            <ul className="parceiros-list">
              {parceiros.map((p: any, i: number) => (
                <li key={i} className="parceiro-item">{p.nome}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Back nav */}
      <section className="section">
        <div className="container">
          <Link href="/timeline" className="back-link">← Ver todas as edições</Link>
        </div>
      </section>

      <style>{`
        .breadcrumb-section {
          padding: 0 0 1rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .breadcrumb__link {
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .breadcrumb__link:hover { opacity: 0.75; }
        .breadcrumb__sep { opacity: 0.4; }

        .page-header-section { padding-top: 1.5rem; }

        .edicao-meta {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .edicao-status {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .edicao-status--ativa {
          background: rgba(46, 125, 50, 0.12);
          color: #2E7D32;
        }

        .edicao-status--arquivada {
          background: var(--color-bg-tertiary);
          color: var(--color-text-muted);
        }

        .edicao-year {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .inline-icon { flex-shrink: 0; }

        .section-capa { padding-top: 0; }

        .capa-wrapper { border-radius: 10px; overflow: hidden; }

        .capa-image { width: 100%; height: auto; display: block; }

        .container--narrow { max-width: 720px; }

        .resumo-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          margin-bottom: 1.25rem;
          color: var(--color-text-primary);
        }

        .resumo-body {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-secondary);
        }

        .section-subtitle {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .gallery-item { border-radius: 6px; overflow: hidden; }

        .gallery-item__img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .gallery-item__img { transform: scale(1.04); }

        .videos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .videos-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .parceiros-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .parceiro-item {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 0.6rem 1.25rem;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          color: var(--color-accent);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .back-link:hover { opacity: 0.75; }
      `}</style>
    </main>
  )
}
