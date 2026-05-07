import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Newspaper } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quentinhas — Trakinagem Cine',
  description: 'Novidades, bastidores e material de imprensa do projeto Trakinagem Cine.',
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…'
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
                    typeof post.content === 'string' ? truncate(post.content, 150) : ''
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
            <EmptyState
              icon={<Newspaper size={48} strokeWidth={1.2} />}
              title="Nenhuma quentinha ainda"
              description="Em breve publicaremos novidades sobre o projeto. Fique ligado!"
            />
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


      `}</style>
    </main>
  )
}
