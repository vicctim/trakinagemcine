'use client'

import React from 'react'
import Image from 'next/image'
import { Lightbox, useLightbox } from '@/components/ui/Lightbox'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getMediaUrl } from '@/lib/seo'

export function GalleryGrid({ title, images }: { title?: string; images?: Array<{ image: any }> }) {
  const lightbox = useLightbox()

  const items = (images || [])
    .map((item) => ({
      url: getMediaUrl(item.image),
      alt: item.image?.alt || title || 'Imagem da galeria',
    }))
    .filter((item) => item.url)

  if (items.length === 0) return null

  return (
    <div>
      {title && <SectionHeader title={title} align="center" />}

      <div className="gallery-grid">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            className="gallery-grid__item"
            onClick={() => lightbox.open(i)}
            aria-label={`Ampliar imagem ${i + 1}`}
          >
            <Image src={item.url} alt={item.alt} fill sizes="(min-width: 768px) 25vw, 50vw" />
          </button>
        ))}
      </div>

      <Lightbox images={items} initialIndex={lightbox.index} isOpen={lightbox.isOpen} onClose={lightbox.close} />

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .gallery-grid__item {
          position: relative;
          aspect-ratio: 1;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          border-radius: 8px;
        }

        .gallery-grid__item img {
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .gallery-grid__item:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
