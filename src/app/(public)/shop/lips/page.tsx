import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ShopClient from '@/components/public/ShopClient'
import TrustBadges from '@/components/public/TrustBadges'
import type { Product, ProductVariant, Collection, Discount, Promotion, VariantImage } from '@/lib/types'
import { normalizeDiscount } from '@/lib/pricing'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Lips | Inoya Rouge',
  description: 'Shop our luxury lip collection — bold colours, lasting care.',
}

function ShopSkeleton() {
  return (
    <div>
      <section className="w-full h-[400px] md:h-[442px] bg-gray-200 animate-pulse" />
      <section className="bg-[#FFF3EE]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i}>
                <div className="aspect-[211/264] bg-gray-200 animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/4 bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

async function ShopDataWrapper() {
  const supabase = await createClient()

  const [productsRes, collectionsRes, promotionsRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_variants(*, discounts(*), variant_images(*)), discounts(*)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('collections')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true }),
    supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true),
  ])

  const products: Product[] = (productsRes.data ?? []).map(p => ({
    ...p,
    variants: (p.product_variants as (ProductVariant & {
      discounts?: unknown
      variant_images?: VariantImage[]
    })[] ?? [])
      .filter((v) => v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ discounts, variant_images, ...rest }) => ({
        ...rest,
        discount: normalizeDiscount(discounts as Discount | Discount[] | null | undefined),
        images: (variant_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
      })),
    discount: normalizeDiscount(p.discounts),
  }))

  const collections = (collectionsRes.data ?? []) as Collection[]
  const promotions = (promotionsRes.data ?? []) as Promotion[]

  return <ShopClient products={products} collections={collections} promotions={promotions} initialCategory="Lips" />
}

export default function LipsPage() {
  return (
    <div>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopDataWrapper />
      </Suspense>
      <TrustBadges />
    </div>
  )
}
