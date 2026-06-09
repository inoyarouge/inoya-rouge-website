'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnchorScroller() {
  const pathname = usePathname()

  // Cross-page landing: when arriving at a page that carries a hash, scroll to it.
  // Same-page anchor clicks are handled directly by AnchorLink.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (document.readyState === 'complete') scroll()
    else window.addEventListener('load', scroll, { once: true })
  }, [pathname])

  return null
}
