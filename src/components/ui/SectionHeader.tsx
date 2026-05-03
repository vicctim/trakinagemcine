import React from 'react'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  accent?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  label,
  title,
  subtitle,
  accent,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={`section-header ${align === 'center' ? 'section-header--center' : ''}`}>
      {label && <p className="section-header__label">{label}</p>}
      <h2 className="section-header__title">
        {accent ? (
          <>
            {title.split(accent)[0]}
            <span style={{ color: 'var(--color-accent)' }}>{accent}</span>
            {title.split(accent)[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}

      <style>{`
        .section-header {
          margin-bottom: 3rem;
        }

        .section-header--center {
          text-align: center;
        }

        .section-header--center .section-header__subtitle {
          margin-left: auto;
          margin-right: auto;
        }

        .section-header__label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 0.75rem;
        }

        .section-header__title {
          margin-bottom: 1rem;
        }

        .section-header__subtitle {
          font-size: 1rem;
          color: var(--color-text-secondary);
          max-width: 55ch;
          line-height: 1.7;
        }
      `}</style>
    </div>
  )
}
