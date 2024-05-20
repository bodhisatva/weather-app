import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { LocationContextProvider } from '@/context/LocationContext'
import './globals.css'
import { Query, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryClientProvider } from '@/components/react-query-client/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Weather app for checking the weather forecast'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const backgroundOverlay = 'bg-gradient-to-b from-w-silver-blue to-w-blue '

  return (
    <html className={`${backgroundOverlay} text-[#fff] min-h-screen`} lang="en">
      <body className={`${inter.className}`}>
        <ReactQueryClientProvider>
          <LocationContextProvider>{children}</LocationContextProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
