import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import * as Sentry from '@sentry/react'

import { createRouter } from './router'
import { initSentry } from './sentry'

// Initialize Sentry (will be skipped if DSN is not defined)
initSentry()

const router = createRouter()

// Choose the component wrapper depending on Sentry configuration
const Root = process.env.SENTRY_DSN
  ? Sentry.withErrorBoundary(StartClient, {
      fallback: () => <div>An error has occurred. Our team has been notified.</div>,
    })
  : StartClient

export default function Client() {
  return <Root router={router} />
}

// Hydrate on the client if we're in the browser
if (typeof document !== 'undefined') {
  let container = document.getElementById('root') as HTMLElement | null
  if (!container) {
    container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)
  }

  hydrateRoot(container, <Client />)
}
