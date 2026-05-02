"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRef, Suspense } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Navbar from '@/components/public/Navbar'
import NavigationProgress from '@/components/public/NavigationProgress'

export default function NotFound() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.from('.not-found-subtext', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, '-=1')
      .from('.not-found-cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.6')
  }, { scope: container })

  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Navbar />

      <main ref={container} className="relative w-full bg-cream flex flex-col justify-center items-center px-6 md:px-16 lg:px-[100px] xl:px-[140px] mt-[50px] md:mt-[60px]" style={{ minHeight: 'calc(100dvh - 60px)' }}>
        {/* Global Noise Overlay */}
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]">
          <svg className="h-full w-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Overlay for blending */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-transparent from-[50%] via-cream/40 via-[60%] to-cream z-10" />
          {/* Desktop Image */}
          <div className="hidden md:block h-full w-full">
            <Image
              src="/images/error/error desktop.jpeg"
              alt="404 — Lost in the garden"
              fill
              className="object-cover object-center blur-[0.6px]"
              priority
            />
          </div>
          {/* Mobile Image */}
          <div className="block md:hidden h-full w-full">
            <Image
              src="/images/mobile images/error mobile.jpeg"
              alt="404 — Lost in the garden"
              fill
              className="object-cover object-center blur-[0.6px]"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center text-center mt-[70%] md:mt-[32%]">
          {/* Main heading */}
          <div className="mb-3 w-full">
            <h1 className="font-display text-[36px] md:text-[clamp(40px,5.5vw,60px)] leading-tight md:leading-none tracking-tight text-burgundy font-normal">
              Lost in the garden?
            </h1>
          </div>

          {/* Subtext */}
          <p className="not-found-subtext font-sans tracking-tight text-[13px] md:text-[15px] leading-[1.4] mt-2 md:mt-3 max-w-[300px] md:max-w-[420px] text-[#2a2a2a] mb-8">
            The page you&apos;re looking for doesn&apos;t exist, but something lovelier does.
          </p>

          {/* CTA */}
          <div className="not-found-cta w-full flex justify-center">
            <Link
              href="/"
              className="group/btn relative inline-flex items-center justify-center bg-burgundy text-white font-sans text-[11px] md:text-[12px] uppercase tracking-[0.15em] px-10 py-3.5 overflow-hidden rounded-none transition-all w-auto"
            >
              <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
              <span className="relative z-10">
                Return to Inoya Rouge
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
