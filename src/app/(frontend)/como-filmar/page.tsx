import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Como Filmar? — Trakinagem Cine',
  description: 'A metodologia dos 7 Atos: como os jovens aprendem a fazer cinema no Trakinagem.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/como-filmar`,
  },
}

const atos = [
  {
    num: 1,
    title: 'A Ideia',
    desc: 'Onde tudo começa. Os jovens exploram suas vivências para encontrar histórias autênticas que merecem ser contadas.',
    cor: '#D32F2F',
  },
  {
    num: 2,
    title: 'O Roteiro',
    desc: 'Transformar ideias em narrativa. Estrutura dramática, diálogos e construção de personagens.',
    cor: '#B71C1C',
  },
  {
    num: 3,
    title: 'A Pré-Produção',
    desc: 'Planejamento de tudo: locações, figurino, equipamentos, cronograma. Cada detalhe conta.',
    cor: '#1B5E20',
  },
  {
    num: 4,
    title: 'A Direção',
    desc: 'Liderar uma equipe, dirigir atores e tomar decisões criativas em tempo real.',
    cor: '#2E7D32',
  },
  {
    num: 5,
    title: 'A Fotografia e o Som',
    desc: 'Enquadramento, iluminação, captação de áudio. A linguagem visual ganha forma.',
    cor: '#388E3C',
  },
  {
    num: 6,
    title: 'A Edição',
    desc: 'Montar o filme, escolher ritmo, trilha sonora e dar ao material bruto sua forma final.',
    cor: '#B71C1C',
  },
  {
    num: 7,
    title: 'A Exibição',
    desc: 'O momento de mostrar ao mundo. Festivais, sessões comunitárias e o orgulho de ver seu filme na tela.',
    cor: '#D32F2F',
  },
]

export default function ComoFilmarPage() {
  return (
    <main className="page-metodo">
      {/* ─── Hero ─── */}
      <section className="metodo-hero">
        <div className="container">
          <p className="metodo-hero__label">Metodologia</p>
          <h1 className="metodo-hero__title">
            Como <span className="metodo-hero__accent">Filmar?</span>
          </h1>
          <p className="metodo-hero__sub">
            Os <strong>7 Atos</strong> que transformam jovens em cineastas — do ponto de partida
            à tela do festival.
          </p>
        </div>
      </section>

      {/* ─── 7 Atos timeline ─── */}
      <section className="section">
        <div className="container">
          <ol className="atos-timeline">
            {atos.map((ato) => (
              <li key={ato.num} className="ato-item">
                <div className="ato-item__connector">
                  <div
                    className="ato-item__dot"
                    style={{ background: ato.cor }}
                    aria-hidden="true"
                  />
                  <div className="ato-item__line" aria-hidden="true" />
                </div>
                <article className="ato-item__card">
                  <div
                    className="ato-item__badge"
                    style={{ color: ato.cor, borderColor: `${ato.cor}30` }}
                  >
                    <span className="ato-item__badge-label">Ato</span>
                    <strong className="ato-item__badge-num">{ato.num}</strong>
                  </div>
                  <div className="ato-item__body">
                    <h2 className="ato-item__title" style={{ color: ato.cor }}>
                      {ato.title}
                    </h2>
                    <p className="ato-item__desc">{ato.desc}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <style>{`
        /* ─── Hero ─── */
        .metodo-hero {
          padding-top: 120px;
          padding-bottom: 3.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .metodo-hero__label {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .metodo-hero__title {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.05;
          color: var(--color-text-primary);
          margin-bottom: 1.25rem;
        }

        .metodo-hero__accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .metodo-hero__sub {
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 55ch;
        }

        /* ─── Timeline ─── */
        .atos-timeline {
          list-style: none;
          padding: 0;
          margin: 0;
          max-width: 760px;
        }

        .ato-item {
          display: flex;
          gap: 1.75rem;
          position: relative;
        }

        .ato-item__connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 24px;
        }

        .ato-item__dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-top: 1.5rem;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px var(--color-bg-primary);
          transition: transform 0.2s ease;
        }

        .ato-item:hover .ato-item__dot {
          transform: scale(1.35);
        }

        .ato-item__line {
          flex: 1;
          width: 1px;
          background: var(--color-border);
          margin-top: 6px;
          margin-bottom: 0;
        }

        .ato-item:last-child .ato-item__line {
          display: none;
        }

        .ato-item__card {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding: 1.5rem 0 2.5rem;
          flex: 1;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .ato-item:last-child .ato-item__card {
          border-bottom: none;
          padding-bottom: 1.5rem;
        }

        .ato-item__badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 56px;
          padding: 0.6rem;
          border: 1.5px solid;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .ato-item__badge-label {
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .ato-item__badge-num {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          line-height: 1;
          margin-top: 0.1rem;
        }

        .ato-item__body { flex: 1; }

        .ato-item__title {
          font-family: var(--font-heading);
          font-size: clamp(1.15rem, 2vw, 1.4rem);
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .ato-item__desc {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
        }

        @media (max-width: 480px) {
          .ato-item__card {
            flex-direction: column;
            gap: 0.75rem;
          }

          .ato-item__badge { flex-direction: row; gap: 0.4rem; min-width: auto; padding: 0.4rem 0.75rem; }
          .ato-item__badge-num { font-size: 1.25rem; }
        }
      `}</style>
    </main>
  )
}
