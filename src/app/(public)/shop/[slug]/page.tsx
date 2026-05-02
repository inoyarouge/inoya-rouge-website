import { Suspense, cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ShadeSelector from '@/components/public/ShadeSelector'
import ProductAccordion from '@/components/public/ProductAccordion'
import ProductCard from '@/components/public/ProductCard'
import PromotionBannerResolver from '@/components/public/PromotionBannerResolver'
import TrustBadges from '@/components/public/TrustBadges'
import type { Product, ProductVariant, Discount, Promotion, VariantImage } from '@/lib/types'
import { normalizeDiscount, isPromotionLive, promotionAppliesTo } from '@/lib/pricing'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const getProductBySlug = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_variants(*, discounts(*), variant_images(*)), discounts(*)')
    .eq('slug', slug)
    .single()
  return data
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return {
    title: product ? `${product.name} | Inoya Rouge` : 'Product | Inoya Rouge',
    description:
      product?.tagline ?? product?.description ?? 'Shop Inoya Rouge luxury cosmetics',
  }
}

function SkeletonRelated() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
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
    .select('*, product_variants(*, discounts(*), variant_images(*)), discounts(*)')
    .eq('category', category)
    .eq('is_active', true)
    .neq('id', excludeId)
    .order('sort_order', { ascending: true })
    .limit(4)

  const products: Product[] = (data ?? []).map(p => ({
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

  if (!products.length) return null

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <h2 className="font-serif text-xl md:text-2xl mb-4 md:mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
        {products.map(p => (
          <ProductCard key={p.id} product={p} variant="shop" />
        ))}
      </div>
    </section>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const [rawProduct, promotionsRes] = await Promise.all([
    getProductBySlug(slug),
    supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true),
  ])

  if (!rawProduct) notFound()

  const product: Product = {
    ...rawProduct,
    variants: (rawProduct.product_variants as (ProductVariant & {
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
    discount: normalizeDiscount(rawProduct.discounts),
  }

  const allPromotions = (promotionsRes.data ?? []) as Promotion[]
  const activePromotions = allPromotions.filter(
    (p) => isPromotionLive(p) && promotionAppliesTo(p, product),
  )

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
      <PromotionBannerResolver category={product.category} />
      {/* Hero section with gradient background */}
      <ShadeSelector variants={product.variants ?? []} product={product} promotions={activePromotions}>
        {accordionItems.length > 0 && (
          <ProductAccordion items={accordionItems} />
        )}
      </ShadeSelector>

      {/* Related products */}
      <Suspense fallback={<SkeletonRelated />}>
        <RelatedProducts
          category={product.category}
          excludeId={product.id}
        />
      </Suspense>

      {/* Brand quote & Trust badges */}
      <TrustBadges />
    </div>
  )
}
