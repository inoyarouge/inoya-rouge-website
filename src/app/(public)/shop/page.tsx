import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CategoryFilter from '@/components/public/CategoryFilter'
import type { Product, ProductVariant } from '@/lib/types'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Shop | Inoya Rouge',
  description:
    'Explore our collections of Indian luxury cosmetics — Lips, Eyes, and Face.',
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function ProductGrid() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const products: Product[] = (data ?? []).map(p => ({
    ...p,
    variants: (p.product_variants as ProductVariant[] ?? [])
      .filter((v: ProductVariant) => v.is_active)
      .sort((a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order),
  }))

  return <CategoryFilter products={products} />
}

export default function ShopPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl mb-2 text-center">Shop</h1>
      <p className="text-gray-400 text-sm text-center mb-10">
        Browse our full collection
      </p>
      <Suspense fallback={<SkeletonGrid />}>
        <ProductGrid />
      </Suspense>
    </section>
  )
}
