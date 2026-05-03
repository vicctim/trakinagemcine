'use client'

import { useEffect } from 'react'

/**
 * Catches ChunkLoadError that happens after a new deploy when the browser
 * has a stale page cached and tries to load old JS chunks (now 404).
 * Auto-reloads once instead of showing a blank page.
 */
export function ChunkErrorRecovery() {
  useEffect(() => {
    const RELOAD_KEY = '__chunk_reload'

    function handleError(event: ErrorEvent) {
      const msg = event.message || ''
      const isChunkError =
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed')

      if (isChunkError) {
        // Guard against reload loop — only reload once per session
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1')
          window.location.reload()
        }
      }
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const msg = String(event.reason)
      const isChunkError =
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module')

      if (isChunkError) {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1')
          window.location.reload()
        }
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
