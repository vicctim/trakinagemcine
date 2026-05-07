'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface CardProps {
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  href?: string
  tag?: string
  date?: string
  variant?: 'default' | 'film' | 'edition'
  children?: React.ReactNode
}

export function Card({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt = '',
  href,
  tag,
  date,
  variant = 'default',
  children,
}: CardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)

  const content = (
    <motion.article
      className={`card card--${variant}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {imageUrl && (
        <div className="card__image-wrap">
          {!imgLoaded && <div className="card__image-skeleton" aria-hidden="true" />}
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="card__image"
            onLoad={() => setImgLoaded(true)}
          />
          {tag && <span className="card__tag">{tag}</span>}
        </div>
      )}
      <div className="card__body">
        {date && <time className="card__date">{date}</time>}
        <h3 className="card__title">{title}</h3>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        {description && <p className="card__description">{description}</p>}
        {children}
      </div>

      <style>{`
        .card__link {
          text-decoration: none;
          display: block;
          height: 100%;
        }

        .card {
          background: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card:hover {
          border-color: var(--color-border-hover);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .card__image-wrap {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: var(--color-bg-secondary);
        }

        .card__image-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            var(--color-bg-secondary) 25%,
            var(--color-bg-tertiary, #e8e6e2) 50%,
            var(--color-bg-secondary) 75%
          );
          background-size: 200% 100%;
          animation: card-shimmer 1.5s infinite;
          z-index: 1;
        }

        @keyframes card-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .card--film .card__image-wrap {
          aspect-ratio: 2 / 3;
        }

        .card__image {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .card:hover .card__image {
          transform: scale(1.05);
        }

        .card__tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--color-accent);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 3px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .card__body {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card__date {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .card__title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 500;
          line-height: 1.3;
          color: var(--color-text-primary);
        }

        .card__subtitle {
          font-size: 0.85rem;
          color: var(--color-accent);
          font-weight: 500;
        }

        .card__description {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.article>
  )

  if (href) {
    return (
      <Link href={href} className="card__link">
        {content}
      </Link>
    )
  }

  return content
}
