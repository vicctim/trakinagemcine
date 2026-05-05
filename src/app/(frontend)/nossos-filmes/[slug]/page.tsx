import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Calendar, Clock, Trophy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata, movieSchema, getMediaUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload
    .find({ collection: 'filmes', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))

  const filme = docs[0]
  if (!filme) return { title: 'Filme não encontrado — Trakinagem Cine' }

  return buildMetadata({
    seo: filme.seo,
    fallbackTitle: filme.titulo,
    fallbackDescription: filme.sinopse,
    fallbackImage: filme.capa,
    path: `/nossos-filmes/${slug}`,
    ogType: 'video.movie',
  })
}

export default async function FilmePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload
    .find({
      collection: 'filmes',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    .catch(() => ({ docs: [] as any[] }))

  const filme = docs[0]
  if (!filme) notFound()

  const capaUrl = getMediaUrl(filme.capa)
  const edicao = typeof filme.edicao === 'object' ? filme.edicao : null
  const premios: any[] = filme.premios || []

  const ldJson = movieSchema({
    title: filme.titulo,
    description: filme.sinopse || '',
    image: capaUrl,
    year: filme.ano,
    duration: filme.duracao,
    url: `/nossos-filmes/${slug}`,
    trailerUrl: filme.youtubeUrl,
  })

  return (
    <main className="page-filme">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      <section className="filme-section page-header-section">
        <div className="container">
          <Link href="/nossos-filmes" className="filme-back">← Todos os filmes</Link>

          <div className="filme-grid">
            {capaUrl && (
              <div className="filme-poster">
                <Image
                  src={capaUrl}
                  alt={filme.titulo}
                  width={600}
                  height={900}
                  className="filme-poster__image"
                  priority
                />
              </div>
            )}

            <div className="filme-content">
              <h1 className="filme-title">{filme.titulo}</h1>

              <div className="filme-meta">
                {filme.ano && (
                  <span className="filme-meta__item">
                    <Calendar size={14} className="inline-icon" /> {filme.ano}
                  </span>
                )}
                {filme.duracao && (
                  <span className="filme-meta__item">
                    <Clock size={14} className="inline-icon" /> {filme.duracao}
                  </span>
                )}
                {edicao?.titulo && (
                  <Link href={`/timeline/${edicao.slug}`} className="filme-meta__item filme-meta__edicao">
                    {edicao.titulo}
                  </Link>
                )}
              </div>

              {filme.sinopse && (
                <div className="filme-sinopse">
                  <h2 className="filme-section-title">Sinopse</h2>
                  <p>{filme.sinopse}</p>
                </div>
              )}

              {premios.length > 0 && (
                <div className="filme-premios">
                  <h2 className="filme-section-title">
                    <Trophy size={18} className="inline-icon" /> Prêmios e Seleções
                  </h2>
                  <ul className="filme-premios-list">
                    {premios.map((p: any) => (
                      <li key={p.id || p}>
                        <strong>{p.nomeDoFestival}</strong>
                        {p.categoria && ` — ${p.categoria}`}
                        {p.anoDoEvento && ` (${p.anoDoEvento})`}
                        {p.resultado && (
                          <span className={`premio-tag premio-tag--${p.resultado}`}>
                            {p.resultado === 'premiado' ? '🏆 Premiado' : '🎯 Selecionado'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {filme.youtubeUrl && (
        <section className="filme-section">
          <div className="container">
            <h2 className="filme-section-title">Assista ao filme</h2>
            <div className="filme-video">
              <YouTubeEmbed videoId={filme.youtubeUrl} title={filme.titulo} />
            </div>
          </div>
        </section>
      )}

      <style>{`
        .page-filme { padding-top: 100px; }
        .filme-back {
          display: inline-block;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          text-decoration: none;
          margin-bottom: 2rem;
        }
        .filme-back:hover { color: var(--color-accent); }

        .filme-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .filme-grid {
            grid-template-columns: 320px 1fr;
            gap: 3rem;
          }
        }

        .filme-poster__image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }

        .filme-title {
          font-family: var(--font-heading);
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          margin-bottom: 1rem;
          line-height: 1.15;
        }

        .filme-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .filme-meta__item {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .filme-meta__edicao {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 600;
        }
        .filme-meta__edicao:hover { text-decoration: underline; }

        .filme-section { padding: 3rem 0; }
        .filme-section-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          margin-bottom: 0.85rem;
          color: var(--color-accent);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filme-sinopse p {
          font-size: 1rem;
          line-height: 1.75;
          margin-bottom: 1.5rem;
          color: var(--color-text);
        }

        .filme-premios-list {
          list-style: none;
          padding: 0;
        }
        .filme-premios-list li {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .filme-premios-list li:last-child { border-bottom: none; }

        .premio-tag {
          display: inline-block;
          margin-left: 0.5rem;
          font-size: 0.75rem;
          padding: 0.1rem 0.5rem;
          border-radius: 3px;
          font-weight: 600;
        }
        .premio-tag--premiado { background: rgba(255,193,7,0.15); color: #B8860B; }
        .premio-tag--selecionado { background: rgba(46,125,50,0.12); color: #2E7D32; }

        .filme-video {
          max-width: 900px;
          margin: 0 auto;
        }
      `}</style>
    </main>
  )
}
