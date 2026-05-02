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
    
    // 1. Hero text fade up
    gsap.from('.hero-text-anim', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2, // slight delay for initial load
    })

    // Hero image slow dynamic zoom out
    gsap.from('.hero-image-zoom-anim', {
      scale: 1.15,
      duration: 6,
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
  })

  return null
}
