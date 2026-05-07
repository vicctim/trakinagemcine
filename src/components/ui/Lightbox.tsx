'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface LightboxImage {
  url: string
  alt: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const closeRef = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + images.length) % images.length)
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, images.length, onClose])

  const goNext = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length],
  )
  const goPrev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  )

  if (!images.length) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de imagens"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <span className="lightbox__sr-announce" aria-live="polite" aria-atomic="true">
            {images[currentIndex]?.alt
              ? `${images[currentIndex].alt} — ${currentIndex + 1} de ${images.length}`
              : `Imagem ${currentIndex + 1} de ${images.length}`}
          </span>
          <button ref={closeRef} className="lightbox__close" onClick={onClose} aria-label="Fechar galeria">
            ✕
          </button>

          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="lightbox__image-wrap"
            >
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                fill
                sizes="90vw"
                className="lightbox__image"
                priority
              />
            </motion.div>
          </div>

          {images.length > 1 && (
            <>
              <button className="lightbox__nav lightbox__nav--prev" onClick={goPrev} aria-label="Anterior">
                ‹
              </button>
              <button className="lightbox__nav lightbox__nav--next" onClick={goNext} aria-label="Próxima">
                ›
              </button>
              <div className="lightbox__counter">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          <style>{`
            .lightbox {
              position: fixed;
              inset: 0;
              z-index: 9998;
              background: rgba(0, 0, 0, 0.92);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }

            .lightbox__close {
              position: absolute;
              top: 1.25rem;
              right: 1.5rem;
              background: none;
              border: none;
              color: var(--color-text-primary);
              font-size: 1.5rem;
              cursor: pointer;
              z-index: 10;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.7;
              transition: opacity 0.2s;
            }

            .lightbox__close:hover {
              opacity: 1;
            }

            .lightbox__content {
              width: 90vw;
              height: 80vh;
              position: relative;
              cursor: default;
            }

            .lightbox__image-wrap {
              position: relative;
              width: 100%;
              height: 100%;
            }

            .lightbox__image {
              object-fit: contain;
            }

            .lightbox__nav {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              background: rgba(255, 255, 255, 0.08);
              border: none;
              color: var(--color-text-primary);
              font-size: 2.5rem;
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              border-radius: 50%;
              opacity: 0.6;
              transition: opacity 0.2s, background 0.2s;
              z-index: 10;
            }

            .lightbox__nav:hover {
              opacity: 1;
              background: rgba(255, 255, 255, 0.15);
            }

            .lightbox__nav--prev {
              left: 1rem;
            }

            .lightbox__nav--next {
              right: 1rem;
            }

            .lightbox__counter {
              position: absolute;
              bottom: 1.5rem;
              left: 50%;
              transform: translateX(-50%);
              color: var(--color-text-muted);
              font-size: 0.85rem;
              letter-spacing: 0.1em;
            }

            .lightbox__sr-announce {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0,0,0,0);
              white-space: nowrap;
              border: 0;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Hook to manage lightbox state */
export function useLightbox() {
  const [state, setState] = useState<{ isOpen: boolean; index: number }>({
    isOpen: false,
    index: 0,
  })

  const open = useCallback((index: number) => setState({ isOpen: true, index }), [])
  const close = useCallback(() => setState({ isOpen: false, index: 0 }), [])

  return { ...state, open, close }
}
