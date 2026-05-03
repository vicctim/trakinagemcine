'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── Menu structure ────────────────────────────────────────────────────────────
const navLeft = [
  { href: '/quentinhas', label: 'Quentinhas' },
  {
    label: 'Festival',
    children: [
      { href: '/nesta-edicao', label: 'Nesta Edição' },
      { href: '/timeline', label: 'Edições Anteriores' },
      { href: '/nossos-filmes', label: 'Nossos Filmes' },
      { href: '/premios', label: 'Prêmios' },
    ],
  },
  {
    label: 'Participar',
    children: [
      { href: '/bora-filmar', label: 'Bora Filmar!' },
      { href: '/como-filmar', label: 'Como Filmar?' },
    ],
  },
]

const navRight = [
  { href: '/apoiadores', label: 'Apoiadores' },
  { href: '/nossas-inspiracoes', label: 'Inspirações' },
  { href: '/vamos-juntos', label: 'Vamos Juntos?' },
]

// ── Dropdown item type ────────────────────────────────────────────────────────
type NavItem =
  | { href: string; label: string; children?: never }
  | { label: string; href?: never; children: { href: string; label: string }[] }

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasChild = Boolean(item.children)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!hasChild) {
    return (
      <Link
        href={(item as { href: string; label: string }).href}
        className={`header__link ${pathname === (item as { href: string }).href ? 'header__link--active' : ''}`}
      >
        {item.label}
      </Link>
    )
  }

  const isActive = item.children?.some((c) => pathname === c.href)

  return (
    <div
      ref={ref}
      className="header__dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`header__link header__dropdown-trigger ${isActive ? 'header__link--active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`header__chevron ${open ? 'header__chevron--open' : ''}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`header__submenu ${open ? 'header__submenu--open' : ''}`}>
        {item.children?.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`header__submenu-link ${pathname === c.href ? 'header__submenu-link--active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Mobile nav item ───────────────────────────────────────────────────────────
function MobileNavItem({
  item,
  pathname,
  onClose,
}: {
  item: NavItem
  pathname: string
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)

  if (!item.children) {
    return (
      <Link
        href={(item as { href: string; label: string }).href}
        className={`mobile-nav__link ${pathname === (item as { href: string }).href ? 'mobile-nav__link--active' : ''}`}
        onClick={onClose}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="mobile-nav__group">
      <button
        className={`mobile-nav__group-trigger ${item.children.some((c) => pathname === c.href) ? 'mobile-nav__link--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {item.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="mobile-nav__sub">
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`mobile-nav__sublink ${pathname === c.href ? 'mobile-nav__link--active' : ''}`}
              onClick={onClose}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Header ───────────────────────────────────────────────────────────────
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const allItems = [...navLeft, ...navRight]

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        {/* ── Editorial utility bar (inside header, hidden by default) ─── */}
        <div className="header__utility-bar">
          <span>Uberlândia · Minas Gerais</span>
          <div className="header__utility-bar-right">
            <span>Lei nº 24.462</span>
            <span className="header__utility-sep">·</span>
            <span>LEIC 2018.13605.0270</span>
          </div>
        </div>
        {/* ── Desktop: Big centered logo layout ─────────────────────────── */}
        <div className="header__desktop container">
          {/* Left nav */}
          <nav className="header__nav-left" aria-label="Menu principal esquerdo">
            {navLeft.map((item) => (
              <Dropdown key={item.label} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* Center logo */}
          <Link href="/" className="header__logo" aria-label="Trakinagem Cine — Início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-trakinagemcine.png"
              alt="Trakinagem Cine"
              className="header__logo-img"
            />
            <span className="header__logo-text" aria-hidden="true">
              <span className="header__logo-title">Trakinagem Cine</span>
              <span className="header__logo-sub">Cinema transforma vidas</span>
            </span>
          </Link>

          {/* Right nav */}
          <nav className="header__nav-right" aria-label="Menu principal direito">
            {navRight.map((item) => (
              <Dropdown key={item.label} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        {/* ── Mobile: Simple logo left + hamburger right ─────────────────── */}
        <div className="header__mobile container">
          <Link href="/" className="header__logo" aria-label="Trakinagem Cine — Início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-trakinagemcine.png"
              alt="Trakinagem Cine"
              className="header__logo-img"
            />
            <span className="header__logo-text" aria-hidden="true">
              <span className="header__logo-title">Trakinagem Cine</span>
              <span className="header__logo-sub">Cinema transforma vidas</span>
            </span>
          </Link>

          <button
            className={`header__burger ${mobileOpen ? 'header__burger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <span className="header__burger-line" />
            <span className="header__burger-line" />
            <span className="header__burger-line" />
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ─────────────────────────────────────────── */}
      <div
        id="mobile-nav"
        className={`mobile-nav ${mobileOpen ? 'mobile-nav--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="mobile-nav__inner">
          {allItems.map((item) => (
            <MobileNavItem
              key={item.label}
              item={item}
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </div>
      {/* Overlay backdrop */}
      {mobileOpen && (
        <div
          className="mobile-nav__backdrop"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <style>{`
        /* ─── Editorial utility bar ─── */
        .header__utility-bar {
          display: none;
        }

        /* ─── Editorial logo text (hidden by default) ─── */
        .header__logo-text {
          display: none;
        }

        /* ─── Header shell ─── */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          transition: background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease;
        }

        .header--scrolled {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.07);
        }

        /* ─── Desktop layout (default — show on ≥1025px) ─── */
        .header__desktop {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 140px;
          gap: 2rem;
        }

        /* ─── Mobile layout (hidden by default, show on ≤1024px) ─── */
        @media (max-width: 1024px) {
          .header__desktop { display: none; }
        }

        /* ─── Nav groups ─── */
        .header__nav-left {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          justify-content: flex-end;
        }

        .header__nav-right {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          justify-content: flex-start;
        }

        /* ─── Logo ─── */
        .header__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .header__logo-img {
          height: 120px;
          width: auto;
          object-fit: contain;
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: block;
        }

        .header__logo:hover .header__logo-img {
          opacity: 0.85;
          transform: scale(1.02);
        }

        /* ─── Nav links ─── */
        .header__link {
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          color: var(--color-text-secondary);
          letter-spacing: 0.01em;
          position: relative;
          transition: color 0.2s ease;
          white-space: nowrap;
          background: none;
          border: none;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
        }

        .header__link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: var(--color-accent);
          transition: width 0.25s ease;
        }

        .header__link:hover,
        .header__dropdown-trigger:hover {
          color: var(--color-text-primary);
        }

        .header__link:hover::after {
          width: 100%;
        }

        .header__link--active {
          color: var(--color-accent);
        }

        .header__link--active::after {
          width: 100%;
        }

        /* ─── Chevron ─── */
        .header__chevron {
          transition: transform 0.2s ease;
          color: currentColor;
          opacity: 0.6;
        }

        .header__chevron--open {
          transform: rotate(180deg);
        }

        /* ─── Dropdown ─── */
        .header__dropdown {
          position: relative;
        }

        .header__submenu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          min-width: 190px;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          /* padding-top creates the visual gap without leaving the hover area */
          padding: 10px 0 0.4rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 300;
        }

        /* Invisible bridge fills the space between trigger and dropdown */
        .header__submenu::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 10px;
        }

        .header__submenu--open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .header__submenu-link {
          display: block;
          padding: 0.6rem 1.1rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .header__submenu-link:hover,
        .header__submenu-link--active {
          color: var(--color-accent);
          background: rgba(211,47,47,0.04);
          padding-left: 1.35rem;
        }

        /* ─── Mobile header row (hidden on desktop, flex on mobile) ─── */
        .header__mobile {
          display: none;
        }

        @media (max-width: 1024px) {
          .header__mobile {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 130px;
          }
        }

        @media (max-width: 640px) {
          .header__mobile {
            height: 88px;
          }

          .header__logo-img {
            height: 78px;
          }
        }

        /* ─── Burger button ─── */
        .header__burger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
          position: relative;
          z-index: 210;
        }

        .header__burger:hover {
          background: rgba(0,0,0,0.05);
        }

        .header__burger-line {
          display: block;
          width: 22px;
          height: 1.5px;
          background: var(--color-text-primary);
          border-radius: 2px;
          transition: all 0.28s cubic-bezier(0.68,-0.55,0.27,1.55);
          transform-origin: center;
        }

        .header__burger--open .header__burger-line:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }

        .header__burger--open .header__burger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .header__burger--open .header__burger-line:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ─── Mobile nav panel ─── */
        .mobile-nav {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(340px, 85vw);
          background: rgba(255,255,255,0.99);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 205;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          box-shadow: -8px 0 40px rgba(0,0,0,0.12);
        }

        .mobile-nav--open {
          transform: translateX(0);
        }

        .mobile-nav__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 204;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.22s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-nav__inner {
          padding: 5rem 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        @media (max-width: 640px) {
          .mobile-nav__inner {
            padding-top: 4.25rem;
          }
        }

        /* ─── Mobile nav links ─── */
        .mobile-nav__link {
          display: block;
          padding: 0.85rem 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-primary);
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: color 0.15s ease, padding-left 0.15s ease;
        }

        .mobile-nav__link:hover,
        .mobile-nav__link--active {
          color: var(--color-accent);
        }

        .mobile-nav__group-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.85rem 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-primary);
          background: none;
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          text-align: left;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .mobile-nav__group-trigger:hover { color: var(--color-accent); }

        .mobile-nav__sub {
          padding: 0.25rem 0 0.25rem 1rem;
          display: flex;
          flex-direction: column;
        }

        .mobile-nav__sublink {
          display: block;
          padding: 0.65rem 0;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: color 0.15s ease;
        }

        .mobile-nav__sublink:hover,
        .mobile-nav__link--active {
          color: var(--color-accent);
        }
      `}</style>
    </>
  )
}
