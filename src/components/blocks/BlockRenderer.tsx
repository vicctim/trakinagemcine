import React from 'react'
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
      `}</style>
    </>
  )
}
