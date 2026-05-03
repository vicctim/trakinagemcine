import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 600

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload
    .find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  const post = docs[0]
  if (!post) return { title: 'Post não encontrado — Trakinagem Cine' }

  return {
    title: `${post.title} — Trakinagem Cine`,
    description:
      typeof post.content === 'string' ? post.content.slice(0, 160) : 'Quentinha do Trakinagem Cine',
    openGraph: {
      title: post.title,
      images: getMediaUrl(post.coverImage) ? [getMediaUrl(post.coverImage)] : [],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const post = docs[0]
  if (!post) notFound()

  const coverUrl = getMediaUrl(post.coverImage)

  return (
    <main className="page-post">
      <article>
        <header className="post-header">
          <div className="container container--narrow">
            <Link href="/quentinhas" className="post-header__back">
              ← Voltar às Quentinhas
            </Link>
            {(post.tags?.length ?? 0) > 0 && (
              <div className="post-header__tags">
                {(post.tags as any[]).map((t: any, i: number) => (
                  <span key={i} className="post-header__tag">
                    {t.tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="post-header__title">{post.title}</h1>
            <time className="post-header__date">{formatDate(post.publishedAt)}</time>
          </div>
        </header>

        {coverUrl && (
          <div className="post-cover container container--narrow">
            <Image
              src={coverUrl}
              alt={(post.coverImage as any)?.alt || post.title}
              width={1200}
              height={630}
              className="post-cover__image"
              priority
            />
          </div>
        )}

        <div className="post-body container container--narrow">
          {typeof post.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : post.content?.root?.children ? (
            <div className="rich-text">
              {/* Payload Lexical rich text → render as blocks */}
              {post.content.root.children.map((node: any, i: number) => {
                if (node.type === 'paragraph') {
                  const text = node.children
                    ?.map((c: any) => c.text || '')
                    .join('')
                  return text ? <p key={i}>{text}</p> : null
                }
                if (node.type === 'heading') {
                  const text = node.children?.map((c: any) => c.text || '').join('')
                  const Tag = (`h${node.tag || 2}`) as any
                  return <Tag key={i}>{text}</Tag>
                }
                return null
              })}
            </div>
          ) : (
            <p className="empty-content">Conteúdo em breve.</p>
          )}
        </div>

        {/* Press images */}
        {(post.pressImages as any[])?.length > 0 && (
          <section className="post-press container container--narrow">
            <h3>Imagens para download</h3>
            <div className="press-grid">
              {(post.pressImages as any[]).map((pi: any, i: number) => {
                const url = getMediaUrl(pi.image)
                if (!url) return null
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press-item"
                    download
                  >
                    <Image
                      src={url}
                      alt={pi.image?.alt || `Imagem ${i + 1}`}
                      width={300}
                      height={200}
                      className="press-item__image"
                    />
                    <span className="press-item__download">⬇ Baixar</span>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </article>

      <style>{`
        .page-post {
          padding-top: 100px;
        }

        .container--narrow {
          max-width: 780px;
        }

        .post-header {
          margin-bottom: 2.5rem;
        }

        .post-header__back {
          display: inline-block;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          text-decoration: none;
          margin-bottom: 2rem;
          transition: color 0.2s;
        }

        .post-header__back:hover {
          color: var(--color-accent);
        }

        .post-header__tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .post-header__tag {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-accent);
          background: rgba(211, 47, 47, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 3px;
        }

        .post-header__title {
          margin-bottom: 0.75rem;
        }

        .post-header__date {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .post-cover {
          margin-bottom: 2.5rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .post-cover__image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .post-body {
          margin-bottom: 3rem;
        }

        .post-body p {
          font-size: 1.05rem;
          line-height: 1.85;
          margin-bottom: 1.25rem;
        }

        .post-body h2,
        .post-body h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .empty-content {
          color: var(--color-text-muted);
          font-style: italic;
        }

        .post-press {
          border-top: 1px solid var(--color-border);
          padding-top: 2rem;
          margin-bottom: 3rem;
        }

        .post-press h3 {
          margin-bottom: 1.5rem;
        }

        .press-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .press-item {
          display: block;
          text-decoration: none;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          transition: border-color 0.2s;
        }

        .press-item:hover {
          border-color: var(--color-accent);
        }

        .press-item__image {
          width: 100%;
          height: auto;
          display: block;
        }

        .press-item__download {
          display: block;
          text-align: center;
          padding: 0.5rem;
          font-size: 0.8rem;
          color: var(--color-accent);
          font-weight: 500;
        }
      `}</style>
    </main>
  )
}
