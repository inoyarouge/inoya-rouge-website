'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/public/ProductCard'
import type { Product } from '@/lib/types'

export default function CuratedCollectionCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canGoPrev, setCanGoPrev] = useState(false)
  const [canGoNext, setCanGoNext] = useState(true)
  const [arrowTop, setArrowTop] = useState<number | null>(null)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanGoPrev(scrollLeft > 0)
      // Allow a tiny margin of error (1-2px) for rounding logic
      setCanGoNext(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2)
    }
  }

  const measureImageBox = () => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.firstElementChild
      if (firstCard) {
        // Find the image container which has the 211/264 aspect ratio
        const imageBox = firstCard.querySelector('.aspect-\\[211\\/264\\]')
        if (imageBox) {
          setArrowTop((imageBox as HTMLElement).offsetHeight / 2)
        }
      }
    }
  }

  useEffect(() => {
    handleScroll()

    // Slight delay to ensure images/layout are painted before measuring
    const timer = setTimeout(measureImageBox, 50)

    const onResize = () => {
      handleScroll()
      measureImageBox()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
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
        className={`flex absolute -left-5 lg:-left-8 w-[11px] h-[17px] items-center justify-center z-10 transition-opacity ${canGoPrev ? 'opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'}`}
        style={{
          top: arrowTop !== null ? `${arrowTop}px` : '35%',
          transform: 'translateY(-50%)'
        }}
        aria-label="Previous"
      >
        <Image src="/images/arrows/left-arrow.svg" alt="" width={11} height={17} sizes="11px" />
      </button>

      {/* Carousel Track */}
      <div className="overflow-hidden p-2 -m-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-10 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayItems.map(p => (
            <div
              key={p.id}
              className={`snap-start shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-8px)] ${displayItems.length === 1 ? 'lg:w-full' :
                displayItems.length === 2 ? 'lg:w-[calc((100%-40px)/2)]' :
                  displayItems.length === 3 ? 'lg:w-[calc((100%-80px)/3)]' :
                    'lg:w-[calc(25%-30px)]'
                }`}
            >
              {(p as any).isPlaceholder ? (
                <div className="h-full select-none flex flex-col group cursor-default">
                  <div className="relative aspect-[211/264] overflow-hidden rounded-[2px] bg-[#EADDD6]/30">
                    <Image
                      src="/images/mobile images/more to come mobile.jpeg"
                      alt="More on the way"
                      fill
                      className="object-cover grayscale-[0.5] opacity-80 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 group-hover:grayscale-[0.2] group-hover:opacity-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Dark gradient for mystery */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 transition-opacity duration-700 opacity-60 group-hover:opacity-30" />
                    
                    {/* Small Lock / Sparkle Icon */}
                    <div className="absolute top-4 right-4 text-white opacity-0 transition-all duration-700 -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 drop-shadow-md">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>

                    {/* Angled Coming Soon Ticker */}
                    <div className="absolute top-1/2 -left-[10%] w-[120%] overflow-hidden bg-white/95 backdrop-blur-md py-3 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -rotate-6 shadow-2xl border-y border-white/40">
                      <div className="flex whitespace-nowrap w-fit animate-marquee">
                        {[1, 2].map((group) => (
                          <div key={group} className="flex items-center">
                            {[...Array(6)].map((_, i) => (
                              <span key={i} className="font-sans text-[12px] tracking-[0.25em] text-burgundy uppercase font-bold mx-3 flex items-center drop-shadow-sm">
                                COMING SOON
                                <span className="w-1.5 h-1.5 rounded-full bg-burgundy/30 mx-3" />
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Visible text to match other cards perfectly */}
                  <div className="mt-3 text-center">
                    <h3 className="font-sans text-[20px] text-gray-400 tracking-tight leading-tight transition-colors duration-500 group-hover:text-burgundy">Next Collection</h3>
                    <p className="font-sans text-[13px] text-gray-400/70 tracking-wide mt-1 transition-colors duration-500 group-hover:text-burgundy/60 uppercase">
                      Arriving Soon
                    </p>
                  </div>
                  
                  {/* Disabled button state */}
                  <div className="relative flex w-full bg-gray-100 text-gray-400 font-sans text-[11px] tracking-[0.6px] uppercase text-center mt-3 min-h-[44px] items-center justify-center rounded-sm transition-all duration-500 border border-transparent group-hover:bg-[#F2F0E9] group-hover:text-burgundy">
                    STAY TUNED
                  </div>
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
        className={`flex absolute -right-5 lg:-right-8 w-[11px] h-[17px] items-center justify-center z-10 transition-opacity ${canGoNext ? 'opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'}`}
        style={{
          top: arrowTop !== null ? `${arrowTop}px` : '35%',
          transform: 'translateY(-50%)'
        }}
        aria-label="Next"
      >
        <Image src="/images/arrows/right-arrow.svg" alt="" width={11} height={17} sizes="11px" className="-scale-x-100" />
      </button>
    </div>
  )
}
