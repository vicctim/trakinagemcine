import React from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  variant?: ButtonVariant
  onClick?: () => void
  className?: string
  external?: boolean
}

export function Button({
  children,
  href,
  variant = 'primary',
  onClick,
  className = '',
  external,
}: ButtonProps) {
  const cls = `btn btn--${variant} ${className}`

  if (href) {
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}

      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem 1.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 4px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn--primary {
          background: var(--color-accent);
          color: var(--color-bg-primary);
        }

        .btn--primary:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(211, 47, 47, 0.3);
          color: var(--color-bg-primary);
        }

        .btn--secondary {
          background: transparent;
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .btn--secondary:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .btn--ghost {
          background: transparent;
          color: var(--color-text-secondary);
          padding: 0.5rem 0;
        }

        .btn--ghost:hover {
          color: var(--color-accent);
        }
      `}</style>
    </button>
  )
}
