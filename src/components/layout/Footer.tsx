import React from 'react'
import Link from 'next/link'

const footerLinks = [
  { href: '/bora-filmar', label: 'Bora Filmar!' },
  { href: '/nossos-filmes', label: 'Nossos Filmes' },
  { href: '/premios', label: 'Prêmios' },
  { href: '/vamos-juntos', label: 'Vamos Juntos?' },
  { href: '/privacidade', label: 'Privacidade' },
]

const socialLinks = [
  {
    href: 'https://www.facebook.com/trakinagemcine',
    label: 'Facebook',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/trakinagemcine/',
    label: 'Instagram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: 'https://www.youtube.com/@TrakinagemCine',
    label: 'YouTube',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <Link href="/" className="footer__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-trakinagemcine-branco.png"
              alt="Trakinagem Cine"
              className="footer__logo-img"
            />
          </Link>
          <p className="footer__tagline">
            Mostra de Cinema e Educação. Oficinas audiovisuais que ensinam jovens em situação de
            vulnerabilidade social a contar suas próprias histórias através do cinema.
          </p>
          <div className="footer__social">
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer__nav">
          <h4 className="footer__nav-title">Navegação</h4>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="footer__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copy">
          © {year} Trakinagem — Mostra de Cinema e Educação. Desenvolvido por{' '}
          <a href="https://victorsamuel.com.br" target="_blank" rel="noopener noreferrer">
            Victor Samuel
          </a>
        </p>
      </div>

      <style>{`
        .footer {
          background: var(--color-dark-bg-secondary);
          border-top: 1px solid var(--color-dark-border);
          padding: 4rem 0 0;
          color: var(--color-dark-text);
        }

        .footer__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }

        @media (min-width: 768px) {
          .footer__inner {
            grid-template-columns: 2fr 1fr;
          }
        }

        .footer__logo {
          display: inline-block;
          margin-bottom: 1.25rem;
        }

        .footer__logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        .footer__logo:hover .footer__logo-img {
          opacity: 1;
        }

        .footer__tagline {
          font-size: 0.88rem;
          color: var(--color-dark-text-muted);
          max-width: 45ch;
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }

        .footer__social {
          display: flex;
          gap: 0.75rem;
        }

        .footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-dark-text-muted);
          transition: all 0.2s ease;
        }

        .footer__social-link:hover {
          background: var(--color-accent);
          color: #fff;
          transform: translateY(-2px);
        }

        .footer__nav-title {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-dark-text-muted);
          margin-bottom: 1rem;
        }

        .footer__nav {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer__link {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer__link:hover {
          color: var(--color-accent);
        }

        .footer__bottom {
          border-top: 1px solid var(--color-dark-border);
          padding: 1.5rem 0;
        }

        .footer__copy {
          font-size: 0.78rem;
          color: var(--color-dark-text-muted);
        }

        .footer__copy a {
          color: var(--color-accent);
          text-decoration: none;
        }

        .footer__copy a:hover {
          text-decoration: underline;
        }
      `}</style>
    </footer>
  )
}
