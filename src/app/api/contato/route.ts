import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Simple in-memory rate limit
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 3_600_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

// ── IP Geolocation (ip-api.com — free, no key required) ───────────────────────
interface GeoInfo {
  cidade?: string
  estado?: string
  pais?: string
}

async function geoFromIp(ip: string): Promise<GeoInfo> {
  // Skip private/local IPs
  if (
    ip === 'unknown' ||
    ip.startsWith('127.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip === '::1'
  ) {
    return { pais: 'Local' }
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,regionName,country&lang=pt-BR`,
      { signal: AbortSignal.timeout(3000) },
    )
    if (!res.ok) return {}
    const data = await res.json()
    if (data.status !== 'success') return {}
    return {
      cidade: data.city || undefined,
      estado: data.regionName || undefined,
      pais: data.country || 'Brasil',
    }
  } catch {
    return {}
  }
}

// ── Email notification ───────────────────────────────────────────────────────
async function sendEmailNotification(data: {
  nome: string
  empresa: string
  email: string
  telefone: string
  mensagem: string
  cidade?: string
  estado?: string
}) {
  const SMTP_FROM = process.env.SMTP_FROM
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL

  if (!NOTIFY_EMAIL || !SMTP_FROM) {
    console.warn('[form-contact] SMTP/NOTIFY not configured — skipping email')
    return
  }

  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SMTP_FROM,
        to: [NOTIFY_EMAIL],
        subject: `[Trakinagem Cine] Nova mensagem de ${data.nome}`,
        html: `
          <h2 style="color:#D32F2F">Nova mensagem via formulário de contato</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif">
            <tr><td><strong>Nome</strong></td><td>${data.nome}</td></tr>
            <tr><td><strong>Empresa</strong></td><td>${data.empresa || '—'}</td></tr>
            <tr><td><strong>E-mail</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td><strong>Telefone</strong></td><td>${data.telefone || '—'}</td></tr>
            <tr><td><strong>Localização</strong></td><td>${[data.cidade, data.estado].filter(Boolean).join(', ') || '—'}</td></tr>
            <tr><td style="vertical-align:top"><strong>Mensagem</strong></td>
              <td style="white-space:pre-wrap">${data.mensagem}</td></tr>
          </table>
          <hr>
          <p style="color:#888;font-size:12px">Trakinagem Cine — Sistema automático</p>
        `,
      }),
    })
    return
  }

  console.info('[form-contact] RESEND_API_KEY not set. Email not sent.')
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em 1 hora.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const { nome, empresa, email, telefone, mensagem } = body as Record<string, string>

  if (!nome || !email || !mensagem) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: nome, email, mensagem.' },
      { status: 422 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 422 })
  }

  // Geo lookup (non-blocking, runs in parallel with validation)
  const geo = await geoFromIp(ip)

  const sanitized = {
    nome: String(nome).slice(0, 120),
    empresa: empresa ? String(empresa).slice(0, 120) : undefined,
    email: String(email).slice(0, 120),
    telefone: telefone ? String(telefone).slice(0, 30) : undefined,
    mensagem: String(mensagem).slice(0, 2000),
    ipOrigem: ip,
    cidade: geo.cidade,
    estado: geo.estado,
    pais: geo.pais ?? 'Brasil',
  }

  // Persist directly via Payload SDK (bypasses need for auth token)
  try {
    const payload = await getPayload({ config: configPromise })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload as any).create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: sanitized,
    })
    console.info(`[form-contact] Saved from ${ip} — ${geo.cidade || 'unknown city'}, ${geo.estado || ''}`)
  } catch (err) {
    console.error('[form-contact] Payload persist error:', err)
    // Don't fail the request — user sees success, admin can investigate logs
  }

  // Send email notification (non-blocking)
  sendEmailNotification({
    nome: sanitized.nome,
    empresa: sanitized.empresa ?? '',
    email: sanitized.email,
    telefone: sanitized.telefone ?? '',
    mensagem: sanitized.mensagem,
    cidade: geo.cidade,
    estado: geo.estado,
  }).catch((err) => console.error('[form-contact] Email error:', err))

  return NextResponse.json({ ok: true }, { status: 201 })
}
