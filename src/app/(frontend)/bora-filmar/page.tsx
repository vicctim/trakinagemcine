import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bora Filmar! — Trakinagem Cine',
  description:
    'Conheça o Trakinagem Cine: projeto que ensina jovens em vulnerabilidade social a fazer cinema.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://trakinagemcine.victorsamuel.com.br'}/bora-filmar`,
  },
}

const facts = [
  { value: '7+', label: 'Temporadas realizadas' },
  { value: '100+', label: 'Jovens formados' },
  { value: '20+', label: 'Curtas produzidos' },
  { value: '10+', label: 'Prêmios em festivais' },
]

export default function BoraFilmarPage() {
  return (
    <main className="page-bora">
      {/* ─── Hero titular ─── */}
      <section className="bora-hero">
        <div className="container bora-hero__container">
          <div className="bora-hero__content">
            <p className="bora-hero__label">O Projeto</p>
            <h1 className="bora-hero__title">
              Bora
              <br />
              <span className="bora-hero__accent">Filmar!</span>
            </h1>
            <p className="bora-hero__sub">
              Conheça a história, a missão e o impacto do Trakinagem Cine.
            </p>
          </div>
          <div className="bora-hero__facts" aria-label="Números do projeto">
            {facts.map((f) => (
              <div key={f.label} className="fact-item">
                <span className="fact-item__value">{f.value}</span>
                <span className="fact-item__label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Editorial 2 colunas ─── */}
      <section className="section">
        <div className="container bora-body">

          {/* Main content */}
          <div className="bora-editorial">
            <h2>O que é o Trakinagem Cine?</h2>
            <p>
              O Trakinagem Cine é um projeto cultural e educativo que utiliza o audiovisual como
              ferramenta de transformação social. Através de oficinas práticas de cinema, jovens em
              situação de vulnerabilidade aprendem a contar suas próprias histórias — da ideia ao
              curta-metragem exibido em festival.
            </p>

            <h2>Nossa Missão</h2>
            <p>
              Acreditamos que o cinema é uma linguagem poderosa para desenvolver pensamento crítico,
              criatividade e protagonismo em jovens que, muitas vezes, não têm acesso a atividades
              culturais. Cada temporada do Trakinagem forma uma turma que percorre todo o processo
              cinematográfico: da escrita ao palco de premiação.
            </p>

            <h2>Como Funciona</h2>
            <p>
              As oficinas são divididas em 7 atos, baseados na metodologia desenvolvida por Marcelo
              Mamede. Os jovens percorrem todo o processo de criação: ideia, roteiro, direção,
              fotografia, som, edição e exibição.
            </p>

            <div className="bora-cta-row">
              <Link href="/como-filmar" className="btn-primary">
                Conheça os 7 Atos →
              </Link>
              <Link href="/timeline" className="btn-ghost">
                Ver Histórico
              </Link>
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="bora-sidebar">
            <div className="bora-sidebar__card">
              <h3 className="bora-sidebar__title">Quem idealiza</h3>
              <p className="bora-sidebar__text">
                <strong>Marcelo Mamede</strong> — realizador audiovisual e educador social.
                Desenvolveu a metodologia dos 7 Atos ao longo de anos de prática com jovens em
                situação de vulnerabilidade.
              </p>
            </div>
            <div className="bora-sidebar__card">
              <h3 className="bora-sidebar__title">Onde acontece</h3>
              <p className="bora-sidebar__text">
                As oficinas acontecem em espaços culturais e escolas públicas,
                levando o cinema onde ele ainda não chegou.
              </p>
            </div>
            <div className="bora-sidebar__card bora-sidebar__card--cta">
              <h3 className="bora-sidebar__title">Apoie o projeto</h3>
              <p className="bora-sidebar__text">
                Empresas, instituições e pessoas físicas podem colaborar com o Trakinagem.
              </p>
              <Link href="/vamos-juntos" className="btn-primary btn-primary--sm">
                Vamos Juntos? →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        /* ─── Hero ─── */
        .bora-hero {
          padding-top: 120px;
          padding-bottom: 4rem;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
        }

        .bora-hero__container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .bora-hero__label {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .bora-hero__title {
          font-family: var(--font-heading);
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 1;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }

        .bora-hero__accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .bora-hero__sub {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          max-width: 40ch;
        }

        .bora-hero__facts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem 2rem;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .bora-hero {
            padding-top: 96px;
            padding-bottom: 3rem;
          }

          .bora-hero__container {
            align-items: flex-start;
            gap: 2rem;
          }

          .bora-hero__facts {
            width: 100%;
            flex-shrink: 1;
            gap: 1rem;
          }
        }

        @media (max-width: 420px) {
          .bora-hero__facts {
            grid-template-columns: 1fr;
          }
        }

        .fact-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .fact-item__value {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 500;
          color: var(--color-accent);
          line-height: 1;
        }

        .fact-item__label {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ─── Body ─── */
        .bora-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        @media (min-width: 900px) {
          .bora-body {
            grid-template-columns: 1fr 340px;
            gap: 5rem;
            align-items: start;
          }
        }

        /* ─── Editorial ─── */
        .bora-editorial h2 {
          font-family: var(--font-heading);
          font-size: clamp(1.3rem, 2.5vw, 1.6rem);
          color: var(--color-accent);
          margin-top: 2.5rem;
          margin-bottom: 0.85rem;
        }

        .bora-editorial h2:first-child { margin-top: 0; }

        .bora-editorial p {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--color-text-secondary);
          margin-bottom: 1rem;
          max-width: none;
        }

        .bora-cta-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
        }

        /* ─── Sidebar ─── */
        .bora-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bora-sidebar__card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.25rem;
        }

        .bora-sidebar__card--cta {
          background: var(--color-accent-soft);
          border-color: rgba(211, 47, 47, 0.2);
        }

        .bora-sidebar__title {
          font-family: var(--font-heading);
          font-size: 1rem;
          color: var(--color-text-primary);
          margin-bottom: 0.6rem;
        }

        .bora-sidebar__text {
          font-size: 0.875rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
          margin-bottom: 1rem;
          max-width: none;
        }

        .bora-sidebar__text:last-child { margin-bottom: 0; }

        /* ─── Buttons ─── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.8rem 1.75rem;
          background: var(--color-accent);
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(211, 47, 47, 0.3);
          color: #fff;
        }

        .btn-primary--sm {
          padding: 0.6rem 1.25rem;
          font-size: 0.82rem;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 0.8rem 1.25rem;
          background: transparent;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-ghost:hover {
          border-color: var(--color-border-hover);
          color: var(--color-text-primary);
        }
      `}</style>
    </main>
  )
}
