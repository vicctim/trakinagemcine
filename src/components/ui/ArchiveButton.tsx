'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ArchiveButtonProps {
  edicaoId: string | number
  edicaoTitulo: string
}

export function ArchiveButton({ edicaoId, edicaoTitulo }: ArchiveButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleArchive = async () => {
    const confirmed = window.confirm(
      `Arquivar "${edicaoTitulo}"?\n\nA edição será movida para a Timeline e não aparecerá mais em "Nesta Edição".`,
    )
    if (!confirmed) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/edicoes/${edicaoId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'arquivada' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Erro ${res.status}`)
      }

      router.push('/timeline')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar edição')
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
      <button
        onClick={handleArchive}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.55rem 1.25rem',
          background: 'transparent',
          border: '1px solid rgba(211,47,47,0.4)',
          borderRadius: '6px',
          color: 'var(--color-accent, #D32F2F)',
          fontSize: '0.82rem',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = 'rgba(211,47,47,0.08)'
            e.currentTarget.style.borderColor = 'rgba(211,47,47,0.7)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'rgba(211,47,47,0.4)'
        }}
      >
        {loading ? 'Arquivando…' : '⊙ Arquivar edição'}
      </button>
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent, #D32F2F)' }}>{error}</span>
      )}
    </div>
  )
}
