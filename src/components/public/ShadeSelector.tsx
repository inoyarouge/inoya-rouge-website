'use client'

import { useState, useMemo, useEffect, ReactNode } from 'react'
import Image from 'next/image'
import type { Product, ProductVariant, Promotion, Offer } from '@/lib/types'
import { computePriceFromOffers, formatINR, getAvailableOffers } from '@/lib/pricing'
import BuyNowModal from './BuyNowModal'
import OffersPanel from './OffersPanel'
import { ChevronDown } from 'lucide-react'
import { supabaseImageUrl } from '@/lib/supabase/imageUrl'

interface ShadeSelectorProps {
  variants: ProductVariant[]
  product: Product
  promotions?: Promotion[]
  children?: ReactNode
}

export default function ShadeSelector({ variants, product, promotions = [], children }: ShadeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [isOffersOpen, setIsOffersOpen] = useState(false)
  const [appliedOfferIds, setAppliedOfferIds] = useState<string[]>(() =>
    getAvailableOffers(product, variants[0], promotions)
      .filter((o) => o.source === 'product' || o.source === 'variant')
      .map((o) => o.id),
  )

  const selectedVariant = variants[selectedIndex] ?? variants[0]

  // The per-variant gallery. Fall back to the single `image_url` for legacy variants.
  const galleryImages = useMemo(() => {
    const g = selectedVariant?.images ?? []
    if (g.length > 0) return g.map((img) => ({ id: img.id, url: img.url }))
    if (selectedVariant?.image_url) {
      return [{ id: `legacy-${selectedVariant.id}`, url: selectedVariant.image_url }]
    }
    return [] as { id: string; url: string }[]
  }, [selectedVariant])

  // Reset the image index when the user switches to a different shade.
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedIndex])

  const offers: Offer[] = useMemo(
    () => getAvailableOffers(product, selectedVariant, promotions),
    [product, selectedVariant, promotions],
  )

  // Reconcile applied offers when the shade/variant changes. Drops IDs that no
  // longer exist (e.g. variant-scoped discount that doesn't carry over to a new
  // shade) and re-applies any auto-apply offers that have appeared.
  useEffect(() => {
    setAppliedOfferIds((prev) => {
      const valid = prev.filter((id) => offers.some((o) => o.id === id))
      const autoIds = offers
        .filter((o) => o.source === 'product' || o.source === 'variant')
        .map((o) => o.id)
      const merged = Array.from(new Set([...valid, ...autoIds]))
      return merged.length === prev.length &&
        merged.every((id) => prev.includes(id))
        ? prev
        : merged
    })
  }, [offers])

  const appliedOffers = useMemo(
    () => offers.filter((o) => appliedOfferIds.includes(o.id)),
    [offers, appliedOfferIds],
  )

  const toggleOffer = (id: string) =>
    setAppliedOfferIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const basePrice = selectedVariant?.price_override ?? product.base_price
  const priceInfo = computePriceFromOffers(basePrice, appliedOffers)
  const appliedOfferLabel =
    appliedOffers.length > 0 ? appliedOffers.map((o) => o.label).join(' + ') : null

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

              {/* Thumbnails for the selected shade's gallery */}
              <div data-lenis-prevent="true" className="flex md:flex-col flex-row gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 md:max-h-[600px] no-scrollbar py-1 px-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative w-16 h-16 md:w-20 md:h-24 flex-shrink-0 transition-all ${i === selectedImageIndex
                        ? 'opacity-100 ring-1 ring-burgundy ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={supabaseImageUrl(img.url, 160)}
                      alt={`${product.name} — ${selectedVariant?.shade_name ?? ''} thumbnail ${i + 1}`}
                      fill
                      quality={60}
                      className="object-cover rounded-sm"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>

              {/* Main Featured Image — opacity-swap within the selected shade's gallery */}
              <div className="relative aspect-[4/5] w-full flex-grow bg-white">
                {galleryImages.map((img, i) => (
                  <Image
                    key={img.id}
                    src={supabaseImageUrl(img.url, 800)}
                    alt={`${product.name} — ${selectedVariant?.shade_name ?? ''}`}
                    fill
                    quality={70}
                    className={`object-cover transition-opacity duration-300 ${i === selectedImageIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                      }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0 && selectedIndex === 0}
                  />
                ))}
                {galleryImages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-400 bg-warm-pink/20 text-sm">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Accordion Region */}
            {children && (
              <div className="w-full mt-4 hidden md:block">
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
                onClick={() => setIsOffersOpen((o) => !o)}
                aria-expanded={isOffersOpen}
                className="w-full border border-gray-200 text-burgundy text-xs uppercase tracking-[0.15em] py-4 bg-transparent hover:border-burgundy/30 hover:bg-burgundy/5 transition-all outline-none flex items-center justify-center gap-2"
              >
                <span>AVAILABLE OFFERS</span>
                {offers.length > 0 && (
                  <span className="text-xs text-burgundy/70">({offers.length})</span>
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isOffersOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOffersOpen && (
                <OffersPanel
                  offers={offers}
                  appliedOfferIds={appliedOfferIds}
                  onToggle={toggleOffer}
                  savings={priceInfo.original - priceInfo.final}
                />
              )}

              <button
                type="button"
                onClick={handleBuyNowClick}
                className="group/btn relative flex w-full bg-burgundy overflow-hidden text-white font-sans text-xs tracking-[0.15em] uppercase text-center min-h-[50px] items-center justify-center rounded-sm outline-none border-none"
              >
                <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
                <span className="relative z-10">
                  BUY NOW
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Accordion Region */}
        {children && (
          <div className="w-full mt-12 md:hidden">
            {children}
          </div>
        )}
      </div>

      <BuyNowModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        priceInfo={priceInfo}
        appliedOfferLabel={appliedOfferLabel}
      />
    </div>
  )
}
