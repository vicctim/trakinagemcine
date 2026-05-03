'use client'

import { useEffect } from 'react'

interface AnalyticsConfig {
  googleAnalytics?: { gaEnabled?: boolean; gaMeasurementId?: string }
  metaPixel?: { pixelEnabled?: boolean; pixelId?: string }
  tagManager?: { gtmEnabled?: boolean; gtmId?: string }
  headScript?: string
  bodyScript?: string
}

interface ConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'trakinagem_consent'

function loadConsent(): ConsentState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function injectGA(measurementId: string) {
  if (document.getElementById('ga-script')) return
  const s = document.createElement('script')
  s.id = 'ga-script'
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  s.async = true
  document.head.appendChild(s)

  const inline = document.createElement('script')
  inline.id = 'ga-inline'
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { anonymize_ip: true });
  `
  document.head.appendChild(inline)
}

function injectGTM(gtmId: string) {
  if (document.getElementById('gtm-script')) return
  const s = document.createElement('script')
  s.id = 'gtm-script'
  s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`
  document.head.appendChild(s)
}

function injectPixel(pixelId: string) {
  if (document.getElementById('fbpixel-script')) return
  const s = document.createElement('script')
  s.id = 'fbpixel-script'
  s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`
  document.head.appendChild(s)
}

function applyConsent(consent: ConsentState, cfg: AnalyticsConfig) {
  if (consent.analytics) {
    if (cfg.googleAnalytics?.gaEnabled && cfg.googleAnalytics?.gaMeasurementId) {
      injectGA(cfg.googleAnalytics.gaMeasurementId)
    }
    if (cfg.tagManager?.gtmEnabled && cfg.tagManager?.gtmId) {
      injectGTM(cfg.tagManager.gtmId)
    }
  }
  if (consent.marketing) {
    if (cfg.metaPixel?.pixelEnabled && cfg.metaPixel?.pixelId) {
      injectPixel(cfg.metaPixel.pixelId)
    }
  }
}

export function AnalyticsScripts({ config }: { config: AnalyticsConfig }) {
  useEffect(() => {
    const consent = loadConsent()
    if (consent) applyConsent(consent, config)

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail
      if (detail) applyConsent(detail, config)
    }
    window.addEventListener('trakinagem:consent', handler)
    return () => window.removeEventListener('trakinagem:consent', handler)
  }, [config])

  return null
}
