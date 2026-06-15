import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { FooterLogosBar } from '@/components/layout/Footer'
import { LexicalContent } from './LexicalContent'
import { GalleryGrid } from './GalleryGrid'
import { getMediaUrl } from '@/lib/seo'

export function BlockRenderer({ blocks }: { blocks?: any[] | null }) {
  if (!Array.isArray(blocks)) return null

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'heroSection':
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  <ScrollReveal>
                    <SectionHeader
                      label={block.label}
                      title={block.title}
                      subtitle={block.subtitle}
                      accent={block.accent}
                      align={block.align}
                    />
                  </ScrollReveal>
                </div>
              </section>
            )

          case 'richText':
            return (
              <section key={block.id || i} className="section">
                <div className="container pb-richtext">
                  <ScrollReveal>
                    <LexicalContent content={block.content} />
                  </ScrollReveal>
                </div>
              </section>
            )

          case 'cardsGrid':
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  {(block.title || block.label) && (
                    <ScrollReveal>
                      <SectionHeader label={block.label} title={block.title} subtitle={block.subtitle} />
                    </ScrollReveal>
                  )}
                  <div className="pb-cards-grid">
                    {(block.items || []).map((item: any, j: number) => (
                      <ScrollReveal key={item.id || j} delay={j * 0.1}>
                        <Card
                          title={item.title}
                          subtitle={item.subtitle}
                          description={item.description}
                          imageUrl={getMediaUrl(item.image)}
                          imageAlt={item.image?.alt || item.title}
                          href={item.href}
                          tag={item.tag}
                          date={item.date}
                          variant={block.variant}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>
            )

          case 'gallery':
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  <GalleryGrid title={block.title} images={block.images} />
                </div>
              </section>
            )

          case 'video':
            return (
              <section key={block.id || i} className="section">
                <div className="container pb-richtext">
                  <ScrollReveal>
                    <YouTubeEmbed videoId={block.url} title={block.title} />
                  </ScrollReveal>
                </div>
              </section>
            )

          case 'counters':
            return (
              <section key={block.id || i} className="section section-alt">
                <div className="container">
                  {block.title && (
                    <ScrollReveal>
                      <SectionHeader title={block.title} align="center" />
                    </ScrollReveal>
                  )}
                  <div className="pb-counters-grid">
                    {(block.items || []).map((item: any, j: number) => (
                      <AnimatedCounter
                        key={item.id || j}
                        end={item.end}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        label={item.label}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )

          case 'logos':
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  <FooterLogosBar logosRodape={block} label={block.label} />
                </div>
              </section>
            )

          case 'image': {
            const imgUrl = getMediaUrl(block.image)
            if (!imgUrl) return null
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  <ScrollReveal>
                    <figure
                      className={`pb-image pb-image--${block.size || 'full'} pb-image--align-${block.align || 'center'}`}
                    >
                      <div className="pb-image__frame">
                        <Image
                          src={imgUrl}
                          alt={block.alt || block.image?.alt || ''}
                          fill
                          sizes="(min-width: 768px) 60vw, 100vw"
                        />
                      </div>
                      {block.caption && <figcaption className="pb-image__caption">{block.caption}</figcaption>}
                    </figure>
                  </ScrollReveal>
                </div>
              </section>
            )
          }

          case 'buttons':
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  {block.title && (
                    <ScrollReveal>
                      <SectionHeader title={block.title} align={block.align === 'center' ? 'center' : 'left'} />
                    </ScrollReveal>
                  )}
                  <div className={`pb-buttons pb-buttons--${block.align || 'left'}`}>
                    {(block.buttons || []).map((btn: any, j: number) => (
                      <Button key={j} href={btn.href} variant={btn.variant} external={btn.externo}>
                        {btn.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>
            )

          case 'links':
            return (
              <section key={block.id || i} className="section">
                <div className="container pb-richtext">
                  {block.title && (
                    <ScrollReveal>
                      <SectionHeader title={block.title} />
                    </ScrollReveal>
                  )}
                  <ul className="pb-links">
                    {(block.links || []).map((link: any, j: number) => {
                      const isExternal = link.externo || /^https?:\/\//.test(link.href || '')
                      return (
                        <li key={j} className="pb-links__item">
                          {isExternal ? (
                            <a href={link.href} target="_blank" rel="noopener noreferrer">
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href}>{link.label}</Link>
                          )}
                          {link.description && <span className="pb-links__desc">{link.description}</span>}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            )

          case 'banner': {
            const bannerUrl = getMediaUrl(block.image)
            return (
              <section key={block.id || i} className={`pb-banner pb-banner--overlay-${block.overlay || 'dark'}`}>
                {bannerUrl && (
                  <Image src={bannerUrl} alt={block.image?.alt || block.title || ''} fill sizes="100vw" />
                )}
                <div className="pb-banner__content container">
                  <ScrollReveal>
                    <h2>{block.title}</h2>
                    {block.subtitle && <p>{block.subtitle}</p>}
                    {block.ctaText && block.ctaHref && (
                      <Button href={block.ctaHref} external={block.ctaExterno}>
                        {block.ctaText}
                      </Button>
                    )}
                  </ScrollReveal>
                </div>
              </section>
            )
          }

          case 'columns':
            return (
              <section key={block.id || i} className="section">
                <div className="container">
                  {block.title && (
                    <ScrollReveal>
                      <SectionHeader title={block.title} align="center" />
                    </ScrollReveal>
                  )}
                  <div
                    className="pb-columns"
                    style={{ '--pb-columns-count': (block.columns || []).length } as React.CSSProperties}
                  >
                    {(block.columns || []).map((col: any, j: number) => {
                      const colImgUrl = getMediaUrl(col.image)
                      return (
                        <ScrollReveal key={j} delay={j * 0.1}>
                          <div className="pb-columns__item">
                            {colImgUrl && (
                              <div className="pb-columns__image">
                                <Image
                                  src={colImgUrl}
                                  alt={col.image?.alt || col.title || ''}
                                  fill
                                  sizes="(min-width: 768px) 25vw, 100vw"
                                />
                              </div>
                            )}
                            {col.title && <h3>{col.title}</h3>}
                            <LexicalContent content={col.content} />
                          </div>
                        </ScrollReveal>
                      )
                    })}
                  </div>
                </div>
              </section>
            )

          case 'callToAction':
            return (
              <section key={block.id || i} className="section">
                <div className={`container pb-cta pb-cta--${block.align || 'left'}`}>
                  <Button href={block.href} variant={block.variant} external={block.externo}>
                    {block.text}
                  </Button>
                </div>
              </section>
            )

          default:
            return null
        }
      })}

      <style>{`
        .pb-richtext {
          max-width: 780px;
        }

        .pb-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .pb-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .pb-counters-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          text-align: center;
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .pb-counters-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .pb-cta {
          display: flex;
        }

        .pb-cta--center {
          justify-content: center;
        }

        .pb-cta--left {
          justify-content: flex-start;
        }

        .pb-image {
          margin: 0 auto;
        }

        .pb-image--full {
          width: 100%;
        }

        .pb-image--medium {
          width: 100%;
          max-width: 600px;
        }

        .pb-image--small {
          width: 100%;
          max-width: 360px;
        }

        .pb-image--align-left {
          margin-left: 0;
          margin-right: auto;
        }

        .pb-image--align-right {
          margin-left: auto;
          margin-right: 0;
        }

        .pb-image__frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
        }

        .pb-image__frame img {
          object-fit: cover;
        }

        .pb-image__caption {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          text-align: center;
        }

        .pb-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .pb-buttons--center {
          justify-content: center;
        }

        .pb-buttons--left {
          justify-content: flex-start;
        }

        .pb-links {
          list-style: none;
          margin: 1.5rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pb-links__item a {
          color: var(--color-accent);
          font-weight: 600;
          text-decoration: none;
        }

        .pb-links__item a:hover {
          text-decoration: underline;
        }

        .pb-links__desc {
          display: block;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .pb-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 360px;
          overflow: hidden;
          text-align: center;
          color: #fff;
        }

        .pb-banner img {
          object-fit: cover;
        }

        .pb-banner--overlay-dark::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .pb-banner--overlay-gradient::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
        }

        .pb-banner__content {
          position: relative;
          z-index: 1;
        }

        .pb-banner__content p {
          margin: 1rem 0;
        }

        .pb-columns {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .pb-columns {
            grid-template-columns: repeat(var(--pb-columns-count, 2), 1fr);
          }
        }

        .pb-columns__image {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .pb-columns__image img {
          object-fit: cover;
        }
      `}</style>
    </>
  )
}
