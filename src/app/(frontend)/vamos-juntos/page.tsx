'use client'

import React, { useState, useRef } from 'react'
import { CheckCircle, Mail } from 'lucide-react'

// Brand SVG icons
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const IconYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
)

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

// ── Cinema loading animation (SVG) ────────────────────────────────────────────
function CinemaLoader() {
  return (
    <div className="cinema-loader" aria-label="Enviando..." aria-live="polite">
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="cinema-loader__svg">
        {/* Film strip */}
        <rect x="10" y="20" width="100" height="40" rx="3" stroke="#D32F2F" strokeWidth="2" fill="none" className="cinema-strip" />
        {/* Sprocket holes */}
        {[18, 38, 58, 78, 98].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="24" width="8" height="6" rx="1" fill="#D32F2F" opacity="0.7" />
            <rect x={x - 4} y="50" width="8" height="6" rx="1" fill="#D32F2F" opacity="0.7" />
          </g>
        ))}
        {/* Frames */}
        <rect x="20" y="33" width="24" height="14" rx="1" fill="#D32F2F" opacity="0.15" />
        <rect x="50" y="33" width="24" height="14" rx="1" fill="#D32F2F" opacity="0.3" />
        <rect x="80" y="33" width="24" height="14" rx="1" fill="#D32F2F" opacity="0.15" />
        {/* Play triangle */}
        <polygon points="58,37 66,40 58,43" fill="#D32F2F" className="cinema-play" />
        {/* Dots */}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={54 + i * 8} cy={70} r={3} fill="#D32F2F" className={`cinema-dot cinema-dot--${i}`} />
        ))}
      </svg>
      <p className="cinema-loader__text">Enviando mensagem...</p>
      <style>{`
        .cinema-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2.5rem 1rem;
        }

        .cinema-loader__svg {
          width: 120px;
          height: auto;
          animation: cinema-fade-in 0.3s ease;
        }

        @keyframes cinema-fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .cinema-strip {
          stroke-dasharray: 280;
          stroke-dashoffset: 280;
          animation: cinema-draw 0.8s ease forwards;
        }

        @keyframes cinema-draw {
          to { stroke-dashoffset: 0; }
        }

        .cinema-play {
          animation: cinema-pulse 0.8s ease-in-out infinite alternate;
          animation-delay: 0.5s;
        }

        @keyframes cinema-pulse {
          from { opacity: 0.5; transform: scale(1); transform-origin: 62px 40px; }
          to { opacity: 1; transform: scale(1.2); transform-origin: 62px 40px; }
        }

        .cinema-dot {
          animation: cinema-bounce 0.6s ease-in-out infinite alternate;
        }
        .cinema-dot--0 { animation-delay: 0s; }
        .cinema-dot--1 { animation-delay: 0.15s; }
        .cinema-dot--2 { animation-delay: 0.3s; }

        @keyframes cinema-bounce {
          from { transform: translateY(0); opacity: 0.4; }
          to { transform: translateY(-4px); opacity: 1; }
        }

        .cinema-loader__text {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}

// ── Phone mask. Format: (xx) xxxxx-xxxx or (xx) xxxx-xxxx ─────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

// ── Main component ────────────────────────────────────────────────────────────
export default function VamosJuntosPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus()
    }
  }, [error])

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.get('nome'),
          empresa: data.get('empresa'),
          email: data.get('email'),
          telefone: data.get('telefone'),
          mensagem: data.get('mensagem'),
        }),
      })

      if (res.status === 429) {
        setError('Muitas tentativas. Aguarde 1 hora e tente novamente.')
        return
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        setError(payload?.error || 'Erro ao enviar. Tente novamente.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Falha de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-contato">
      <section className="section page-header-section">
        <div className="container">
          <div className="contato-grid">

            {/* ─── Info Panel (left) ─── */}
            <aside className="contato-info">
              <p className="contato-info__label">Contato</p>
              <h1 className="contato-info__title">
                Vamos
                <br />
                <span className="contato-info__accent">Juntos?</span>
              </h1>
              <p className="contato-info__desc">
                Quer apoiar, patrocinar ou saber mais sobre o Trakinagem Cine?
                Estamos abertos a parcerias, colaborações e novas amizades.
              </p>

              <div className="contato-ways">
                <div className="contato-way">
                  <Mail size={16} strokeWidth={1.5} className="contato-way__icon" />
                  <span>contato@trakinagemcine.com.br</span>
                </div>
              </div>

              <div className="contato-social">
                <a href="https://www.instagram.com/trakinagemcine/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <IconInstagram />
                </a>
                <a href="https://www.youtube.com/@TrakinagemCine" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                  <IconYoutube />
                </a>
                <a href="https://www.facebook.com/trakinagemcine" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <IconFacebook />
                </a>
              </div>

              {/* Decorative geometric accent */}
              <div className="contato-deco" aria-hidden="true">
                <svg viewBox="0 0 200 200" fill="none">
                  <polygon points="100,10 190,170 10,170" fill="#D32F2F" fillOpacity="0.06" />
                  <polygon points="115,40 195,185 35,185" fill="#2E7D32" fillOpacity="0.04" />
                  <circle cx="100" cy="130" r="50" stroke="#D32F2F" strokeWidth="0.8" strokeOpacity="0.12" fill="none" />
                  <circle cx="100" cy="130" r="30" stroke="#D32F2F" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
                </svg>
              </div>
            </aside>

            {/* ─── Form Panel (right) ─── */}
            <div className="contato-form-wrap">
              {submitted ? (
                <div className="form-success">
                  <div className="form-success__icon">
                    <CheckCircle size={52} strokeWidth={1.2} color="#2E7D32" />
                  </div>
                  <h3 className="form-success__title">Mensagem enviada!</h3>
                  <p className="form-success__text">
                    Obrigado pelo interesse. Entraremos em contato em breve.
                  </p>
                </div>
              ) : loading ? (
                <CinemaLoader />
              ) : (
                <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
                  {error && (
                    <div className="form-error" role="alert" ref={errorRef} tabIndex={-1}>
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="nome">Nome *</label>
                    <input type="text" id="nome" name="nome" required placeholder="Seu nome completo" autoComplete="name" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="empresa">Empresa / Instituição</label>
                    <input type="text" id="empresa" name="empresa" placeholder="Nome da empresa ou organização" autoComplete="organization" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">E-mail *</label>
                      <input type="email" id="email" name="email" required placeholder="seu@email.com" autoComplete="email" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone</label>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onChange={handlePhoneChange}
                        autoComplete="tel"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensagem">Mensagem *</label>
                    <textarea id="mensagem" name="mensagem" rows={5} required placeholder="Como podemos colaborar? Conte-nos mais..." />
                  </div>

                  <div className="form-group form-group--checkbox">
                    <input type="checkbox" id="lgpd" name="lgpd" required />
                    <label htmlFor="lgpd">
                      Li e concordo com a{' '}
                      <a href="/privacidade" target="_blank">Política de Privacidade</a>{' '}
                      (LGPD).
                    </label>
                  </div>

                  <button type="submit" className="form-submit">
                    Enviar Mensagem →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page-header-section { padding-top: 100px; padding-bottom: 5rem; }

        .contato-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        /* Form primeiro no mobile — mais importante que o painel de info */
        @media (max-width: 899px) {
          .contato-form-wrap { order: -1; }
        }

        @media (min-width: 900px) {
          .contato-grid {
            grid-template-columns: 1fr 1.4fr;
            gap: 5rem;
            align-items: start;
          }
        }

        /* ─── Info ─── */
        .contato-info { position: relative; }

        .contato-info__label {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        .contato-info__title {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.05;
          color: var(--color-text-primary);
          margin-bottom: 1.5rem;
        }

        .contato-info__accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .contato-info__desc {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--color-text-secondary);
          max-width: 40ch;
          margin-bottom: 2rem;
        }

        .contato-ways {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .contato-way {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          min-width: 0;
        }

        .contato-way__icon { flex-shrink: 0; color: var(--color-accent); }

        .contato-way span {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .contato-social {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 1px solid var(--color-border);
          border-radius: 50%;
          color: var(--color-text-muted);
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .social-link:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-soft);
        }

        .contato-deco { width: 180px; opacity: 0.7; }
        @media (max-width: 899px) { .contato-deco { display: none; } }

        /* ─── Form wrapper ─── */
        .contato-form-wrap {
          background: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 2.5rem;
          min-height: 300px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .form-group input,
        .form-group textarea {
          background: var(--color-bg-primary);
          border: 1.5px solid var(--color-border);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          font-size: 0.92rem;
          color: var(--color-text-primary);
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--color-text-muted);
          opacity: 0.5;
        }

        .form-group input:hover,
        .form-group textarea:hover { border-color: var(--color-border-hover); }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.08);
        }

        .form-group textarea { resize: vertical; min-height: 130px; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 639px) { .form-row { grid-template-columns: 1fr; } }

        .form-group--checkbox {
          flex-direction: row;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .form-group--checkbox input[type="checkbox"] {
          width: auto;
          margin-top: 0.2rem;
          accent-color: var(--color-accent);
          flex-shrink: 0;
        }

        .form-group--checkbox label {
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
        }

        .form-group--checkbox a {
          color: var(--color-accent);
          text-decoration: underline;
        }

        .form-submit {
          background: var(--color-accent);
          color: #fff;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: flex-start;
        }

        .form-submit:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(211, 47, 47, 0.3);
        }

        .form-error {
          background: rgba(211, 47, 47, 0.06);
          border: 1px solid rgba(211, 47, 47, 0.2);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          color: var(--color-accent);
        }

        .form-success {
          text-align: center;
          padding: 3rem 1rem;
        }

        .form-success__icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .form-success__title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--color-text-primary);
        }

        .form-success__text {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
        }

        @media (max-width: 600px) {
          .contato-form-wrap { padding: 1.5rem; }
        }
      `}</style>
    </main>
  )
}
