import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import VariantManager from '@/components/admin/VariantManager'
import type { Product, ProductVariant, Collection } from '@/lib/types'
import { normalizeDiscount } from '@/lib/pricing'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const isNew = id === 'new'
  const supabase = await createClient()

  const collectionsPromise = supabase
    .from('collections')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })

  let product: Product | null = null
  let variants: ProductVariant[] = []
  let collections: Collection[] = []

  if (!isNew) {
    const productPromise = supabase
      .from('products')
      .select('*, product_variants(*), discounts(*)')
      .eq('id', id)
      .single()

    const [productRes, collectionsRes] = await Promise.all([
      productPromise,
      collectionsPromise,
    ])

    if (!productRes.data) notFound()

    const { product_variants, discounts, ...rest } = productRes.data
    product = { ...rest, discount: normalizeDiscount(discounts) } as Product
    variants = (product_variants ?? []) as ProductVariant[]
    variants.sort((a, b) => a.sort_order - b.sort_order)
    collections = (collectionsRes.data ?? []) as Collection[]
  } else {
    const { data } = await collectionsPromise
    collections = (data ?? []) as Collection[]
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <Link
        href="/admin/products"
        prefetch={false}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <h1 className="text-3xl font-display text-gray-900 mb-8">
        {isNew ? 'Add Product' : `Edit: ${product?.name}`}
      </h1>

      <ProductForm product={product} collections={collections} />

      {!isNew && product && (
        <div className="mt-12">
          <VariantManager productId={product.id} variants={variants} />
        </div>
      )}
    </div>
  )
}
