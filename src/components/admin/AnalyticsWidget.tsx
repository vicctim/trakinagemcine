'use client'

import React from 'react'

/** Shows a brief analytics status widget inside the Analytics global */
export const AnalyticsWidget: React.FC = () => (
  <div style={{
    marginTop: '1.5rem',
    padding: '1.25rem 1.5rem',
    background: 'var(--theme-elevation-50)',
    border: '1px solid var(--theme-elevation-100)',
    borderLeft: '3px solid #2E7D32',
    borderRadius: '6px',
    fontSize: '0.82rem',
    lineHeight: '1.65',
    color: 'var(--theme-text)',
    opacity: 0.8,
  }}>
    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 1 }}>
      📊 Dicas de Analytics:
    </strong>
    <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <li><strong>GA4:</strong> Acesse <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2E7D32' }}>analytics.google.com</a> para ver relatórios detalhados</li>
      <li><strong>Meta Pixel:</strong> Monitore conversões em <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2E7D32' }}>Meta Business Suite</a></li>
      <li><strong>Plausible:</strong> Alternativa leve e LGPD-friendly, sem cookies</li>
      <li>Ative apenas o que for usar — scripts desnecessários reduzem a velocidade do site</li>
    </ul>
  </div>
)
