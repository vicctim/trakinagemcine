import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { headers as nextHeaders } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

const BACKUP_ROOT = process.env.BACKUP_ROOT || '/app/backups'
const TRIGGER_FILE = path.join(BACKUP_ROOT, '.backup-requested')

async function requireAuth() {
  const payload = await getPayloadClient()
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })
  return user
}

// ─── GET: lista backups disponíveis ─────────────────────────────────────────
export async function GET() {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const categories: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly']
    const result: Record<string, any[]> = {}

    for (const cat of categories) {
      const dir = path.join(BACKUP_ROOT, cat)
      try {
        const files = await fs.readdir(dir)
        const items = await Promise.all(
          files
            .filter((f) => f.startsWith('trakinagemcine_') && f.endsWith('.tar'))
            .map(async (f) => {
              const stat = await fs.stat(path.join(dir, f))
              return {
                filename: f,
                category: cat,
                size: stat.size,
                createdAt: stat.mtime.toISOString(),
                path: path.join(dir, f),
              }
            }),
        )
        result[cat] = items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      } catch {
        result[cat] = []
      }
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro' }, { status: 500 })
  }
}

// ─── POST: solicita backup manual ───────────────────────────────────────────
//
// O backup precisa rodar NO HOST (precisa de docker exec pra acessar o banco
// e o volume de mídia). Não é executável dentro do container.
//
// Solução: criamos um arquivo de trigger em backups/.backup-requested.
// O script `scripts/trigger-watcher.sh` (em cron de 1 min no host) detecta
// o arquivo, dispara o backup e remove o trigger.
export async function POST() {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await fs.mkdir(BACKUP_ROOT, { recursive: true })
    await fs.writeFile(
      TRIGGER_FILE,
      JSON.stringify({ requestedAt: new Date().toISOString(), requestedBy: user.email }),
      'utf-8',
    )

    return NextResponse.json({
      ok: true,
      message:
        'Backup solicitado. Será iniciado em até 1 minuto se o trigger-watcher estiver no cron. Caso contrário, execute na VPS: bash scripts/backup.sh',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro' }, { status: 500 })
  }
}

// ─── DELETE: remove um backup específico ────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { filename, category } = await req.json()
    if (!filename || !category) {
      return NextResponse.json({ error: 'filename e category obrigatórios' }, { status: 400 })
    }
    if (!/^trakinagemcine_[\d_]+\.tar$/.test(filename)) {
      return NextResponse.json({ error: 'filename inválido' }, { status: 400 })
    }
    if (!['daily', 'weekly', 'monthly'].includes(category)) {
      return NextResponse.json({ error: 'category inválida' }, { status: 400 })
    }

    const filePath = path.join(BACKUP_ROOT, category, filename)
    await fs.unlink(filePath)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro' }, { status: 500 })
  }
}
