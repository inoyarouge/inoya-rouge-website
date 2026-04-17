'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/public/ProductCard'
import type { Product } from '@/lib/types'

export default function CuratedCollectionCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canGoPrev, setCanGoPrev] = useState(false)
  const [canGoNext, setCanGoNext] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanGoPrev(scrollLeft > 0)
      // Allow a tiny margin of error (1-2px) for rounding logic
      setCanGoNext(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const handleNext = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement
      // Scroll by one item's width + a bit extra to trigger snapping to next
      const scrollAmount = firstChild.offsetWidth + 20
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement
      const scrollAmount = firstChild.offsetWidth + 20
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const displayItems = [...products]
  if (displayItems.length > 0 && displayItems.length < 3) {
    while (displayItems.length < 3) {
      displayItems.push({
        id: `placeholder-${displayItems.length}`,
        isPlaceholder: true,
      } as any)
    }
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={`hidden lg:flex absolute -left-8 top-[132px] w-[11px] h-[17px] items-center justify-center z-10 transition-opacity ${canGoPrev ? 'opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'}`}
        aria-label="Previous"
      >
        <Image src="/images/arrows/left-arrow.svg" alt="" width={11} height={17} sizes="11px" />
      </button>

      {/* Carousel Track */}
      <div className="overflow-hidden p-2 -m-2">
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-10 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayItems.map(p => (
            <div 
              key={p.id} 
              className={`snap-start shrink-0 w-full sm:w-[calc(50%-12px)] ${
                displayItems.length === 1 ? 'lg:w-full' :
                displayItems.length === 2 ? 'lg:w-[calc((100%-40px)/2)]' :
                displayItems.length === 3 ? 'lg:w-[calc((100%-80px)/3)]' :
                'lg:w-[calc(25%-30px)]'
              }`}
            >
              {(p as any).isPlaceholder ? (
                <div className="h-full select-none">
                  <div className="relative aspect-[211/264] bg-[#EADDD6]/30 flex flex-col items-center justify-center text-center px-4">
                    <span className="font-sans text-[13px] text-[#211a17]/50 tracking-[0.1em] uppercase">More on the way</span>
                  </div>
                  {/* Invisible spacer to maintain height alignment with other cards */}
                  <div className="mt-3 invisible">
                    <h3 className="font-sans text-[20px] leading-tight">Placeholder</h3>
                    <p className="font-sans text-[14px] mt-1">₹0.00</p>
                  </div>
                  <div className="py-3 mt-2 min-h-[44px] invisible">DISCOVER</div>
                </div>
              ) : (
                <ProductCard product={p as Product} variant="curated" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={`hidden lg:flex absolute -right-8 top-[132px] w-[11px] h-[17px] items-center justify-center z-10 transition-opacity ${canGoNext ? 'opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'}`}
        aria-label="Next"
      >
        <Image src="/images/arrows/right-arrow.svg" alt="" width={11} height={17} sizes="11px" className="-scale-x-100" />
      </button>
    </div>
  )
}
