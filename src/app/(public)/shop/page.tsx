import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ShopClient from '@/components/public/ShopClient'
import TrustBadges from '@/components/public/TrustBadges'
import type { Product, ProductVariant, Collection } from '@/lib/types'
import { normalizeDiscount } from '@/lib/pricing'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Shop | Inoya Rouge',
  description:
    'Explore our collections of Indian luxury cosmetics — Lips, Eyes, and Face.',
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[211/264] bg-gray-200 animate-pulse" />
          <div className="mt-3 space-y-2">
            <div className="h-5 w-3/4 bg-gray-200 animate-pulse" />
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse" />
            <div className="h-[38px] bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ShopSkeleton() {
  return (
    <div>
      <section className="w-full h-[400px] md:h-[442px] bg-gray-200 animate-pulse" />
      <section className="bg-[#FFF3EE]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-8 pb-16">
          <SkeletonGrid />
        </div>
      </section>
    </div>
  )
}

async function ShopDataWrapper() {
  const supabase = await createClient()

  const [productsRes, collectionsRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_variants(*), discounts(*)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('collections')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true }),
  ])

  const products: Product[] = (productsRes.data ?? []).map(p => ({
    ...p,
    variants: (p.product_variants as ProductVariant[] ?? [])
      .filter((v: ProductVariant) => v.is_active)
      .sort((a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order),
    discount: normalizeDiscount(p.discounts),
  }))

  const collections = (collectionsRes.data ?? []) as Collection[]

  return <ShopClient products={products} collections={collections} />
}

export default function ShopPage() {
  return (
    <div>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopDataWrapper />
      </Suspense>
      <TrustBadges />
    </div>
  )
}
