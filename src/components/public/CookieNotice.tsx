'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const STORAGE_KEY = 'inoya_cookie_notice_ack'

export default function CookieNotice() {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== '1') {
      setVisible(true)
    }
  }, [])

  function handleDismiss() {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        localStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
      }
    })

    tl.to(containerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    })
  }

  useGSAP(() => {
    if (visible && containerRef.current) {
      gsap.from(containerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.8,
        ease: 'power3.out'
      })
    }
  }, { dependencies: [visible], scope: containerRef })

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-6 right-6 z-[55] w-[calc(100vw-3rem)] sm:w-[320px]"
    >
      <div className="relative bg-white/95 backdrop-blur-md border border-burgundy/20 rounded-none shadow-[0_15px_40px_rgba(122,0,0,0.06)] p-5 md:p-6">
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <Cookie size={14} className="text-brand-rose" strokeWidth={1.5} />
            <span className="font-sans text-[9px] font-medium tracking-[0.2em] uppercase text-burgundy/40">
              Cookie Notice
            </span>
          </div>

          <p className="font-sans text-[13px] text-charcoal/70 leading-relaxed mb-5">
            We use only essential cookies to keep the site working. No tracking. No ads.{' '}
            <Link
              href="/privacy-policy"
              className="text-brand-rose hover:underline underline-offset-2 transition-all"
            >
              Privacy Policy
            </Link>
          </p>

          <button
            type="button"
            onClick={handleDismiss}
            className="group/btn relative overflow-hidden w-full bg-burgundy text-white text-[11px] tracking-[0.1em] uppercase font-sans py-3 rounded-none transition-all duration-300 active:scale-95 shadow-md shadow-burgundy/5"
          >
            <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
            <span className="relative z-10">Got it</span>
          </button>
        </div>

        {/* Minimal Close Icon */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-burgundy/20 hover:text-burgundy transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
