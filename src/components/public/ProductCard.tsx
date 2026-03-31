import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants?.filter(v => v.is_active) ?? []
  const firstVariant = activeVariants[0]
  const price = firstVariant?.price_override ?? product.base_price
  const shadeCount = activeVariants.length

  return (
    <Link href={`/shop/${product.id}`} className="block group">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
        {firstVariant?.image_url ? (
          <Image
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            src={firstVariant.image_url}
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
          <span className="font-medium text-gray-900">₹{price}</span>
          {shadeCount > 1 && (
            <span className="text-xs text-gray-400">{shadeCount} shades</span>
          )}
        </div>
      </div>
    </Link>
  )
}
