import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ShadeSelector from '@/components/public/ShadeSelector'
import ProductCard from '@/components/public/ProductCard'
import type { Product, ProductVariant } from '@/lib/types'

export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, tagline, description')
    .eq('id', id)
    .single()

  return {
    title: product ? `${product.name} | Inoya Rouge` : 'Product | Inoya Rouge',
    description:
      product?.tagline ?? product?.description ?? 'Shop Inoya Rouge luxury cosmetics',
  }
}

function SkeletonRelated() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
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
    .select('*, product_variants(*)')
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
  }))

  if (!products.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: rawProduct } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  if (!rawProduct) notFound()

  const product: Product = {
    ...rawProduct,
    variants: (rawProduct.product_variants as ProductVariant[] ?? [])
      .filter((v: ProductVariant) => v.is_active)
      .sort((a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ShadeSelector variants={product.variants ?? []} product={product} />

      {/* Related products */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl mb-6">You May Also Like</h2>
        <Suspense fallback={<SkeletonRelated />}>
          <RelatedProducts
            category={product.category}
            excludeId={product.id}
          />
        </Suspense>
      </section>
    </div>
  )
}
