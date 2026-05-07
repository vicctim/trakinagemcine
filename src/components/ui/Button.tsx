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
    </button>
  )
}
