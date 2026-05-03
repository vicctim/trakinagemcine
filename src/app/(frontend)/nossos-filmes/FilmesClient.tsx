'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { motion, AnimatePresence } from 'framer-motion'
import { Clapperboard } from 'lucide-react'

interface FilmesClientProps {
  filmes: any[]
  edicoes: string[]
}

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export default function FilmesClient({ filmes, edicoes }: FilmesClientProps) {
  const [selectedEdition, setSelectedEdition] = useState<string>('todos')
  const [selectedFilm, setSelectedFilm] = useState<any>(null)

  const filtered =
    selectedEdition === 'todos'
      ? filmes
      : filmes.filter((f: any) => {
          const edicaoNome = typeof f.edicao === 'object' ? f.edicao?.titulo : ''
          return edicaoNome === selectedEdition
        })

  return (
    <>
      <section className="section page-header-section">
        <div className="container">
          <SectionHeader
            label="Filmografia"
            title="Nossos Filmes"
            accent="Filmes"
            subtitle="Curtas-metragens produzidos por jovens nas oficinas do Trakinagem Cine."
          />

          {/* Filter */}
          {edicoes.length > 0 && (
            <div className="filmes-filter">
              <button
                className={`filter-btn ${selectedEdition === 'todos' ? 'filter-btn--active' : ''}`}
                onClick={() => setSelectedEdition('todos')}
              >
                Todos
              </button>
              {edicoes.map((ed) => (
                <button
                  key={ed}
                  className={`filter-btn ${selectedEdition === ed ? 'filter-btn--active' : ''}`}
                  onClick={() => setSelectedEdition(ed)}
                >
                  {ed}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {filtered.length > 0 ? (
            <div className="filmes-catalog">
              {filtered.map((filme: any) => {
                const capaUrl = getMediaUrl(filme.capa)
                return (
                  <motion.div
                    key={filme.id}
                    layout
                    className="filme-card"
                    onClick={() => setSelectedFilm(filme)}
                    whileHover={{ y: -4 }}
                  >
                    <div className="filme-card__poster">
                      {capaUrl ? (
                        <Image
                          src={capaUrl}
                          alt={filme.titulo}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="filme-card__image"
                        />
                      ) : (
                        <div className="filme-card__placeholder"><Clapperboard size={40} opacity={0.3} /></div>
                      )}
                      <div className="filme-card__overlay">
                        <span className="filme-card__play">▶ Ver detalhes</span>
                      </div>
                    </div>
                    <div className="filme-card__info">
                      <h3 className="filme-card__title">{filme.titulo}</h3>
                      <p className="filme-card__meta">
                        {filme.ano}
                        {filme.duracao && ` · ${filme.duracao}`}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon"><Clapperboard size={48} strokeWidth={1.2} /></div>
              <h3 className="empty-state__title">Nenhum filme encontrado</h3>
              <p className="empty-state__text">
                Em breve adicionaremos os filmes ao catálogo.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Film Detail Modal */}
      <AnimatePresence>
        {selectedFilm && (
          <motion.div
            className="film-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFilm(null)}
          >
            <motion.div
              className="film-modal__content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="film-modal__close"
                onClick={() => setSelectedFilm(null)}
              >
                ✕
              </button>

              {selectedFilm.youtubeUrl && (
                <div className="film-modal__video">
                  <YouTubeEmbed
                    videoId={selectedFilm.youtubeUrl}
                    title={selectedFilm.titulo}
                  />
                </div>
              )}

              <div className="film-modal__body">
                <h2 className="film-modal__title">{selectedFilm.titulo}</h2>
                <div className="film-modal__meta">
                  <span>{selectedFilm.ano}</span>
                  {selectedFilm.duracao && <span>· {selectedFilm.duracao}</span>}
                  {typeof selectedFilm.edicao === 'object' && selectedFilm.edicao?.titulo && (
                    <span>· {selectedFilm.edicao.titulo}</span>
                  )}
                </div>
                {selectedFilm.sinopse && (
                  <p className="film-modal__sinopse">{selectedFilm.sinopse}</p>
                )}
                {selectedFilm.youtubeUrl && (
                  <a
                    href={selectedFilm.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="film-modal__yt-link"
                  >
                    Assistir no YouTube →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .page-header-section {
          padding-top: 120px;
        }

        .filmes-filter {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .filter-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover,
        .filter-btn--active {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: rgba(211, 47, 47, 0.08);
        }

        .filmes-catalog {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 420px) {
          .filmes-catalog {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 768px) {
          .filmes-catalog {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .filme-card {
          cursor: pointer;
        }

        .filme-card__poster {
          position: relative;
          aspect-ratio: 2 / 3;
          border-radius: 6px;
          overflow: hidden;
          background: var(--color-bg-tertiary);
          margin-bottom: 0.75rem;
        }

        .filme-card__image {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .filme-card:hover .filme-card__image {
          transform: scale(1.05);
        }

        .filme-card__placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          opacity: 0.3;
        }

        .filme-card__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .filme-card:hover .filme-card__overlay {
          opacity: 1;
        }

        .filme-card__play {
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
        }

        .filme-card__title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.3;
        }

        .filme-card__meta {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        /* Modal */
        .film-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .film-modal {
            align-items: flex-start;
            padding: 1rem;
          }
        }

        .film-modal__content {
          background: var(--color-bg-secondary);
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          cursor: default;
          position: relative;
        }

        .film-modal__close {
          position: absolute;
          top: 0.75rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--color-text-primary);
          font-size: 1.25rem;
          cursor: pointer;
          z-index: 10;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .film-modal__close:hover {
          opacity: 1;
        }

        .film-modal__video {
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }

        .film-modal__body {
          padding: 1.5rem;
        }

        .film-modal__title {
          font-family: var(--font-heading);
          margin-bottom: 0.5rem;
        }

        .film-modal__meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
        }

        .film-modal__sinopse {
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .film-modal__yt-link {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }

        .film-modal__yt-link:hover {
          opacity: 0.8;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state__icon { display: flex; justify-content: center; margin-bottom: 1.5rem; opacity: 0.4; }
        .empty-state__title { font-family: var(--font-heading); margin-bottom: 0.75rem; }
        .empty-state__text { color: var(--color-text-secondary); max-width: 40ch; margin: 0 auto; }
      `}</style>
    </>
  )
}
