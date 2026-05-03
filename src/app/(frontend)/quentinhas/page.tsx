import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Newspaper } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Quentinhas — Trakinagem Cine',
  description: 'Novidades, bastidores e material de imprensa do projeto Trakinagem Cine.',
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

function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media?.url || ''
}

export default async function QuentinhasPage() {
  const payload = await getPayloadClient()

  const { docs: posts } = await payload
    .find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
      depth: 1,
    })
    .catch(() => ({ docs: [] as any[] }))

  return (
    <main className="page-quentinhas">
      <section className="section page-header-section">
        <div className="container">
          <SectionHeader
            label="Novidades"
            title="Quentinhas"
            accent="Quentinhas"
            subtitle="Acompanhe as últimas notícias, bastidores e material de imprensa do Trakinagem Cine."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post: any) => (
                <Card
                  key={post.id}
                  title={post.title}
                  description={
                    typeof post.content === 'string' ? post.content.slice(0, 150) + '...' : ''
                  }
                  imageUrl={getMediaUrl(post.coverImage)}
                  imageAlt={post.coverImage?.alt || post.title}
                  href={`/quentinhas/${post.slug}`}
                  date={formatDate(post.publishedAt)}
                  tag={post.tags?.[0]?.tag}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon"><Newspaper size={48} strokeWidth={1.2} /></div>
              <h3 className="empty-state__title">Nenhuma quentinha ainda</h3>
              <p className="empty-state__text">
                Em breve publicaremos novidades sobre o projeto. Fique ligado!
              </p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .page-header-section {
          padding-top: 120px;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .posts-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state__icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          opacity: 0.4;
        }

        .empty-state__title {
          font-family: var(--font-heading);
          margin-bottom: 0.75rem;
        }

        .empty-state__text {
          color: var(--color-text-secondary);
          max-width: 40ch;
          margin: 0 auto;
        }
      `}</style>
    </main>
  )
}
