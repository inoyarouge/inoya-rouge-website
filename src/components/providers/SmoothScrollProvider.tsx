'use client'

import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname, useSearchParams } from 'next/navigation'
import { setLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null

    const start = () => {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
      lenisRef.current = lenis
      setLenis(lenis)

      lenis.on('scroll', ScrollTrigger.update)

      tick = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // Defer smooth-scroll setup until the browser is idle so Lenis + the GSAP
    // ticker don't compete with hydration / first paint. Falls back to a short
    // timeout where requestIdleCallback isn't available (e.g. Safari).
    const hasRIC =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
    const handle: number = hasRIC
      ? window.requestIdleCallback(start, { timeout: 500 })
      : window.setTimeout(start, 200)

    return () => {
      if (hasRIC) {
        window.cancelIdleCallback?.(handle)
      } else {
        window.clearTimeout(handle)
      }
      if (tick) gsap.ticker.remove(tick)
      if (lenis) lenis.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    // Only reset to top on a genuine page change. In Next 15, an in-page hash update
    // via history.replaceState (see AnchorLink) returns a fresh searchParams reference
    // and re-fires this effect — without the pathname guard it would snap a same-page
    // anchor scroll back to the top.
    if (lenisRef.current && prevPathnameRef.current !== pathname) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
    prevPathnameRef.current = pathname
    // Re-evaluate triggers against the (possibly reset) scroll position on navigation.
    ScrollTrigger.refresh()
  }, [pathname, searchParams])

  return <>{children}</>
}
