'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product, ProductVariant } from '@/lib/types'
import { computePrice, formatINR } from '@/lib/pricing'

function primaryImageUrl(v: ProductVariant | undefined): string | null {
  if (!v) return null
  const gallery = v.images ?? []
  if (gallery.length > 0) {
    const sorted = [...gallery].sort((a, b) => a.sort_order - b.sort_order)
    return sorted[0].url
  }
  return v.image_url ?? null
}

export default function ProductCard({ product, variant = 'default' }: { product: Product; variant?: 'default' | 'curated' | 'shop' }) {
  const activeVariants = product.variants?.filter(v => v.is_active) ?? []

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(activeVariants[0])
  const currentVariant = selectedVariant || activeVariants[0]
  const currentImage = primaryImageUrl(currentVariant)

  const priceInfo = computePrice(product, currentVariant)
  const shadeCount = activeVariants.length

  /* ── Shop variant — matches Figma shop page design ── */
  if (variant === 'shop') {
    return (
      <div className="group flex flex-col relative w-full bg-transparent h-full">
        <Link href={`/shop/${product.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 rounded-md flex-grow flex flex-col">
          {/* Product Image — 211:264 ratio from Figma */}
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7] group-hover:bg-[#F2F2F2] transition-colors rounded-sm">
            {currentImage ? (
              <Image
                fill
                className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                src={currentImage}
                alt={product.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm font-sans">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4 px-1">
            {/* Sub-category / Type */}
            <div className="text-[10px] font-sans tracking-[2px] text-gray-500 uppercase mb-1">
              {product.category}
            </div>

            {/* Product Name — agatho regular (mapped to font-display), left aligned */}
            <h3 className="font-display text-[18px] md:text-[22px] text-burgundy tracking-wide leading-snug line-clamp-2 pl-0.5 group-hover:text-burgundy-red transition-colors">
              {product.name}
            </h3>

            {/* Price — Left aligned */}
            <div className="flex flex-col items-start mt-2 gap-0.5 pl-0.5">
              {priceInfo.hasDiscount ? (
                <div className="flex items-center gap-2">
                  <p className="font-sans text-[14px] text-burgundy tracking-[1px] font-medium">
                    {formatINR(priceInfo.final)}
                  </p>
                  <p className="font-sans text-[12px] text-gray-400 line-through tracking-[1px]">
                    {formatINR(priceInfo.original)}
                  </p>
                </div>
              ) : (
                <p className="font-sans text-[14px] text-burgundy tracking-[1px] font-medium">
                  {formatINR(priceInfo.final)}
                </p>
              )}
            </div>
          </div>
        </Link>

        {/* Swatches — outside the Link so clicks don't navigate */}
        <div className="mt-auto px-1 pt-6 pb-4">
          <div className="flex items-center gap-2 pl-0.5">
            {activeVariants.slice(0, 4).map((v) => (
              <button
                type="button"
                key={v.id}
                onMouseEnter={() => setSelectedVariant(v)}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedVariant(v)
                }}
                aria-label={v.shade_name}
                aria-pressed={currentVariant?.id === v.id}
                title={v.shade_name}
                className={`w-[20px] h-[20px] rounded-full border ${currentVariant?.id === v.id ? 'border-burgundy' : 'border-burgundy/20'} p-[1px] hover:border-burgundy cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2`}
              >
                <span
                  className="block w-full h-full rounded-full"
                  style={{ backgroundColor: v.shade_color || '#e0d6c8' }}
                />
              </button>
            ))}
            {shadeCount > 4 && (
              <div className="w-[24px] h-[24px] flex items-center justify-center rounded-full border border-burgundy/20 text-burgundy/60 text-[9px] bg-transparent font-sans ml-1">
                +{shadeCount - 4}
              </div>
            )}
          </div>
        </div>

        {/* CHOOSE SHADE button */}
        <div className="mt-0">
          <Link
            href={`/shop/${product.slug}`}
            className="group/btn relative flex w-full bg-transparent overflow-hidden border border-burgundy/20 text-burgundy font-sans text-[11px] tracking-[2px] uppercase text-center min-h-[44px] items-center justify-center rounded-sm transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:border-[#7D0000] hover:scale-[1.02] hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
          >
            {/* Sliding background layer */}
            <span className="absolute inset-0 w-full h-full bg-[#7D0000] -translate-x-[101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />

            {/* Text */}
            <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-white">
              CHOOSE SHADE
            </span>
          </Link>
        </div>
      </div>
    )
  }

  /* ── Curated variant — used on homepage carousel ── */
  if (variant === 'curated') {
    return (
      <div className="group">
        <Link href={`/shop/${product.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 rounded-md">
          <div className="relative aspect-[211/264] overflow-hidden bg-gray-300">
            {currentImage ? (
              <Image
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                src={currentImage}
                alt={product.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No image
              </div>
            )}
          </div>
          <div className="mt-3">
            <h3 className="font-sans text-[20px] text-burgundy tracking-tight leading-tight">{product.name}</h3>
            {priceInfo.hasDiscount ? (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-sans text-[14px] text-[#720B0B] font-medium tracking-tight">
                  {formatINR(priceInfo.final)}
                </span>
                <span className="font-sans text-[12px] text-gray-400 line-through tracking-tight">
                  {formatINR(priceInfo.original)}
                </span>
                <span className="font-sans text-[10px] text-[#720B0B] border border-[#720B0B] px-1 py-[1px] tracking-wide">
                  -{priceInfo.discountPercent}%
                </span>
              </div>
            ) : (
              <p className="font-sans text-[14px] text-black tracking-tight mt-1">
                {formatINR(priceInfo.final)}
              </p>
            )}
          </div>
        </Link>
        <Link
          href={`/shop/${product.slug}`}
          className="group/btn relative flex w-full bg-peach overflow-hidden text-burgundy font-sans text-[11px] tracking-[0.6px] uppercase text-center mt-2 min-h-[44px] items-center justify-center rounded-sm transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:-translate-y-px hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
        >
          {/* Sliding background layer */}
          <span className="absolute inset-0 w-full h-full bg-[#7D0000] -translate-x-[101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />

          {/* Text */}
          <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-white">
            DISCOVER
          </span>
        </Link>
      </div>
    )
  }

  /* ── Default variant — generic card with category label ── */
  return (
    <Link href={`/shop/${product.slug}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 rounded-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
        {currentVariant?.image_url ? (
          <Image
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            src={currentVariant.image_url}
            alt={product.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</p>
        <h3 className="font-serif text-lg leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between pt-1">
          {priceInfo.hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#720B0B]">{formatINR(priceInfo.final)}</span>
              <span className="text-xs text-gray-400 line-through">{formatINR(priceInfo.original)}</span>
            </div>
          ) : (
            <span className="font-medium text-gray-900">{formatINR(priceInfo.final)}</span>
          )}
          {shadeCount > 1 && (
            <span className="text-xs text-gray-400">{shadeCount} shades</span>
          )}
        </div>
      </div>
    </Link>
  )
}

