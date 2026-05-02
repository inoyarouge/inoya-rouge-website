'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2"
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-in Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-sm bg-[#fff8f6] z-50 shadow-2xl p-6 md:p-10 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="relative w-[30px] h-[40px]">
            <Image
              src="/images/logo/inoya-rouge-logo.png"
              alt="Inoya Rouge"
              fill
              className="object-contain"
              sizes="30px"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-burgundy bg-transparent rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav onClick={() => setIsOpen(false)} className="flex flex-col h-full w-full">
          {children}
        </nav>
      </div>
    </div>
  )
}
