import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ShadeSelector from '@/components/public/ShadeSelector'
import ProductAccordion from '@/components/public/ProductAccordion'
import ProductCard from '@/components/public/ProductCard'
import type { Product, ProductVariant } from '@/lib/types'
import { normalizeDiscount } from '@/lib/pricing'

export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, tagline, description')
    .eq('slug', slug)
    .single()

  return {
    title: product ? `${product.name} | Inoya Rouge` : 'Product | Inoya Rouge',
    description:
      product?.tagline ?? product?.description ?? 'Shop Inoya Rouge luxury cosmetics',
  }
}

function SkeletonRelated() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col">
          <div className="aspect-[4/5] bg-gray-100 rounded-sm animate-pulse" />
          <div className="mt-4 space-y-2 flex-grow">
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse mb-1" />
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
          <div className="h-11 w-full bg-gray-100 rounded-sm animate-pulse mt-4" />
        </div>
      ))}
    </div>
  )
}

async function RelatedProducts({
  category,
  excludeId,
}: {
  category: string
  excludeId: string
}) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_variants(*), discounts(*)')
    .eq('category', category)
    .eq('is_active', true)
    .neq('id', excludeId)
    .order('sort_order', { ascending: true })
    .limit(4)

  const products: Product[] = (data ?? []).map(p => ({
    ...p,
    variants: (p.product_variants as ProductVariant[] ?? [])
      .filter((v: ProductVariant) => v.is_active)
      .sort((a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order),
    discount: normalizeDiscount(p.discounts),
  }))

  if (!products.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map(p => (
        <ProductCard key={p.id} product={p} variant="shop" />
      ))}
    </div>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawProduct } = await supabase
    .from('products')
    .select('*, product_variants(*), discounts(*)')
    .eq('slug', slug)
    .single()

  if (!rawProduct) notFound()

  const product: Product = {
    ...rawProduct,
    variants: (rawProduct.product_variants as ProductVariant[] ?? [])
      .filter((v: ProductVariant) => v.is_active)
      .sort((a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order),
    discount: normalizeDiscount(rawProduct.discounts),
  }

  // Build accordion items from product data (only show non-empty sections)
  const accordionItems = [
    { title: 'About the Product', content: product.about_product },
    { title: 'What Makes It Unique?', content: product.what_makes_unique },
    { title: 'How to Use?', content: product.how_to_use },
    { title: 'Ingredients', content: product.ingredients },
    { title: 'Additional Information', content: product.additional_info },
  ].filter((item): item is { title: string; content: string } => !!item.content)

  return (
    <div>
      {/* Hero section with gradient background */}
      <ShadeSelector variants={product.variants ?? []} product={product}>
        {accordionItems.length > 0 && (
          <ProductAccordion items={accordionItems} />
        )}
      </ShadeSelector>

      {/* Related products */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 className="font-serif text-2xl mb-6">You May Also Like</h2>
        <Suspense fallback={<SkeletonRelated />}>
          <RelatedProducts
            category={product.category}
            excludeId={product.id}
          />
        </Suspense>
      </section>

      {/* Brand quote & Trust badges */}
      <section className="bg-[#FFF3EE] py-16 md:py-24 w-full overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center">
          <h2 className="text-center font-sans font-medium text-[clamp(24px,3vw,32px)] text-[#720B0B] leading-[1.3] mb-12 md:mb-16">
            Beauty should never come at <br /> the cost of your skin.
          </h2>
          
          <div className="w-full flex-wrap justify-center gap-8 md:gap-10 lg:gap-[4.5rem] items-center flex">
            {[
              { name: 'Cruelty Free', image: '/images/badges/cruelty-free.svg', width: 80, height: 80 },
              { name: 'FDA Approved', image: '/images/badges/fda-approved.svg', width: 80, height: 80 },
              { name: 'Made in India', image: '/images/badges/made-in-india.svg', width: 110, height: 64 },
              { name: 'Chemical Free', image: '/images/badges/chemical-free.svg', width: 80, height: 80 },
              { name: 'Vitamin E', image: '/images/badges/vitamin-e.svg', width: 80, height: 80 },
              { name: 'Paraben Free', image: '/images/badges/paraben-free.svg', width: 80, height: 80 },
              { name: 'Vegan', image: '/images/badges/vegan.svg', width: 95, height: 80 },
            ].map((badge) => (
              <div 
                key={badge.name}
                className="relative flex items-center justify-center shrink-0"
                style={{ width: badge.width, height: badge.height }}
              >
                <Image
                  src={badge.image}
                  alt={badge.name}
                  fill
                  className="object-contain"
                  sizes={`${Math.max(badge.width, badge.height)}px`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
