'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react'

interface ConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'trakinagem_consent'

function loadConsent(): ConsentState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveConsent(consent: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    window.dispatchEvent(new CustomEvent('trakinagem:consent', { detail: consent }))
  } catch {}
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const stored = loadConsent()
    if (!stored) {
      // delay to avoid hydration mismatch
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const acceptAll = () => {
    const full: ConsentState = { necessary: true, analytics: true, marketing: true }
    saveConsent(full)
    setVisible(false)
  }

  const saveSelected = () => {
    saveConsent(consent)
    setVisible(false)
  }

  const rejectAll = () => {
    const minimal: ConsentState = { necessary: true, analytics: false, marketing: false }
    saveConsent(minimal)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cookie-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 220 }}
          role="dialog"
          aria-label="Aviso de cookies"
          aria-live="polite"
        >
          <div className="cookie-banner__inner">
            {/* Header row */}
            <div className="cookie-banner__header">
              <span className="cookie-banner__icon">
                <Cookie size={20} strokeWidth={1.5} />
              </span>
              <p className="cookie-banner__text">
                Usamos <strong>cookies</strong> para melhorar sua experiência. Veja{' '}
                <a href="/privacidade" className="cookie-banner__link">nossa política</a>.
              </p>
              <button
                className="cookie-banner__dismiss"
                aria-label="Fechar"
                onClick={rejectAll}
              >
                <X size={16} />
              </button>
            </div>

            {/* Expandable granular controls */}
            <button
              className="cookie-banner__toggle"
              onClick={() => setExpanded((p) => !p)}
              aria-expanded={expanded}
            >
              {expanded ? 'Ocultar opções' : 'Personalizar'}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  className="cookie-banner__options"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ConsentToggle
                    id="necessary"
                    label="Necessários"
                    description="Essenciais para o funcionamento do site. Não podem ser desativados."
                    checked={true}
                    disabled={true}
                    onChange={() => {}}
                  />
                  <ConsentToggle
                    id="analytics"
                    label="Análise"
                    description="Nos ajudam a entender como você usa o site (ex: Google Analytics)."
                    checked={consent.analytics}
                    onChange={(v) => setConsent((p) => ({ ...p, analytics: v }))}
                  />
                  <ConsentToggle
                    id="marketing"
                    label="Marketing"
                    description="Usados para exibir conteúdo relevante em outras plataformas."
                    checked={consent.marketing}
                    onChange={(v) => setConsent((p) => ({ ...p, marketing: v }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="cookie-banner__actions">
              {expanded ? (
                <>
                  <button className="cookie-btn cookie-btn--ghost" onClick={rejectAll}>
                    Recusar opcionais
                  </button>
                  <button className="cookie-btn cookie-btn--secondary" onClick={saveSelected}>
                    Salvar seleção
                  </button>
                  <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                    Aceitar todos
                  </button>
                </>
              ) : (
                <>
                  <button className="cookie-btn cookie-btn--ghost" onClick={rejectAll}>
                    Recusar
                  </button>
                  <button className="cookie-btn cookie-btn--primary" onClick={acceptAll}>
                    Aceitar todos
                  </button>
                </>
              )}
            </div>
          </div>

          <style>{`
            .cookie-banner {
              position: fixed;
              bottom: 1.5rem;
              left: 50%;
              transform: translateX(-50%);
              z-index: 9990;
              width: calc(100% - 2rem);
              max-width: 640px;
            }

            .cookie-banner__inner {
              background: var(--color-bg-secondary, #fff);
              border: 1px solid var(--color-border, rgba(0,0,0,0.1));
              border-radius: 14px;
              padding: 1.25rem 1.5rem;
              box-shadow: 0 8px 40px rgba(0,0,0,0.12);
            }

            .cookie-banner__header {
              display: flex;
              align-items: flex-start;
              gap: 0.75rem;
            }

            .cookie-banner__icon {
              flex-shrink: 0;
              color: var(--color-accent, #D32F2F);
              margin-top: 2px;
            }

            .cookie-banner__text {
              flex: 1;
              font-size: 0.875rem;
              line-height: 1.6;
              color: var(--color-text-secondary, #444);
            }

            .cookie-banner__link {
              color: var(--color-accent, #D32F2F);
              text-decoration: underline;
              text-decoration-color: transparent;
              transition: text-decoration-color 0.2s;
            }

            .cookie-banner__link:hover { text-decoration-color: currentColor; }

            .cookie-banner__dismiss {
              flex-shrink: 0;
              background: none;
              border: none;
              cursor: pointer;
              color: var(--color-text-muted, #888);
              padding: 0.25rem;
              border-radius: 4px;
              transition: color 0.2s;
            }

            .cookie-banner__dismiss:hover { color: var(--color-text-primary, #111); }

            .cookie-banner__toggle {
              display: flex;
              align-items: center;
              gap: 0.35rem;
              margin-top: 1rem;
              font-size: 0.8rem;
              color: var(--color-text-muted, #888);
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              transition: color 0.2s;
            }

            .cookie-banner__toggle:hover { color: var(--color-text-primary, #111); }

            .cookie-banner__options {
              overflow: hidden;
              margin-top: 1rem;
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            }

            .cookie-banner__actions {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 1.25rem;
              justify-content: flex-end;
            }

            .cookie-btn {
              padding: 0.5rem 1.1rem;
              border-radius: 8px;
              font-size: 0.82rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.18s ease;
              border: 1px solid transparent;
            }

            .cookie-btn--primary {
              background: var(--color-accent, #D32F2F);
              color: #fff;
            }

            .cookie-btn--primary:hover { opacity: 0.88; }

            .cookie-btn--secondary {
              background: transparent;
              border-color: var(--color-accent, #D32F2F);
              color: var(--color-accent, #D32F2F);
            }

            .cookie-btn--secondary:hover {
              background: rgba(211, 47, 47, 0.06);
            }

            .cookie-btn--ghost {
              background: transparent;
              color: var(--color-text-muted, #888);
            }

            .cookie-btn--ghost:hover { color: var(--color-text-primary, #111); }

            /* Toggle row */
            .consent-toggle {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 1rem;
              padding: 0.75rem 0;
              border-top: 1px solid var(--color-border, rgba(0,0,0,0.07));
            }

            .consent-toggle__info { flex: 1; }

            .consent-toggle__label {
              font-size: 0.85rem;
              font-weight: 600;
              color: var(--color-text-primary, #111);
              margin-bottom: 0.2rem;
            }

            .consent-toggle__desc {
              font-size: 0.76rem;
              color: var(--color-text-muted, #888);
              line-height: 1.5;
            }

            .consent-toggle__switch {
              position: relative;
              width: 40px;
              height: 22px;
              flex-shrink: 0;
              margin-top: 2px;
            }

            .consent-toggle__switch input {
              opacity: 0;
              width: 0;
              height: 0;
              position: absolute;
            }

            .consent-toggle__track {
              position: absolute;
              inset: 0;
              background: #ddd;
              border-radius: 11px;
              cursor: pointer;
              transition: background 0.2s;
            }

            .consent-toggle__track::after {
              content: '';
              position: absolute;
              left: 3px;
              top: 3px;
              width: 16px;
              height: 16px;
              background: white;
              border-radius: 50%;
              transition: transform 0.2s;
            }

            .consent-toggle__switch input:checked + .consent-toggle__track {
              background: var(--color-accent, #D32F2F);
            }

            .consent-toggle__switch input:checked + .consent-toggle__track::after {
              transform: translateX(18px);
            }

            .consent-toggle__switch input:disabled + .consent-toggle__track {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ConsentToggleProps {
  id: string
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

function ConsentToggle({ id, label, description, checked, disabled, onChange }: ConsentToggleProps) {
  return (
    <div className="consent-toggle">
      <div className="consent-toggle__info">
        <p className="consent-toggle__label">{label}</p>
        <p className="consent-toggle__desc">{description}</p>
      </div>
      <label className="consent-toggle__switch" htmlFor={`cookie-${id}`}>
        <input
          id={`cookie-${id}`}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="consent-toggle__track" />
      </label>
    </div>
  )
}
