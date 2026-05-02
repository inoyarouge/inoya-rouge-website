import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Newsreader } from 'next/font/google'
import { Suspense } from 'react'
import '@/styles/globals.css'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

const agatho = localFont({
  src: [
    { path: '../../public/fonts/agatho/Agatho Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/agatho/Agatho.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const satoshi = localFont({
  src: [
    { path: '../../public/fonts/satoshi/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/satoshi/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Inoya Rouge',
  description: 'Inspired by Nature, Defined by Color — Indian luxury cosmetics',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${agatho.variable} ${satoshi.variable} ${newsreader.variable} font-sans antialiased bg-cream text-gray-900`}>
        <Suspense fallback={children}>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </Suspense>
      </body>
    </html>
  )
}
