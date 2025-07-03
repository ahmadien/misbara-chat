import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import * as Sentry from '@sentry/react'

import { createRouter } from './router'
import { initSentry } from './sentry'

// Initialize Sentry (will be skipped if DSN is not defined)
initSentry()

const router = createRouter()

// Check if Sentry DSN is defined before creating error boundary
const AppComponent = process.env.SENTRY_DSN
  ? Sentry.withErrorBoundary(StartClient, {
      fallback: () => <div>An error has occurred. Our team has been notified.</div>,
    })
  : StartClient

// Ensure there is a valid DOM element for React to hydrate
let container = document.getElementById('root') as HTMLElement | null

if (!container) {
  container = document.createElement('div')
  container.id = 'root'
  document.body.appendChild(container)
}

hydrateRoot(container, <AppComponent router={router} />)
