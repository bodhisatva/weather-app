import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { LocationContextProvider } from '@/context/LocationContext'
import './globals.css'

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
        <LocationContextProvider>{children}</LocationContextProvider>
      </body>
    </html>
  )
}
