'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface Edicao {
  id: number | string
  slug: string
  titulo: string
  ano: number
  status: string
  resumo?: any
  imagemCapa?: any
}

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export default function TimelineClient({ edicoes }: { edicoes: Edicao[] }) {
  const years = Array.from(new Set(edicoes.map((e) => e.ano))).sort((a, b) => b - a)
  const [selectedYear, setSelectedYear] = useState<number | 'todos'>('todos')

  const filtered =
    selectedYear === 'todos' ? edicoes : edicoes.filter((e) => e.ano === selectedYear)

  return (
    <>
      {/* Year filter */}
      {years.length > 1 && (
        <div className="year-filter">
          <button
            className={`year-btn ${selectedYear === 'todos' ? 'year-btn--active' : ''}`}
            onClick={() => setSelectedYear('todos')}
          >
            Todos
          </button>
          {years.map((year) => (
            <button
              key={year}
              className={`year-btn ${selectedYear === year ? 'year-btn--active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Timeline list */}
      <motion.div className="timeline" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((ed) => {
            const capaUrl = getMediaUrl(ed.imagemCapa)
            return (
              <motion.article
                key={ed.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="timeline-item"
              >
                <div className="timeline-item__year">
                  <span className="timeline-item__year-text">{ed.ano}</span>
                  <span className="timeline-item__dot" />
                </div>
                <div className="timeline-item__content">
                  {capaUrl && (
                    <div className="timeline-item__image">
                      <Image
                        src={capaUrl}
                        alt={ed.titulo}
                        width={400}
                        height={225}
                        className="timeline-item__img"
                      />
                    </div>
                  )}
                  <div className="timeline-item__body">
                    <span
                      className={`timeline-item__status timeline-item__status--${ed.status}`}
                    >
                      {ed.status === 'ativa' ? (
                        <><span className="status-dot status-dot--active" /> Edição Atual</>
                      ) : (
                        <><Calendar size={11} className="inline-icon-xs" /> Arquivada</>
                      )}
                    </span>
                    <h3 className="timeline-item__title">{ed.titulo}</h3>
                    {ed.resumo && typeof ed.resumo === 'string' && (
                      <p className="timeline-item__desc">{ed.resumo.slice(0, 180)}…</p>
                    )}
                    <Link href={`/timeline/${ed.slug}`} className="timeline-item__link">
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .year-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
        }

        .year-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.82rem;
          font-family: var(--font-heading);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .year-btn:hover,
        .year-btn--active {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }

        .timeline {
          position: relative;
          padding-left: 80px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 40px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--color-border);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 3rem;
        }

        .timeline-item__year {
          position: absolute;
          left: -80px;
          top: 0;
          width: 80px;
          display: flex;
          align-items: center;
        }

        .timeline-item__year-text {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--color-accent);
          width: 40px;
          text-align: right;
        }

        .timeline-item__dot {
          position: absolute;
          right: 0;
          width: 10px;
          height: 10px;
          background: var(--color-accent);
          border-radius: 50%;
          transform: translateX(50%);
        }

        .timeline-item__content {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .timeline-item__content:hover {
          border-color: var(--color-border-hover);
        }

        .timeline-item__image { overflow: hidden; }

        .timeline-item__img {
          width: 100%;
          height: auto;
          display: block;
        }

        .timeline-item__body { padding: 1.25rem; }

        .timeline-item__status {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.5rem;
        }

        .timeline-item__status--ativa { color: #2E7D32; }
        .timeline-item__status--arquivada { color: var(--color-text-muted); }

        .status-dot--active {
          display: inline-block;
          width: 7px;
          height: 7px;
          background: #2E7D32;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .inline-icon-xs { flex-shrink: 0; }

        .timeline-item__title {
          font-family: var(--font-heading);
          margin-bottom: 0.5rem;
        }

        .timeline-item__desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .timeline-item__link {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .timeline-item__link:hover { opacity: 0.75; }

        @media (max-width: 640px) {
          .timeline { padding-left: 50px; }
          .timeline::before { left: 25px; }
          .timeline-item__year { left: -50px; width: 50px; }
          .timeline-item__year-text { width: 36px; font-size: 0.82rem; }
          .timeline-item__dot { right: -1px; }
        }

        @media (max-width: 380px) {
          .timeline { padding-left: 42px; }
          .timeline::before { left: 21px; }
          .timeline-item__year { left: -42px; width: 42px; }
          .timeline-item__year-text { width: 31px; font-size: 0.76rem; }
        }
      `}</style>
    </>
  )
}
