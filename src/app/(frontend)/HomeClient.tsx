'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface HomeClientProps {
  siteConfig: any
  posts: any[]
  filmes: any[]
  apoiadores: any[]
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export default function HomeClient({ siteConfig, posts, filmes, apoiadores }: HomeClientProps) {
  const heroParallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroParallaxRef.current) return
    let tween: any = null
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        tween = gsap.to(heroParallaxRef.current, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })
    return () => {
      tween?.scrollTrigger?.kill()
    }
  }, [])

  const heroTitle = siteConfig?.heroTitle || 'Cinema transforma vidas'
  const heroSubtitle =
    siteConfig?.heroSubtitle ||
    'Oficinas audiovisuais que ensinam jovens em situação de vulnerabilidade social a contar suas próprias histórias através do cinema.'
  const heroImageUrl = getMediaUrl(siteConfig?.heroImage)

  const tickerItems = [
    'NOVISUAIS', 'CINEMA INDEPENDENTE', 'EDUCAÇÃO E ARTE',
    'JUVENTUDE PROTAGONISTA', 'MINAS GERAIS', 'DESDE 2018',
    'OFICINAS AUDIOVISUAIS', 'CINEMA TRANSFORMA VIDAS',
  ]

  return (
    <>
      {/* ═══ TICKER (Editorial Theme Only) ═══ */}
      <div className="editorial-ticker" aria-hidden="true">
        <div className="editorial-ticker__track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="editorial-ticker__item">
              {item}
              <span className="editorial-ticker__sep">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        {heroImageUrl && (
          <div ref={heroParallaxRef} className="hero__parallax-wrap">
            <Image
              src={heroImageUrl}
              alt="Trakinagem Cine"
              fill
              priority
              className="hero__bg-image"
            />
          </div>
        )}
        <div className="hero__overlay" />
        <div className="hero__vignette" />
        <div className="hero__content container">
          <div className="hero__layout">
            <div className="hero__left">
              <ScrollReveal delay={0.2}>
                <p className="hero__label">Mostra de Cinema e Educação</p>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <h1 className="hero__title">
                  {heroTitle.includes('transforma') ? (
                    <>
                      Cinema
                      <br />
                      <span className="hero__title-accent">transforma</span> vidas
                    </>
                  ) : heroTitle.includes('vitrine') ? (
                    <>
                      Cinema não é{' '}
                      <em className="hero__title-accent">vitrine</em>,
                      <br />é{' '}
                      <em className="hero__title-accent">espelho</em>.
                    </>
                  ) : (
                    heroTitle
                  )}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.6}>
                <p className="hero__subtitle">{heroSubtitle}</p>
              </ScrollReveal>
              <ScrollReveal delay={0.8}>
                <div className="hero__actions">
                  <Link href="/nossos-filmes" className="hero__cta hero__cta--catalog">
                    Catálogo 2026
                  </Link>
                  <Link href="/bora-filmar" className="hero__cta-secondary hero__cta-secondary--outlined">
                    Bora Filmar! →
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Editorial: featured film card (shown only in editorial theme via CSS) */}
            {filmes[0] && (
              <div className="hero__featured-card">
                <div className="hero__featured-inner">
                  {getMediaUrl(filmes[0].capa) && (
                    <Image
                      src={getMediaUrl(filmes[0].capa)}
                      alt={filmes[0].titulo}
                      fill
                      className="hero__featured-img"
                    />
                  )}
                  <div className="hero__featured-overlay" />
                  <div className="hero__featured-content">
                    <div className="hero__featured-badges">
                      <span className="hero__featured-badge hero__featured-badge--year">{filmes[0].ano} · CURTA</span>
                    </div>
                    <h3 className="hero__featured-title">{filmes[0].titulo}</h3>
                    <p className="hero__featured-counter">
                      <span className="hero__featured-ep">Em destaque</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="hero__right" aria-hidden="true">
              <svg className="hero__geo" viewBox="0 0 400 460" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Vertical film strip lines */}
                <line x1="60" y1="20" x2="60" y2="440" stroke="#D32F2F" strokeWidth="1" strokeOpacity="0.18" />
                <line x1="100" y1="20" x2="100" y2="440" stroke="#D32F2F" strokeWidth="1" strokeOpacity="0.10" />
                <line x1="300" y1="20" x2="300" y2="440" stroke="#2E7D32" strokeWidth="1" strokeOpacity="0.12" />
                <line x1="340" y1="20" x2="340" y2="440" stroke="#2E7D32" strokeWidth="1" strokeOpacity="0.07" />
                {/* Film perforations */}
                {[40, 90, 140, 190, 240, 290, 340, 390].map((y) => (
                  <React.Fragment key={y}>
                    <rect x="46" y={y} width="28" height="22" rx="3" stroke="#D32F2F" strokeWidth="1.2" strokeOpacity="0.25" fill="none" />
                    <rect x="326" y={y} width="28" height="22" rx="3" stroke="#2E7D32" strokeWidth="1.2" strokeOpacity="0.2" fill="none" />
                  </React.Fragment>
                ))}
                {/* Big diagonal slash */}
                <line x1="130" y1="30" x2="280" y2="430" stroke="#1A1A1A" strokeWidth="0.8" strokeOpacity="0.06" />
                <line x1="160" y1="30" x2="310" y2="430" stroke="#1A1A1A" strokeWidth="0.8" strokeOpacity="0.04" />
                {/* Brand triangle (logo motif) */}
                <polygon points="190,140 260,260 120,260" fill="#D32F2F" fillOpacity="0.07" />
                <polygon points="220,180 290,300 150,300" fill="#2E7D32" fillOpacity="0.05" />
                {/* Frame box */}
                <rect x="110" y="100" width="180" height="240" rx="4" stroke="#1A1A1A" strokeWidth="0.8" strokeOpacity="0.05" fill="none" />
                {/* Center dot */}
                <circle cx="200" cy="230" r="4" fill="#D32F2F" fillOpacity="0.35" />
                <circle cx="200" cy="230" r="20" stroke="#D32F2F" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
              </svg>
            </div>
          </div>
        </div>
        <motion.div
          className="hero__scroll"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="hero__scroll-line" />
        </motion.div>
      </section>

      {/* ═══ NÚMEROS ═══ */}
      <section className="section section-alt numbers-section">
        <div className="container">
          <div className="numbers">
            <AnimatedCounter end={7} suffix="+" label="Temporadas" />
            <AnimatedCounter end={100} suffix="+" label="Jovens formados" />
            <AnimatedCounter end={20} suffix="+" label="Filmes produzidos" />
            <AnimatedCounter end={10} suffix="+" label="Prêmios" />
          </div>
        </div>
      </section>

      {/* ═══ SOBRE ═══ */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <SectionHeader
              label="Sobre o projeto"
              title="O que é o Trakinagem?"
              accent="Trakinagem"
            />
          </ScrollReveal>
          <div className="about-grid">
            <ScrollReveal delay={0.2}>
              <p className="about-text">
                O Trakinagem Cine é um projeto que vai além do audiovisual — é uma ferramenta de
                transformação social. Através de oficinas práticas de cinema, jovens aprendem a
                operar câmeras, escrever roteiros, dirigir e editar seus próprios curtas-metragens.
              </p>
              <p className="about-text">
                Idealizado por Marcelo Mamede, o projeto já formou mais de 100 jovens em situação de
                vulnerabilidade, produzindo filmes premiados em festivais nacionais e internacionais.
              </p>
              <Link href="/bora-filmar" className="about-link">
                Conheça a metodologia →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ ÚLTIMAS QUENTINHAS ═══ */}
      {posts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <ScrollReveal>
              <SectionHeader
                label="Novidades"
                title="Últimas Quentinhas"
                accent="Quentinhas"
                subtitle="Acompanhe as notícias e bastidores do projeto."
              />
            </ScrollReveal>
            <div className="posts-grid">
              {posts.map((post: any, i: number) => (
                <ScrollReveal key={post.id} delay={i * 0.15}>
                  <Card
                    title={post.title}
                    description={
                      typeof post.content === 'string'
                        ? post.content.slice(0, 120) + '...'
                        : ''
                    }
                    imageUrl={getMediaUrl(post.coverImage)}
                    imageAlt={post.coverImage?.alt || post.title}
                    href={`/quentinhas/${post.slug}`}
                    date={formatDate(post.publishedAt)}
                    tag={post.tags?.[0]?.tag}
                  />
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.3}>
              <div className="section-cta">
                <Link href="/quentinhas" className="about-link">
                  Ver todas as quentinhas →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ═══ NOSSOS FILMES ═══ */}
      {filmes.length > 0 && (
        <section className="section">
          <div className="container">
            <ScrollReveal>
              <SectionHeader
                label="Filmografia"
                title="Nossos Filmes"
                accent="Filmes"
                subtitle="Curtas-metragens produzidos pelos jovens nas oficinas."
              />
            </ScrollReveal>
            <div className="filmes-grid">
              {filmes.map((filme: any, i: number) => (
                <ScrollReveal key={filme.id} delay={i * 0.12}>
                  <Card
                    title={filme.titulo}
                    subtitle={`${filme.ano}${filme.duracao ? ` · ${filme.duracao}` : ''}`}
                    description={filme.sinopse}
                    imageUrl={getMediaUrl(filme.capa)}
                    imageAlt={filme.capa?.alt || filme.titulo}
                    variant="film"
                  />
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.3}>
              <div className="section-cta">
                <Link href="/nossos-filmes" className="about-link">
                  Ver todos os filmes →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ═══ APOIADORES ═══ */}
      {apoiadores.length > 0 && (
        <section className="section section-alt apoiadores-section">
          {/* Editorial: "Rede de Apoio" split layout */}
          <div className="apoiadores-editorial">
            <div className="apoiadores-editorial__left">
              <p className="apoiadores-editorial__label"># Quem caminha junto</p>
              <h2 className="apoiadores-editorial__title">
                Rede de<br /><em>Apoio</em>.
              </h2>
              <p className="apoiadores-editorial__desc">
                O Trakinagem é mantido por uma rede de patrocinadores, parceiros e instituições que acreditam na cultura como base da transformação social.
              </p>
              <Link href="/vamos-juntos" className="apoiadores-editorial__btn">
                Seja um apoiador →
              </Link>
            </div>
            <div className="apoiadores-editorial__right">
              {['lei_incentivo', 'patrocinador', 'apoiador', 'parceiro'].map((cat) => {
                const items = apoiadores.filter((a: any) => a.categoria === cat)
                if (!items.length) return null
                const labels: Record<string, string> = {
                  lei_incentivo: 'Patrocínio',
                  patrocinador: 'Realização',
                  apoiador: 'Apoio Institucional',
                  parceiro: 'Parceiros',
                }
                return (
                  <div key={cat} className="apoiadores-editorial__cat">
                    <span className="apoiadores-editorial__cat-label">{labels[cat]}</span>
                    <div className="apoiadores-editorial__cat-names">
                      {items.map((a: any) => <span key={a.id}>{a.nome}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Default: logo grid */}
          <div className="container apoiadores-default">
            <ScrollReveal>
              <SectionHeader
                label="Quem acredita no cinema"
                title="Apoiadores"
                accent="Apoiadores"
                align="center"
              />
            </ScrollReveal>
            <div className="apoiadores-grid">
              {apoiadores.map((apoiador: any, i: number) => {
                const logoUrl = getMediaUrl(apoiador.logo)
                if (!logoUrl) return null
                return (
                  <ScrollReveal key={apoiador.id} delay={i * 0.08}>
                    <div className="apoiador-logo" title={apoiador.nome}>
                      <Image
                        src={logoUrl}
                        alt={apoiador.nome}
                        width={140}
                        height={60}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="section cta-section">
        <div className="container">
          <ScrollReveal direction="up">
            <div className="cta-box">
              <p className="cta-box__label"># Vamos juntos</p>
              <h2 className="cta-box__title">
                Quer apoiar o <span className="cta-highlight">cinema</span> que{' '}
                <em className="cta-highlight">transforma</em>?
              </h2>
              <p className="cta-box__text">
                Conheça as formas de participar do Trakinagem Cine como apoiador, parceiro ou
                padrinho de uma edição.
              </p>
              <Link href="/vamos-juntos" className="hero__cta cta-section__btn">
                Entrar em Contato →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        /* ═══ HERO ═══ */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--color-bg-primary);
          overflow: hidden;
        }

        .hero__parallax-wrap {
          position: absolute;
          inset: -30% 0;
          will-change: transform;
          z-index: 0;
        }

        .hero__bg-image {
          object-fit: cover;
          z-index: 0;
        }

        .hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to right,
            rgba(250, 250, 248, 0.95) 0%,
            rgba(250, 250, 248, 0.7) 50%,
            rgba(250, 250, 248, 0.4) 100%
          );
        }

        .hero__vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(
            ellipse at 30% 50%,
            rgba(211, 47, 47, 0.05) 0%,
            transparent 60%
          );
        }

        .hero__content {
          position: relative;
          z-index: 2;
          padding-top: 120px;
          width: 100%;
        }

        .hero__layout {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .hero__left {
          flex: 1 1 55%;
          min-width: 0;
        }

        .hero__right {
          flex: 0 0 42%;
          display: none;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 900px) {
          .hero__right { display: flex; }
        }

        .hero__geo {
          width: 100%;
          max-width: 380px;
          height: auto;
          animation: geo-float 8s ease-in-out infinite;
        }

        @keyframes geo-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }

        .hero__label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }

        .hero__title {
          margin-bottom: 1.5rem;
          color: var(--color-text-primary);
        }

        .hero__title-accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .hero__subtitle {
          font-size: 1.15rem;
          max-width: 50ch;
          margin-bottom: 2.5rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        .hero__actions {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .hero__cta {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 2rem;
          background: var(--color-accent);
          color: var(--color-bg-primary);
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }

        .hero__cta:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(211, 47, 47, 0.3);
          color: #fff;
        }

        .hero__cta-secondary {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .hero__cta-secondary:hover {
          color: var(--color-accent);
        }

        /* CTA label hidden in default theme */
        .cta-box__label { display: none; }

        .hero__scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .hero__scroll-line {
          display: block;
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--color-accent), transparent);
        }

        /* ═══ NUMBERS ═══ */
        .numbers {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .numbers {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* ═══ ABOUT ═══ */
        .about-text {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }

        .about-link {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .about-link:hover {
          opacity: 0.8;
        }

        /* ═══ GRIDS ═══ */
        .posts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .posts-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .filmes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .filmes-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .section-cta {
          text-align: center;
          margin-top: 2.5rem;
        }

        /* ═══ APOIADORES ═══ */
        .apoiadores-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          align-items: center;
        }

        .apoiador-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          opacity: 0.45;
          transition: opacity 0.3s ease;
          filter: grayscale(80%);
        }

        .apoiador-logo:hover {
          opacity: 1;
          filter: grayscale(0%);
        }

        /* ═══ CTA ═══ */
        .cta-section {
          background: var(--color-bg-primary);
        }

        .cta-box {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-box__title {
          margin-bottom: 1.25rem;
          color: var(--color-text-primary);
        }

        .cta-highlight {
          color: var(--color-accent);
        }

        .cta-box__text {
          font-size: 1.05rem;
          margin-bottom: 2rem;
          max-width: 50ch;
          margin-left: auto;
          margin-right: auto;
          color: var(--color-text-secondary);
        }
      `}</style>
    </>
  )
}
