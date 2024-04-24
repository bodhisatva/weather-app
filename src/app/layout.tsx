import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { LocationContextProvider } from '@/context/LocationContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Qvik Weather App',
  description: 'Weather app for Qvik'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const backgroundOverlay = 'bg-gradient-to-b to-q-blue from-q-orange'

  return (
    <html className={`${backgroundOverlay} text-[#fff] h-full`} lang="en">
      <body className={`${inter.className} h-full`}>
        <LocationContextProvider>{children}</LocationContextProvider>
      </body>
    </html>
  )
}
