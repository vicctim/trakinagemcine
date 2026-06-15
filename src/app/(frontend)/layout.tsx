import React from 'react'
import { Inter, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import type { Metadata } from 'next'
import './styles.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { PageTransition } from '@/components/ui/PageTransition'
import { AnalyticsScripts } from '@/components/ui/AnalyticsScripts'
import { ChunkErrorRecovery } from '@/components/ui/ChunkErrorRecovery'
import { getPayloadClient } from '@/lib/payload'
import { getNavigation } from '@/lib/navigation'
import { defaultNavLeft, defaultNavRight } from '@/components/layout/Header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

// Force SSR so data-site-theme is always read fresh from DB (theme toggle works on all pages)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Trakinagem Cine — Cinema transforma vidas',
    template: '%s — Trakinagem Cine',
  },
  description:
    'Projeto cultural e educativo que ensina produção audiovisual a jovens em situação de vulnerabilidade social, por meio de oficinas de cinema.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/images/favicon.png', type: 'image/png' },
    ],
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Trakinagem Cine',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Trakinagem Cine — Cinema transforma vidas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Trakinagem Cine',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo-trakinagemcine.png`,
  sameAs: [
    'https://www.facebook.com/trakinagemcine',
    'https://www.instagram.com/trakinagemcine/',
    'https://www.youtube.com/@TrakinagemCine',
  ],
  description:
    'Projeto cultural e educativo que ensina produção audiovisual a jovens em situação de vulnerabilidade social.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let analyticsConfig = null
  let theme = 'default'
  let navLeft = defaultNavLeft
  let navRight = defaultNavRight

  try {
    const payload = await getPayloadClient()
    const [analytics, siteConfig, navigation] = await Promise.all([
      payload.findGlobal({ slug: 'analytics-config' as any }).catch(() => null),
      payload.findGlobal({ slug: 'site-config' }).catch(() => null),
      getNavigation(),
    ])
    analyticsConfig = analytics
    theme = (siteConfig as any)?.theme || 'default'
    navLeft = navigation.navLeft
    navRight = navigation.navRight
  } catch {
    // DB unavailable during build — render with defaults
  }

  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable} ${playfair.variable}`} data-site-theme={theme}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <ChunkErrorRecovery />
        <Header navLeft={navLeft} navRight={navRight} />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
        <CookieBanner />
        {analyticsConfig && (
          <AnalyticsScripts
            config={{
              googleAnalytics: analyticsConfig.googleAnalytics,
              metaPixel: analyticsConfig.metaPixel,
              tagManager: analyticsConfig.tagManager,
            }}
          />
        )}
      </body>
    </html>
  )
}
