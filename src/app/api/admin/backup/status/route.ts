import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * Atualiza o status do último backup no global BackupConfig.
 *
 * Chamado pelo `scripts/backup.sh` para registrar sucesso/erro/tamanho.
 * NÃO requer auth — é chamado de localhost pelo script. Em produção isso
 * fica protegido pela rede do Docker (porta 3000 só interna).
 *
 * Para extra segurança, valida que o request vem de localhost.
 */
export async function POST(req: NextRequest) {
  try {
    // Aceita apenas requests internos (script bash do mesmo host)
    const forwardedFor = req.headers.get('x-forwarded-for') || ''
    const realIp = req.headers.get('x-real-ip') || ''
    const isLocal =
      !forwardedFor &&
      !realIp /* sem proxy */ ||
      forwardedFor.startsWith('127.') ||
      forwardedFor.startsWith('::1') ||
      realIp.startsWith('127.') ||
      realIp.startsWith('::1') ||
      // Docker network internal IPs (172.x ou 10.x) — quando script roda em outro container
      forwardedFor.startsWith('172.') ||
      forwardedFor.startsWith('10.') ||
      realIp.startsWith('172.') ||
      realIp.startsWith('10.')

    if (!isLocal) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { status, message, size } = body || {}

    if (!['running', 'success', 'error'].includes(status)) {
      return NextResponse.json({ error: 'status inválido' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    await payload.updateGlobal({
      slug: 'backup-config' as any,
      data: {
        lastBackupAt: new Date().toISOString(),
        lastBackupStatus: status,
        lastBackupMessage: message || '',
        lastBackupSize: typeof size === 'number' ? size : 0,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro' }, { status: 500 })
  }
}
