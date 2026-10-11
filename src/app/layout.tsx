import type { Metadata, Viewport } from 'next'
import { Suspense, type ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { LocationContextProvider } from '@/context/LocationContext'
import './globals.css'
import { ReactQueryClientProvider } from '@/components/react-query-client/Provider'
import { SkeletonOneLine } from '@/components/skeleton/SkeletonOneLine'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Weather app',
  description: 'Weather app for checking the weather forecast',
  appleWebApp: {
    title: 'Weather app',
    statusBarStyle: 'black-translucent'
  }
}

export const viewport: Viewport = {
  themeColor: '#2f6a72',
  viewportFit: 'cover'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const backgroundOverlay = 'bg-gradient-to-b from-w-silver-blue to-w-blue'

  return (
    <html className={`${backgroundOverlay} text-[#fff] min-h-screen`} lang="en">
      <body
        className={`${inter.className} pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
      >
        <ReactQueryClientProvider>
          <Suspense fallback={<SkeletonOneLine height="h-3" width="w-20" />}>
            <LocationContextProvider>{children}</LocationContextProvider>
          </Suspense>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
