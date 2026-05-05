import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { headers as nextHeaders } from 'next/headers'
import fs from 'fs'
import path from 'path'

const BACKUP_ROOT =
  process.env.BACKUP_ROOT || '/srv/clientes/victor/trakinagemcine/backups'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await nextHeaders() })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const filename = searchParams.get('file') || ''
    const category = searchParams.get('category') || 'daily'

    if (!/^trakinagemcine_[\d_]+\.tar$/.test(filename)) {
      return NextResponse.json({ error: 'filename inválido' }, { status: 400 })
    }
    if (!['daily', 'weekly', 'monthly'].includes(category)) {
      return NextResponse.json({ error: 'category inválida' }, { status: 400 })
    }

    const filePath = path.join(BACKUP_ROOT, category, filename)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    const stat = fs.statSync(filePath)
    const stream = fs.createReadStream(filePath)

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-tar',
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro' }, { status: 500 })
  }
}
