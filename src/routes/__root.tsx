import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
  Link,
} from '@tanstack/react-router'
import { ConvexClientProvider } from '../convex'
import { Home, ArrowLeft } from 'lucide-react'

import appCss from '../styles.css?url'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Misbara Chat',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),

  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl" lang="ar">
      <head>
        <HeadContent />
      </head>
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        <Scripts />
      </body>
    </html>
  )
}