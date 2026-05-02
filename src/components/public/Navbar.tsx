"use client"


import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenuToggle from './MobileMenuToggle'

const navLinks = [
  { href: '/', label: 'HOME' },
  {
    href: '/shop',
    label: 'SHOP',
    dropdown: [
      { name: 'EYES', image: '/images/categories/eyes.png', href: '/shop/eyes' },
      { name: 'FACE', image: '/images/categories/face.png', href: '/shop/face' },
      { name: 'LIPS', image: '/images/categories/lips.png', href: '/shop/lips' },
    ]
  },
  { href: '/about-us', label: 'ABOUT US' },
  { href: '/community', label: 'COMMUNITY' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const links = navLinks.map(link => (
    <div key={link.href} className="group/navitem h-full flex items-center">
      <Link
        href={link.href}
        className="nav-underline-link text-[#211a17] hover:text-burgundy text-[10px] md:text-[14px] font-sans uppercase tracking-[0.0em] py-1 flex items-center transition-colors"
      >
        {link.label}
      </Link>

      {link.dropdown && (
        <div className="hidden md:block absolute top-full left-0 w-full bg-[#fff8f6] shadow-xl border-t border-black/5
          opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible mega-dropdown transform -translate-y-3 group-hover/navitem:translate-y-0">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 flex justify-center gap-6 md:gap-12">
            {link.dropdown.map((item, i) => (
              <Link href={item.href} key={item.name} style={{ animationDelay: `${i * 100}ms` }} className="mega-card group/dropitem relative w-[280px] aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
                <Image src={item.image} alt={item.name} fill className="object-cover transform group-hover/dropitem:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211a17]/80 via-[#211a17]/20 to-transparent opacity-60 group-hover/dropitem:opacity-80 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <span className="text-white font-sans font-medium tracking-widest text-xl drop-shadow-lg translate-y-2 group-hover/dropitem:translate-y-0 transition-transform duration-500">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  ))

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[50px] md:h-[60px] flex items-center bg-cream/95 shadow-sm border-b border-black/5"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full h-full flex items-center">
        {/* Desktop Layout */}
        <nav className="hidden md:flex items-center justify-between w-full h-full">
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
        <div className="md:hidden flex items-center justify-between w-full relative h-full">
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
            <div className="flex flex-col gap-6 mt-4 pb-12 w-full">
              {navLinks.map((link) => (
                <div key={link.href} className="flex flex-col">
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setOpenDropdown(openDropdown === link.label ? null : link.label)
                        }}
                        className="text-[#211a17] text-[20px] font-sans font-medium uppercase tracking-widest py-3 border-b border-black/5 flex items-center justify-between w-full text-left"
                      >
                        {link.label}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-burgundy transition-transform duration-300 ${openDropdown === link.label ? 'rotate-180' : ''}`}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openDropdown === link.label ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-4 pl-4 border-l border-black/10">
                          {link.dropdown.map((item) => (
                            <Link key={item.name} href={item.href} className="text-[#211a17]/80 text-[16px] font-sans uppercase tracking-widest py-1 flex items-center gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-burgundy/40"></span>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[#211a17] text-[20px] font-sans font-medium uppercase tracking-widest py-3 border-b border-black/5 block"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </MobileMenuToggle>
        </div>
      </div>
    </header>
  )
}

