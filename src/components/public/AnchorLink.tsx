'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLenis } from '@/lib/lenis'

type Props = { href: string; className?: string; children: React.ReactNode }

export default function AnchorLink({ href, className, children }: Props) {
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const [path, hash] = href.split('#')
    // Same page → scroll manually; the router won't do it reliably.
    if (hash && pathname === path) {
      const el = document.getElementById(hash)
      if (el) {
        e.preventDefault()
        const lenis = getLenis()
        if (lenis) {
          // Route through Lenis so its internal target updates; otherwise its RAF
          // loop overrides a native scroll on the next frame and snaps back to top.
          lenis.scrollTo(el, { offset: -80 }) // matches sections' scroll-mt-20 (80px)
        } else {
          // Lenis not initialised yet (deferred to idle in SmoothScrollProvider).
          el.scrollIntoView({ behavior: 'smooth' })
        }
        window.history.replaceState(null, '', href)
      }
    }
    // Different page → let <Link> navigate; AnchorScroller scrolls on arrival.
  }

  return (
    <Link href={href} scroll={false} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
