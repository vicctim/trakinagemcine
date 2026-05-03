'use client'

import React from 'react'

/** Renders static SMTP instructions inside the SmtpConfig global form */
export const SmtpInstructions: React.FC = () => (
  <div style={{
    marginTop: '1.5rem',
    padding: '1.25rem 1.5rem',
    background: 'var(--theme-elevation-50)',
    border: '1px solid var(--theme-elevation-100)',
    borderLeft: '3px solid #D32F2F',
    borderRadius: '6px',
    fontSize: '0.82rem',
    lineHeight: '1.65',
    color: 'var(--theme-text)',
    opacity: 0.8,
  }}>
    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 1 }}>
      📧 Como configurar o Resend (recomendado):
    </strong>
    <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <li>Acesse <a href="https://resend.com" target="_blank" rel="noopener noreferrer" style={{ color: '#D32F2F' }}>resend.com</a> e faça login</li>
      <li>Vá em <strong>API Keys</strong> → <strong>Create API Key</strong></li>
      <li>Cole a chave no campo acima e salve</li>
      <li>Configure os e-mails de origem e destino como desejar</li>
    </ol>
    <p style={{ marginTop: '0.75rem', marginBottom: 0 }}>
      <strong>Nota:</strong> As variáveis de ambiente (.env) no servidor ainda precisam ser atualizadas pelo desenvolvedor após alterar aqui.
    </p>
  </div>
)
