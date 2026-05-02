'use client'

import { useEffect } from 'react'

export default function AnchorScroller() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const scrollToHash = () => {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (document.readyState === 'complete') {
      scrollToHash()
    } else {
      window.addEventListener('load', scrollToHash, { once: true })
    }
  }, [])

  return null
}
