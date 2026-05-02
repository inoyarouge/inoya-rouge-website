'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const SmoothScrollProvider = dynamic(
  () => import('./SmoothScrollProvider'),
  { ssr: false, loading: () => null }
)

function shouldEnable(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname === '/') return true
  if (pathname === '/about-us') return true
  if (pathname === '/community') return true
  if (pathname === '/contact') return true
  if (pathname === '/shop' || pathname.startsWith('/shop/')) return true
  return false
}

export default function SmoothScrollGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (shouldEnable(pathname)) {
    return <SmoothScrollProvider>{children}</SmoothScrollProvider>
  }
  return <>{children}</>
}
