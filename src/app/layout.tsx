import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import '@/styles/globals.css'
import SmoothScrollGate from '@/components/providers/SmoothScrollGate'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Inoya Rouge',
  description: 'Inspired by Nature, Defined by Color — Indian luxury cosmetics',
  icons: {
    icon: '/images/logo/inoya-rouge-logo.png',
    apple: '/images/logo/inoya-rouge-logo.png',
  },
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
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-cream text-gray-900`}>
        <SmoothScrollGate>{children}</SmoothScrollGate>
      </body>
    </html>
  )
}
