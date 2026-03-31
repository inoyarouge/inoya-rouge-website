'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product, ProductVariant } from '@/lib/types'

interface ShadeSelectorProps {
  variants: ProductVariant[]
  product: Product
}

export default function ShadeSelector({ variants, product }: ShadeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedVariant = variants[selectedIndex] ?? variants[0]

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[60%_40%] gap-8">
      {/* Image area — all variants stacked, opacity swap */}
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        {variants.map((v, i) =>
          v.image_url ? (
            <Image
              key={v.id}
              src={v.image_url}
              alt={`${product.name} — ${v.shade_name}`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                i === selectedIndex ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={i === 0}
            />
          ) : null
        )}
        {variants.every(v => !v.image_url) && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-4">
        <span className="text-[10px] uppercase tracking-widest text-gray-400">
          {product.collection ?? product.category}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
        {product.tagline && <p className="text-gray-500">{product.tagline}</p>}

        {/* Shade swatches */}
        {variants.length > 1 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">{selectedVariant?.shade_name}</p>
            <div className="flex overflow-x-auto gap-3 pb-2" style={{ overscrollBehaviorX: 'contain' }}>
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={v.shade_name}
                  className={`w-12 h-12 md:w-10 md:h-10 rounded-full flex-shrink-0 aspect-square transition-shadow ${
                    i === selectedIndex
                      ? 'ring-2 ring-offset-2 ring-brand-rose'
                      : ''
                  }`}
                  style={{ backgroundColor: v.shade_color ?? '#ccc' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Single variant — show shade name without swatches */}
        {variants.length === 1 && selectedVariant && (
          <p className="text-sm text-gray-500">{selectedVariant.shade_name}</p>
        )}

        {/* Price */}
        <p className="text-2xl font-medium">
          ₹{selectedVariant?.price_override ?? product.base_price}
        </p>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        )}

        {/* CTA */}
        <button
          disabled
          className="mt-4 bg-gray-200 text-gray-500 cursor-not-allowed px-8 py-4 min-h-[44px] rounded text-sm uppercase tracking-widest font-medium"
        >
          Available Soon
        </button>
      </div>
    </div>
  )
}
