'use client'

import { useState } from 'react'
import Link from 'next/link'
import MobileMenuToggle from './MobileMenuToggle'

type DropdownItem = { name: string; image: string; href: string }
type NavLink = { href: string; label: string; dropdown?: DropdownItem[] }

export default function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <MobileMenuToggle>
      <div className="flex flex-col gap-6 mt-4 pb-12 w-full">
        {navLinks.map((link) => (
          <div key={link.href} className="flex flex-col">
            {link.dropdown ? (
              <>
                <div className="flex items-center justify-between w-full border-b border-black/5">
                  <Link
                    href={link.href}
                    className="text-[#211a17] text-[20px] font-sans font-medium uppercase tracking-widest py-3 block flex-1"
                  >
                    {link.label}
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpenDropdown(openDropdown === link.label ? null : link.label)
                    }}
                    className="p-3 pr-0"
                    aria-label={`Toggle ${link.label} submenu`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-burgundy transition-transform duration-300 ${openDropdown === link.label ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
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
  )
}
