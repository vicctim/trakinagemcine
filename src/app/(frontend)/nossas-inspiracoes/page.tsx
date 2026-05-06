import React from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nossas Inspirações — Trakinagem Cine',
  description:
    'As referências, redes e iniciativas que inspiram e se conectam com o Trakinagem Cine. Conheça a Rede Kino e outros projetos de cinema educativo.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/nossas-inspiracoes`,
  },
}

const referencias = [
  {
    nome: 'Rede Kino',
    descricao:
      'Rede latino-americana de educação para a comunicação que reúne educadores e produtores audiovisuais comprometidos com o protagonismo juvenil através do cinema.',
    url: 'https://www.redekino.com.br',
  },
  {
    nome: 'Cinema sem Fronteiras',
    descricao:
      'Iniciativa que leva o cinema a regiões periféricas, promovendo sessões culturais, debates e produção audiovisual em comunidades afastadas dos circuitos tradicionais.',
    url: null,
  },
  {
    nome: 'Loucos por Cinema',
    descricao:
      'Projeto que une cinefilia e educação, formando jovens espectadores críticos e estimulando o olhar cinematográfico nas escolas públicas.',
    url: null,
  },
  {
    nome: 'É Tudo Verdade',
    descricao:
      'Festival Internacional de Documentários que inspira diretamente a curadoria do Trakinagem, valorizando narrativas reais e vozes marginalizadas.',
    url: 'https://www.etudoverdade.com.br',
  },
]

export default function NossasInspiracoes() {
  return (
    <main className="page-inspiracoes">
      <section className="section page-header-section">
        <div className="container container--narrow">
          <SectionHeader
            label="Referências"
            title="Nossas Inspirações"
            accent="Inspirações"
            subtitle="Projetos, redes e iniciativas que nos movem e com quem nos identificamos."
          />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="editorial-content">
            <h2>Por que o cinema transforma?</h2>
            <p>
              O Trakinagem Cine nasce da convicção de que narrar é um ato político. Quando um jovem
              pega uma câmera pela primeira vez e conta sua própria história, algo muda — nele, em
              quem assiste, e no espaço que os une. Somos herdeiros de uma tradição que acredita no
              audiovisual como ferramenta de leitura crítica do mundo.
            </p>

            <h2>Rede Kino e a educação para a comunicação</h2>
            <p>
              Nossa metodologia dialoga diretamente com a{' '}
              <a href="https://www.redekino.com.br" target="_blank" rel="noopener noreferrer">
                Rede Kino
              </a>
              , que há mais de duas décadas conecta educadores e realizadores audiovisuais em torno
              de uma proposta comum: usar o cinema como espaço de formação crítica, ética e estética.
              Seus princípios de protagonismo juvenil, leitura da imagem e produção colaborativa
              fundamentam cada ato do Trakinagem.
            </p>

            <h2>O que mais nos inspira</h2>
          </div>

          <div className="ref-grid">
            {referencias.map((ref) => (
              <article key={ref.nome} className="ref-card">
                <h3 className="ref-card__title">{ref.nome}</h3>
                <p className="ref-card__desc">{ref.descricao}</p>
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ref-card__link"
                  >
                    Visitar site →
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="editorial-content" style={{ marginTop: '3rem' }}>
            <h2>Faça parte também</h2>
            <p>
              Se você conhece projetos, organizações ou educadores que compartilham dessa visão,
              queremos nos conectar. O cinema é grande demais para ser feito sozinho.
            </p>
            <div className="editorial-cta">
              <Link href="/vamos-juntos" className="btn-primary">
                Vamos Juntos? →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 120px; }
        .container--narrow { max-width: 780px; }

        .editorial-content h2 {
          font-family: var(--font-heading);
          font-size: clamp(1.3rem, 2vw, 1.75rem);
          color: var(--color-accent);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }

        .editorial-content h2:first-child { margin-top: 0; }

        .editorial-content p {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--color-text-secondary);
          margin-bottom: 1.25rem;
        }

        .editorial-content a {
          color: var(--color-accent);
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: text-decoration-color 0.2s;
        }

        .editorial-content a:hover { text-decoration-color: currentColor; }

        .ref-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        @media (min-width: 640px) {
          .ref-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .ref-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.25rem;
          transition: border-color 0.2s;
        }

        .ref-card:hover { border-color: var(--color-border-hover); }

        .ref-card__title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          margin-bottom: 0.6rem;
          color: var(--color-text-primary);
        }

        .ref-card__desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin-bottom: 0.75rem;
        }

        .ref-card__link {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .ref-card__link:hover { opacity: 0.75; }

        .editorial-cta {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

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
      `}</style>
    </main>
  )
}
