"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenuToggle from './MobileMenuToggle'

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/shop', label: 'SHOP' },
  { href: '/our-story', label: 'OUR STORY' },
  { href: '/community', label: 'COMMUNITY' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // check initial scroll position
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = navLinks.map(link => (
    <Link
      key={link.href}
      href={link.href}
      className="text-[#211a17] hover:text-burgundy text-[10px] md:text-[14px] font-sans uppercase tracking-[0.0em] py-1 flex items-center transition-colors"
    >
      {link.label}
    </Link>
  ))

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-2 md:py-3 ${isScrolled
        ? 'bg-cream/80 backdrop-blur-lg shadow-sm border-b border-black/5'
        : 'bg-[#FFF8F6] border-b border-transparent'
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Desktop Layout */}
        <nav className="hidden md:flex items-center justify-between w-full">
          <Link href="/" className="relative w-[20px] h-[28px] md:w-[22px] md:h-[32px] shrink-0 block">
            <Image
              src="/images/logo/inoya-rouge-logo.png"
              alt="Inoya Rouge"
              fill
              className="object-contain"
              sizes="22px"
            />
          </Link>
          {links}
        </nav>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between w-full relative">
          <Link href="/" className="relative w-[20px] h-[30px] shrink-0 block z-10">
            <Image
              src="/images/logo/inoya-rouge-logo.png"
              alt="Inoya Rouge"
              fill
              className="object-contain"
              sizes="20px"
            />
          </Link>
          <MobileMenuToggle>
            {links}
          </MobileMenuToggle>
        </div>
      </div>
    </header>
  )
}

