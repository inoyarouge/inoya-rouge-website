'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-72 bg-cream z-50 shadow-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-[22px] h-[30px]">
                <Image
                  src="/images/logo/inoya-rouge-logo.png"
                  alt="Inoya Rouge"
                  fill
                  className="object-contain"
                  sizes="22px"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav onClick={() => setIsOpen(false)} className="flex flex-col gap-1">
              {children}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
