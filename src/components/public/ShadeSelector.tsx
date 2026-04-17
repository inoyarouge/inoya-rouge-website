'use client'

import { useState, ReactNode } from 'react'
import Image from 'next/image'
import type { Product, ProductVariant } from '@/lib/types'
import { computePrice, formatINR } from '@/lib/pricing'
import BuyNowModal from './BuyNowModal'

interface ShadeSelectorProps {
  variants: ProductVariant[]
  product: Product
  children?: ReactNode
}

export default function ShadeSelector({ variants, product, children }: ShadeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  const selectedVariant = variants[selectedIndex] ?? variants[0]

  const priceInfo = computePrice(product, selectedVariant)

  const handleBuyNowClick = () => {
    if (product.buy_url) {
      window.open(product.buy_url, '_blank', 'noopener,noreferrer')
      return
    }
    setIsBuyModalOpen(true)
  }

  return (
    <div className="bg-cream min-h-[calc(100vh-80px)] md:py-16 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-stretch">

          {/* Left Column: Images + Accordion */}
          <div className="w-full md:w-[55%] flex flex-col gap-8 md:gap-12">

            {/* Images */}
            <div className="flex flex-col-reverse md:flex-row gap-4">

              {/* Thumbnails (Left side on desktop, bottom on mobile) */}
              <div className="flex md:flex-col flex-row gap-4 overflow-x-auto md:w-24 shrink-0 md:max-h-[600px] no-scrollbar py-1 px-1">
                {variants.map((v, i) => (
                  v.image_url ? (
                    <button
                      key={v.id}
                      onClick={() => setSelectedIndex(i)}
                      className={`relative w-16 h-16 md:w-20 md:h-24 flex-shrink-0 transition-all ${i === selectedIndex
                          ? 'opacity-100 ring-1 ring-burgundy ring-offset-2'
                          : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={v.image_url}
                        alt={`${product.name} thumbnail — ${v.shade_name}`}
                        fill
                        className="object-cover rounded-sm"
                        sizes="80px"
                      />
                    </button>
                  ) : null
                ))}
              </div>

              {/* Main Featured Image */}
              <div className="relative aspect-[4/5] w-full flex-grow bg-white">
                {variants.map((v, i) =>
                  v.image_url ? (
                    <Image
                      key={v.id}
                      src={v.image_url}
                      alt={`${product.name} — ${v.shade_name}`}
                      fill
                      className={`object-cover transition-opacity duration-300 ${i === selectedIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                        }`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  ) : null
                )}
                {variants.every(v => !v.image_url) && (
                  <div className="flex items-center justify-center h-full text-gray-400 bg-warm-pink/20 text-sm">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Accordion Region */}
            {children && (
              <div className="w-full mt-4">
                {children}
              </div>
            )}
          </div>

          {/* Right Column: Product Content */}
          <div className="w-full md:w-[45%] flex flex-col md:py-4 md:sticky md:top-28 md:self-start">
            <h1 className="font-serif text-4xl lg:text-5xl leading-[1.1] text-burgundy mb-6 tracking-wide">
              {product.name}
            </h1>

            <div className="text-gray-700 text-[15px] leading-relaxed mb-6">
              {product.description || product.tagline || 'Experience the highly pigmented, long-lasting formula that delivers a smooth, flawless finish.'}
            </div>

            {/* Price */}
            <div className="mb-6">
              {priceInfo.hasDiscount ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-sans text-[28px] text-burgundy font-medium tracking-tight">
                    {formatINR(priceInfo.final)}
                  </span>
                  <span className="font-sans text-[18px] text-gray-400 line-through">
                    {formatINR(priceInfo.original)}
                  </span>
                  <span className="font-sans text-[11px] text-burgundy border border-burgundy px-2 py-[2px] tracking-wide uppercase">
                    Save {priceInfo.discountPercent}%
                  </span>
                </div>
              ) : (
                <span className="font-sans text-[28px] text-burgundy tracking-tight font-medium">
                  {formatINR(priceInfo.final)}
                </span>
              )}
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Shade Selection */}
            {variants.length > 0 && (
              <div className="mb-8">
                <div className="text-[14px] text-gray-600 mb-4 block">
                  Shade: <span className="text-gray-900 font-medium ml-1">{selectedVariant?.shade_name || 'Select a shade'}</span>
                </div>

                <div className="flex flex-wrap gap-4 px-1">
                  {variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedIndex(i)}
                      aria-label={v.shade_name}
                      className={`w-9 h-9 md:w-[38px] md:h-[38px] rounded-full flex-shrink-0 relative transition-all ${i === selectedIndex
                          ? 'ring-1 ring-offset-4 ring-gray-600 scale-105'
                          : 'ring-1 ring-gray-300 ring-offset-0 hover:scale-105 hover:shadow-sm'
                        }`}
                      style={{ backgroundColor: v.shade_color ?? '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <div className="flex items-center border border-gray-200 bg-transparent w-[100px] h-11">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-full flex justify-center items-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center text-[15px] text-gray-700 bg-transparent h-full flex items-center justify-center overflow-hidden">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex justify-center items-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full max-w-[400px]">
              <button
                type="button"
                className="w-full border border-gray-200 text-burgundy text-xs uppercase tracking-[0.15em] py-4 bg-transparent hover:border-burgundy/30 hover:bg-burgundy/5 transition-all outline-none"
              >
                AVAILABLE OFFERS
              </button>

              <button
                type="button"
                onClick={handleBuyNowClick}
                className="group/btn relative flex w-full bg-burgundy overflow-hidden text-white font-sans text-xs tracking-[0.15em] uppercase text-center min-h-[50px] items-center justify-center rounded-sm transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.01] active:scale-[0.98] outline-none border-none"
              >
                {/* Text with tracking expansion */}
                <span className="relative z-10 transition-all duration-500 ease-out group-hover/btn:tracking-[0.25em]">
                  BUY NOW
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <BuyNowModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
      />
    </div>
  )
}
