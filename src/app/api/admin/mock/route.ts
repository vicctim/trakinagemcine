import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { cookies } from 'next/headers'

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has('payload-token')
}

// POST /api/admin/mock — inserts mock data
export async function POST(_req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  // Find any existing media to use as placeholder for required image fields
  const { docs: mediaList } = await payload.find({ collection: 'media', limit: 1, depth: 0 })
  const placeholderMedia = mediaList[0]?.id ?? null

  if (!placeholderMedia) {
    return NextResponse.json(
      { error: 'Envie ao menos uma imagem na biblioteca de Mídia antes de inserir dados mock.' },
      { status: 422 },
    )
  }

  const results: Record<string, number> = {}

  // ── Edições ──────────────────────────────────────────────────────────────
  const edicaoMock1 = await payload.create({
    collection: 'edicoes',
    data: {
      titulo: '[MOCK] 8ª Temporada — A Cidade que Grita',
      slug: 'mock-8a-temporada',
      ano: 2026,
      status: 'ativa',
      resumo: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Oito anos de cinema transformando vidas. Esta temporada explorou as vozes silenciadas da cidade através de 12 jovens realizadores.', version: 1 }],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      imagemCapa: placeholderMedia,
      isMock: true,
    } as any,
  })

  const edicaoMock2 = await payload.create({
    collection: 'edicoes',
    data: {
      titulo: '[MOCK] 7ª Temporada — Raízes e Asfalto',
      slug: 'mock-7a-temporada',
      ano: 2025,
      status: 'arquivada',
      resumo: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Uma exploração poética das raízes culturais de jovens da periferia em contraste com o asfalto das grandes cidades.', version: 1 }],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      imagemCapa: placeholderMedia,
      isMock: true,
    } as any,
  })

  results.edicoes = 2

  // ── Apoiadores ────────────────────────────────────────────────────────────
  const apoiadores = await Promise.all([
    payload.create({
      collection: 'apoiadores',
      data: { nome: '[MOCK] Fundo Cultural Municipal', logo: placeholderMedia, categoria: 'lei_incentivo', isMock: true } as any,
    }),
    payload.create({
      collection: 'apoiadores',
      data: { nome: '[MOCK] Instituto Jovens do Futuro', logo: placeholderMedia, categoria: 'patrocinador', isMock: true } as any,
    }),
    payload.create({
      collection: 'apoiadores',
      data: { nome: '[MOCK] Rádio Comunitária FM 98', logo: placeholderMedia, categoria: 'apoiador', isMock: true } as any,
    }),
    payload.create({
      collection: 'apoiadores',
      data: { nome: '[MOCK] Rede Kino Brasil', logo: placeholderMedia, categoria: 'parceiro', isMock: true } as any,
    }),
  ])
  results.apoiadores = apoiadores.length

  // ── Filmes ────────────────────────────────────────────────────────────────
  const filmeTitles = [
    { titulo: 'O Último Sinal', sinopse: 'Três jovens descobrem que o sinal de televisão de seu bairro ainda transmite mensagens de uma rádio comunitária extinta há 20 anos.' },
    { titulo: 'Margem Livre', sinopse: 'Uma garota de 16 anos documenta a transformação do córrego que passa pela sua rua, onde ela cresceu pescando com o avô.' },
    { titulo: 'Vozes do Asfalto', sinopse: 'Um grupo de MC\'s periféricos luta para gravar seu primeiro álbum usando equipamentos emprestados de uma biblioteca pública.' },
    { titulo: 'A Casa da Lona', sinopse: 'Dentro de uma lona improvisada numa praça ocupada, uma família reinventa o conceito de lar enquanto aguarda realocação.' },
  ]

  const filmesCreated = await Promise.all(
    filmeTitles.map((f, i) =>
      payload.create({
        collection: 'filmes',
        data: {
          titulo: `[MOCK] ${f.titulo}`,
          slug: `mock-filme-${i + 1}`,
          sinopse: f.sinopse,
          capa: placeholderMedia,
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          edicao: edicaoMock1.id,
          ano: 2026,
          duracao: `${8 + i * 3} min`,
          isMock: true,
        } as any,
      }),
    ),
  )
  results.filmes = filmesCreated.length

  // ── Prêmios ───────────────────────────────────────────────────────────────
  const premiosData = [
    { festival: 'Festival de Cinema de Brasília', categoria: 'Melhor Curta Metragem', resultado: 'premiado' },
    { festival: 'Mostra Olhar de Cinema', categoria: 'Seleção Oficial', resultado: 'selecionado' },
    { festival: 'Festival Visões Periféricas', categoria: 'Melhor Direção', resultado: 'premiado' },
  ]

  const premiosCreated = await Promise.all(
    premiosData.map((p) =>
      payload.create({
        collection: 'premios',
        data: {
          nomeDoFestival: `[MOCK] ${p.festival}`,
          categoria: p.categoria,
          resultado: p.resultado,
          anoDoEvento: 2025,
          filme: filmesCreated[0].id,
          isMock: true,
        } as any,
      }),
    ),
  )
  results.premios = premiosCreated.length

  // ── Posts ─────────────────────────────────────────────────────────────────
  const postTitles = [
    { title: 'Abertura da 8ª Temporada reúne 200 pessoas no Centro Cultural', tag: 'temporada' },
    { title: 'Jovens do Trakinagem ganham prêmio em festival nacional', tag: 'premiação' },
    { title: 'Inscrições abertas para a próxima turma — vagas limitadas', tag: 'inscrições' },
  ]

  const postsCreated = await Promise.all(
    postTitles.map((p, i) =>
      payload.create({
        collection: 'posts',
        data: {
          title: `[MOCK] ${p.title}`,
          slug: `mock-post-${i + 1}`,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Este é um texto de exemplo gerado automaticamente para visualizar como o site ficará com conteúdo real. Substitua com o conteúdo verdadeiro quando disponível.', version: 1 }],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          coverImage: placeholderMedia,
          tags: [{ tag: p.tag }],
          publishedAt: new Date().toISOString(),
          status: 'published',
          isMock: true,
        } as any,
      }),
    ),
  )
  results.posts = postsCreated.length

  return NextResponse.json({ ok: true, inserted: results })
}

// DELETE /api/admin/mock — removes all mock data
export async function DELETE(_req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  const collections = ['posts', 'filmes', 'premios', 'apoiadores', 'edicoes'] as const

  const deleted: Record<string, number> = {}

  for (const col of collections) {
    const { docs } = await payload.find({
      collection: col,
      where: { isMock: { equals: true } },
      limit: 200,
      depth: 0,
    } as any)

    for (const doc of docs) {
      await payload.delete({ collection: col, id: doc.id } as any)
    }

    deleted[col] = docs.length
  }

  return NextResponse.json({ ok: true, deleted })
}
