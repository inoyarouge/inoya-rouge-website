'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Loaded on demand, not statically: this module pulls in lenis + gsap + ScrollTrigger.
// A static import puts all of that in the shared layout chunk for EVERY route, including
// the policy pages that never enable smooth scroll. shouldEnable() below gates when the
// provider runs; this gates when its code is downloaded.
const SmoothScrollProvider = dynamic(() => import('./SmoothScrollProvider'), { ssr: false })

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

  // The provider is a SIBLING of children, never a parent. It renders no DOM and does all
  // its work in effects, so children are never unmounted or blanked by it. The Suspense
  // boundary wraps only the provider — it calls useSearchParams, which suspends and would
  // otherwise break the /_not-found prerender (see d795d98). Wrapping children in that
  // boundary is what caused the first-load paint/blank/repaint flicker.
  return (
    <>
      {shouldEnable(pathname) && (
        <Suspense fallback={null}>
          <SmoothScrollProvider />
        </Suspense>
      )}
      {children}
    </>
  )
}
