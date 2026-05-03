'use client'

import React, { useEffect, useState, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Stats {
  posts: number
  filmes: number
  edicoes: number
  premios: number
  apoiadores: number
  mensagens: number
  usuarios: number
  medias: number
}

interface RecentMsg {
  id: string
  nome: string
  email: string
  empresa?: string
  mensagem?: string
  createdAt: string
}

// ─── Icon components (lucide-compatible, no import needed) ──────────────────
const IconFilm = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />
  </svg>
)
const IconNewspaper = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" />
  </svg>
)
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const IconTrophy = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
)
const IconHandshake = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </svg>
)

// ─── Greeting ────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: number | string; link: string }) {
  return (
    <a href={link} className="tk-stat-card">
      <span className="tk-stat-icon">{icon}</span>
      <div className="tk-stat-body">
        <span className="tk-stat-value">{value}</span>
        <span className="tk-stat-label">{label}</span>
      </div>
    </a>
  )
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [msgs, setMsgs] = useState<RecentMsg[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('')
  const [theme, setTheme] = useState<string>('default')
  const [themeLoading, setThemeLoading] = useState(false)
  const [mockLoading, setMockLoading] = useState(false)
  const [mockMsg, setMockMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const toggleTheme = useCallback(async () => {
    const next = theme === 'default' ? 'editorial' : 'default'
    setThemeLoading(true)
    try {
      const r = await fetch('/api/globals/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: next }),
      })
      if (r.ok) {
        setTheme(next)
      }
    } finally {
      setThemeLoading(false)
    }
  }, [theme])

  const handleMockInsert = useCallback(async () => {
    setMockLoading(true)
    setMockMsg(null)
    try {
      const r = await fetch('/api/admin/mock', { method: 'POST' })
      const d = await r.json()
      if (r.ok) {
        const total = Object.values(d.inserted as Record<string, number>).reduce((a, b) => a + b, 0)
        setMockMsg({ type: 'ok', text: `${total} registros mock inseridos com sucesso.` })
        // refresh stats
        setLoading(true)
      } else {
        setMockMsg({ type: 'err', text: d.error || 'Erro ao inserir dados mock.' })
      }
    } catch {
      setMockMsg({ type: 'err', text: 'Erro de conexão.' })
    } finally {
      setMockLoading(false)
    }
  }, [])

  const handleMockReset = useCallback(async () => {
    if (!confirm('Remover todos os dados mock? Esta ação não pode ser desfeita.')) return
    setMockLoading(true)
    setMockMsg(null)
    try {
      const r = await fetch('/api/admin/mock', { method: 'DELETE' })
      const d = await r.json()
      if (r.ok) {
        const total = Object.values(d.deleted as Record<string, number>).reduce((a, b) => a + b, 0)
        setMockMsg({ type: 'ok', text: `${total} registros mock removidos.` })
        setLoading(true)
      } else {
        setMockMsg({ type: 'err', text: d.error || 'Erro ao remover dados mock.' })
      }
    } catch {
      setMockMsg({ type: 'err', text: 'Erro de conexão.' })
    } finally {
      setMockLoading(false)
    }
  }, [])

  useEffect(() => {
    const headers = { 'Content-Type': 'application/json' }

    async function fetchCount(collection: string): Promise<number> {
      const r = await fetch(`/api/${collection}?limit=0&depth=0`, { headers }).catch(() => null)
      if (!r?.ok) return 0
      const d = await r.json().catch(() => ({}))
      return d.totalDocs ?? 0
    }

    async function load() {
      // Fetch logged-in user name
      const meRes = await fetch('/api/users/me', { headers }).catch(() => null)
      if (meRes?.ok) {
        const me = await meRes.json().catch(() => ({}))
        const fullName = me?.user?.name || me?.user?.email?.split('@')[0] || ''
        setUserName(fullName.split(' ')[0]) // first name only
      }

      // Fetch current theme from site-config
      const cfgRes = await fetch('/api/globals/site-config?depth=0', { headers }).catch(() => null)
      if (cfgRes?.ok) {
        const cfg = await cfgRes.json().catch(() => ({}))
        setTheme(cfg?.theme || 'default')
      }

      const [posts, filmes, edicoes, premios, apoiadores, mensagens, usuarios, medias] =
        await Promise.all([
          fetchCount('posts'),
          fetchCount('filmes'),
          fetchCount('edicoes'),
          fetchCount('premios'),
          fetchCount('apoiadores'),
          fetchCount('form-submissions'),
          fetchCount('users'),
          fetchCount('media'),
        ])
      setStats({ posts, filmes, edicoes, premios, apoiadores, mensagens, usuarios, medias })

      // Fetch recent messages
      const r = await fetch('/api/form-submissions?limit=5&sort=-createdAt&depth=0', { headers }).catch(() => null)
      if (r?.ok) {
        const d = await r.json().catch(() => ({}))
        setMsgs(d.docs ?? [])
      }

      setLoading(false)
    }

    load()
  }, [])

  return (
    <div className="tk-dashboard">
      {/* ─── Header ─── */}
      <div className="tk-dash-header">
        <div>
          <h1 className="tk-dash-title">
            <span className="tk-dash-greeting">{getGreeting()}{userName ? `, ${userName}` : ''}! 👋</span>
            <span className="tk-dash-brand">Trakinagem <em>Cine</em></span>
          </h1>
          <p className="tk-dash-sub">Painel de Gestão de Conteúdo — Cinema transforma vidas</p>
        </div>
        <a href="https://trakinagemcine.victorsamuel.com.br" target="_blank" rel="noopener noreferrer" className="tk-dash-site-btn">
          Ver site →
        </a>
      </div>

      {/* ─── Stat Grid ─── */}
      <section className="tk-section">
        <h2 className="tk-section-title">Resumo do Conteúdo</h2>
        {loading ? (
          <div className="tk-loading">Carregando estatísticas...</div>
        ) : (
          <div className="tk-stats-grid">
            <StatCard icon={<IconNewspaper />} label="Quentinhas" value={stats?.posts ?? 0} link="/admin/collections/posts" />
            <StatCard icon={<IconFilm />} label="Filmes" value={stats?.filmes ?? 0} link="/admin/collections/filmes" />
            <StatCard icon={<IconCalendar />} label="Edições" value={stats?.edicoes ?? 0} link="/admin/collections/edicoes" />
            <StatCard icon={<IconTrophy />} label="Prêmios" value={stats?.premios ?? 0} link="/admin/collections/premios" />
            <StatCard icon={<IconHandshake />} label="Apoiadores" value={stats?.apoiadores ?? 0} link="/admin/collections/apoiadores" />
            <StatCard icon={<IconMail />} label="Mensagens" value={stats?.mensagens ?? 0} link="/admin/collections/form-submissions" />
            <StatCard icon={<IconImage />} label="Mídias" value={stats?.medias ?? 0} link="/admin/collections/media" />
            <StatCard icon={<IconUsers />} label="Usuários" value={stats?.usuarios ?? 0} link="/admin/collections/users" />
          </div>
        )}
      </section>

      {/* ─── Quick Actions ─── */}
      <section className="tk-section">
        <h2 className="tk-section-title">Ações Rápidas</h2>
        <div className="tk-actions-grid">
          <a href="/admin/collections/posts/create" className="tk-action-card tk-action-card--primary">
            <span className="tk-action-icon"><IconNewspaper /></span>
            <span>Nova Quentinha</span>
          </a>
          <a href="/admin/collections/filmes/create" className="tk-action-card">
            <span className="tk-action-icon"><IconFilm /></span>
            <span>Novo Filme</span>
          </a>
          <a href="/admin/collections/edicoes/create" className="tk-action-card">
            <span className="tk-action-icon"><IconCalendar /></span>
            <span>Nova Edição</span>
          </a>
          <a href="/admin/collections/premios/create" className="tk-action-card">
            <span className="tk-action-icon"><IconTrophy /></span>
            <span>Novo Prêmio</span>
          </a>
          <a href="/admin/collections/apoiadores/create" className="tk-action-card">
            <span className="tk-action-icon"><IconHandshake /></span>
            <span>Novo Apoiador</span>
          </a>
          <a href="/admin/globals/site-config" className="tk-action-card">
            <span className="tk-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
            </span>
            <span>Configurações do Site</span>
          </a>
        </div>
      </section>

      {/* ─── Recent Messages ─── */}
      <section className="tk-section">
        <div className="tk-section-row">
          <h2 className="tk-section-title">Mensagens Recentes</h2>
          <a href="/admin/collections/form-submissions" className="tk-section-link">Ver todas →</a>
        </div>
        {loading ? (
          <div className="tk-loading">Carregando...</div>
        ) : msgs.length === 0 ? (
          <div className="tk-empty">Nenhuma mensagem recebida ainda.</div>
        ) : (
          <div className="tk-msgs-list">
            {msgs.map((m) => (
              <a key={m.id} href={`/admin/collections/form-submissions/${m.id}`} className="tk-msg-item">
                <div className="tk-msg-avatar">{m.nome?.[0]?.toUpperCase() || '?'}</div>
                <div className="tk-msg-body">
                  <div className="tk-msg-name">
                    {m.nome}
                    {m.empresa && <span className="tk-msg-company"> — {m.empresa}</span>}
                  </div>
                  <div className="tk-msg-email">{m.email}</div>
                  {m.mensagem && (
                    <div className="tk-msg-preview">{m.mensagem.slice(0, 120)}{m.mensagem.length > 120 ? '…' : ''}</div>
                  )}
                </div>
                <div className="tk-msg-date">
                  {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ─── Aparência ─── */}
      <section className="tk-section">
        <h2 className="tk-section-title">Aparência do Site</h2>
        <div className="tk-appearance-card">
          <div className="tk-appearance-info">
            <span className="tk-appearance-label">Tema atual:</span>
            <span className="tk-appearance-badge" data-theme={theme}>
              {theme === 'editorial' ? '🎬 Editorial' : '⬜ Padrão'}
            </span>
            <span className="tk-appearance-desc">
              {theme === 'editorial'
                ? 'Visual escuro, naval e verde — estilo cinema independente.'
                : 'Visual claro com identidade visual vermelha e verde do logo.'}
            </span>
          </div>
          <button
            className="tk-theme-btn"
            onClick={toggleTheme}
            disabled={themeLoading}
          >
            {themeLoading ? 'Alterando...' : theme === 'editorial' ? '↩ Voltar ao Padrão' : '🎬 Ativar Editorial'}
          </button>
        </div>
      </section>

      {/* ─── Mock Data ─── */}
      <section className="tk-section">
        <h2 className="tk-section-title">Preview de Dados</h2>
        <div className="tk-mock-card">
          <div className="tk-mock-info">
            <p>Insira dados de exemplo para visualizar o site preenchido antes de ter conteúdo real. Use "Resetar" para apagá-los.</p>
            <p className="tk-mock-note">Requer ao menos uma imagem na Biblioteca de Mídia. Todos os registros mock são marcados com <code>[MOCK]</code>.</p>
          </div>
          <div className="tk-mock-actions">
            <button className="tk-mock-btn tk-mock-btn--insert" onClick={handleMockInsert} disabled={mockLoading}>
              {mockLoading ? 'Aguarde...' : '+ Inserir Mock Data'}
            </button>
            <button className="tk-mock-btn tk-mock-btn--reset" onClick={handleMockReset} disabled={mockLoading}>
              {mockLoading ? 'Aguarde...' : '✕ Resetar Mock Data'}
            </button>
          </div>
          {mockMsg && (
            <div className={`tk-mock-feedback tk-mock-feedback--${mockMsg.type}`}>
              {mockMsg.text}
            </div>
          )}
        </div>
      </section>

      {/* ─── Quick Guide ─── */}
      <section className="tk-section">
        <h2 className="tk-section-title">Guia Rápido de Uso</h2>
        <div className="tk-guide-grid">
          <div className="tk-guide-card">
            <div className="tk-guide-num">1</div>
            <h3>Quentinhas</h3>
            <p>São as notícias/posts do site. Crie uma nova, adicione título, conteúdo e publique.</p>
          </div>
          <div className="tk-guide-card">
            <div className="tk-guide-num">2</div>
            <h3>Edições e Filmes</h3>
            <p>Cada temporada é uma "Edição". Filmes são vinculados à edição correspondente.</p>
          </div>
          <div className="tk-guide-card">
            <div className="tk-guide-num">3</div>
            <h3>Apoiadores</h3>
            <p>Adicione logomarcas e nomes dos apoiadores/patrocinadores de cada temporada.</p>
          </div>
          <div className="tk-guide-card">
            <div className="tk-guide-num">4</div>
            <h3>Mídia</h3>
            <p>Todas as imagens e vídeos ficam centralizados aqui. Envie antes de criar conteúdo.</p>
          </div>
        </div>
      </section>

      {/* ─── Styles ─── */}
      <style>{`
        .tk-dashboard {
          padding: 2rem;
          font-family: var(--font-body);
          max-width: 1100px;
        }

        /* Header */
        .tk-dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tk-dash-greeting {
          display: block;
          font-size: 0.85rem;
          color: var(--theme-text);
          opacity: 0.6;
          font-weight: 400;
          margin-bottom: 0.35rem;
        }
        .tk-dash-brand {
          display: block;
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--theme-text);
          line-height: 1.1;
        }
        .tk-dash-brand em {
          color: #D32F2F;
          font-style: italic;
        }
        .tk-dash-sub {
          font-size: 0.85rem;
          color: var(--theme-text);
          opacity: 0.55;
          margin-top: 0.4rem;
        }
        .tk-dash-site-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.25rem;
          border: 1.5px solid var(--theme-elevation-150);
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--theme-text);
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tk-dash-site-btn:hover {
          border-color: #D32F2F;
          color: #D32F2F;
        }

        /* Section */
        .tk-section { margin-bottom: 2.5rem; }
        .tk-section-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .tk-section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: var(--theme-text);
          opacity: 0.5;
          margin-bottom: 1rem;
        }
        .tk-section-row .tk-section-title { margin-bottom: 0; }
        .tk-section-link {
          font-size: 0.8rem;
          color: #D32F2F;
          text-decoration: none;
          opacity: 0.8;
        }
        .tk-section-link:hover { opacity: 1; }

        /* Stat Cards */
        .tk-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        }
        .tk-stat-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1.1rem 1rem;
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-100);
          border-radius: 8px;
          text-decoration: none;
          color: var(--theme-text);
          transition: all 0.18s ease;
        }
        .tk-stat-card:hover {
          border-color: #D32F2F;
          background: var(--theme-elevation-100);
          transform: translateY(-2px);
        }
        .tk-stat-icon {
          color: #D32F2F;
          opacity: 0.75;
          flex-shrink: 0;
        }
        .tk-stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          color: var(--theme-text);
        }
        .tk-stat-label {
          display: block;
          font-size: 0.72rem;
          opacity: 0.55;
          margin-top: 0.2rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Action Cards */
        .tk-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.6rem;
        }
        .tk-action-card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          border: 1px dashed var(--theme-elevation-150);
          border-radius: 6px;
          font-size: 0.82rem;
          color: var(--theme-text);
          text-decoration: none;
          transition: all 0.18s;
        }
        .tk-action-card:hover {
          border-color: #D32F2F;
          border-style: solid;
          color: #D32F2F;
        }
        .tk-action-card--primary {
          border-style: solid;
          border-color: #D32F2F;
          color: #D32F2F;
          font-weight: 600;
        }
        .tk-action-icon { flex-shrink: 0; }

        /* Messages */
        .tk-msgs-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--theme-elevation-100);
          border-radius: 8px;
          overflow: hidden;
        }
        .tk-msg-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1rem 1.1rem;
          text-decoration: none;
          color: var(--theme-text);
          background: var(--theme-elevation-50);
          border-bottom: 1px solid var(--theme-elevation-100);
          transition: background 0.15s;
        }
        .tk-msg-item:last-child { border-bottom: none; }
        .tk-msg-item:hover { background: var(--theme-elevation-100); }
        .tk-msg-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #D32F2F;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .tk-msg-body { flex: 1; min-width: 0; }
        .tk-msg-name { font-size: 0.88rem; font-weight: 600; }
        .tk-msg-company { font-weight: 400; opacity: 0.6; }
        .tk-msg-email { font-size: 0.78rem; opacity: 0.55; margin-top: 0.1rem; }
        .tk-msg-preview {
          font-size: 0.8rem;
          opacity: 0.55;
          margin-top: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tk-msg-date {
          font-size: 0.72rem;
          opacity: 0.45;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Guide */
        .tk-guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        .tk-guide-card {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-100);
          border-radius: 8px;
          padding: 1.1rem;
          position: relative;
        }
        .tk-guide-num {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #D32F2F;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tk-guide-card h3 {
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: var(--theme-text);
        }
        .tk-guide-card p {
          font-size: 0.78rem;
          opacity: 0.6;
          line-height: 1.55;
        }

        /* Appearance */
        .tk-appearance-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 1.25rem 1.5rem;
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-100);
          border-radius: 8px;
        }
        .tk-appearance-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; flex: 1; }
        .tk-appearance-label { font-size: 0.82rem; opacity: 0.6; }
        .tk-appearance-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--theme-elevation-150);
          color: var(--theme-text);
        }
        .tk-appearance-badge[data-theme="editorial"] { background: #1A3A5C; color: #7EC8A0; }
        .tk-appearance-desc { font-size: 0.78rem; opacity: 0.55; }
        .tk-theme-btn {
          padding: 0.6rem 1.25rem;
          background: #D32F2F;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .tk-theme-btn:hover:not(:disabled) { background: #B71C1C; }
        .tk-theme-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Mock Data */
        .tk-mock-card {
          padding: 1.25rem 1.5rem;
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-100);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .tk-mock-info p { font-size: 0.82rem; opacity: 0.7; line-height: 1.55; }
        .tk-mock-note { margin-top: 0.35rem !important; }
        .tk-mock-note code {
          font-family: monospace;
          background: var(--theme-elevation-100);
          padding: 0.1em 0.4em;
          border-radius: 3px;
          font-size: 0.75rem;
        }
        .tk-mock-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .tk-mock-btn {
          padding: 0.55rem 1.1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .tk-mock-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tk-mock-btn--insert { background: #2E7D32; color: #fff; }
        .tk-mock-btn--insert:hover:not(:disabled) { background: #1B5E20; }
        .tk-mock-btn--reset { background: var(--theme-elevation-150); color: var(--theme-text); }
        .tk-mock-btn--reset:hover:not(:disabled) { background: var(--theme-elevation-200); }
        .tk-mock-feedback {
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 500;
        }
        .tk-mock-feedback--ok { background: rgba(46,125,50,0.12); color: #2E7D32; }
        .tk-mock-feedback--err { background: rgba(211,47,47,0.1); color: #D32F2F; }

        /* States */
        .tk-loading, .tk-empty {
          padding: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          opacity: 0.5;
          background: var(--theme-elevation-50);
          border-radius: 8px;
        }

        @media (max-width: 600px) {
          .tk-dashboard { padding: 1rem; }
          .tk-stats-grid { grid-template-columns: 1fr 1fr; }
          .tk-actions-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
