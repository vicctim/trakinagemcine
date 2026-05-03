'use client'

import React, { useState, useCallback } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

function getYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] || url
}

export function YouTubeEmbed({ videoId, title = 'Vídeo' }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const id = getYouTubeId(videoId)

  const handleClick = useCallback(() => setLoaded(true), [])

  return (
    <div className="yt-embed" onClick={!loaded ? handleClick : undefined}>
      {!loaded ? (
        <>
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt={title}
            className="yt-embed__thumb"
            loading="lazy"
          />
          <button className="yt-embed__play" aria-label={`Assistir ${title}`}>
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="var(--color-accent)"
              />
              <path d="M45 24L27 14v20z" fill="var(--color-bg-primary)" />
            </svg>
          </button>
        </>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="yt-embed__iframe"
        />
      )}

      <style>{`
        .yt-embed {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: var(--color-bg-tertiary);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }

        .yt-embed__thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .yt-embed:hover .yt-embed__thumb {
          transform: scale(1.03);
        }

        .yt-embed__play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.85;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .yt-embed:hover .yt-embed__play {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .yt-embed__iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  )
}
