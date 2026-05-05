import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { headers as nextHeaders } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'

const BACKUP_ROOT =
  process.env.BACKUP_ROOT || '/srv/clientes/victor/trakinagemcine/backups'

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

// ─── POST: dispara backup manual ────────────────────────────────────────────
export async function POST() {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const scriptPath = path.resolve(process.cwd(), 'scripts/backup.sh')
    try {
      await fs.access(scriptPath)
    } catch {
      return NextResponse.json(
        {
          error:
            'Script de backup não encontrado. Configure com o comando do Dashboard antes de fazer backup manual.',
        },
        { status: 400 },
      )
    }

    // Disparar em background — não esperar terminar (pode levar minutos)
    const child = spawn('/bin/bash', [scriptPath], {
      detached: true,
      stdio: 'ignore',
    })
    child.unref()

    return NextResponse.json({
      ok: true,
      message: 'Backup iniciado em background. Verifique o status em alguns segundos.',
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
