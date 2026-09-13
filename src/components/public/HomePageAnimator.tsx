'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePageAnimator() {
  useGSAP(() => {
    // Basic context for cleanup handles itself with useGSAP
    
    // 1. Hero text fade up.
    // Animates TO visible: .hero-text-anim starts at opacity:0 in globals.css so the hero
    // never paints visible and then snaps out. gsap.from would reintroduce that flash.
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('.hero-text-anim', { y: 40 })
      gsap.to('.hero-text-anim', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2, // slight delay for initial load
      })
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.hero-text-anim', { opacity: 1, y: 0 })
    })

    // Hero image slow dynamic zoom out
    gsap.from('.hero-image-zoom-anim', {
      scale: 1.15,
      duration: 2,
      ease: 'power2.out',
      transformOrigin: 'center center',
    })

    // 2. Individual element fade up on scroll
    gsap.utils.toArray('.scroll-fade-up').forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    })

    // 3. Staggered groups (e.g. categories, lists)
    gsap.utils.toArray('.scroll-stagger-group').forEach((group: any) => {
      const items = group.querySelectorAll('.scroll-stagger-item')
      if (items.length) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        })
      }
    })

    // 4. Subtle image entries
    gsap.utils.toArray('.scroll-image-subtle').forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
        },
        scale: 0.95,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      })
    })

    // Recompute ScrollTrigger start positions after layout + scroll settle.
    // On client navigation the Suspense-streamed sections and the Lenis scroll
    // reset land AFTER this hook runs, leaving trigger positions stale — which
    // makes reveals fire late/janky on back-navigation. Double rAF waits for paint.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh())
    )

    return () => {
      cancelAnimationFrame(raf)
      mm.revert()
    }
  })

  return null
}
