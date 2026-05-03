import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const isHttps = (process.env.NEXT_PUBLIC_SITE_URL || '').startsWith('https://')

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube-nocookie.com https://www.youtube.com https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com https://www.googletagmanager.com https://www.facebook.com",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.googletagmanager.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.facebook.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isHttps ? ["upgrade-insecure-requests"] : []),
    ].join('; ')

    return [
      // Static assets with content hashes — cache forever (safe, immutable filenames)
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // HTML pages and API routes — never cache (prevents stale chunk 404s after deploy)
      {
        source: '/((?!_next/static).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ...(isHttps ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
