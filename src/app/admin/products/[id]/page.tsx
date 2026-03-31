import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import VariantManager from '@/components/admin/VariantManager'
import type { Product, ProductVariant } from '@/lib/types'

export const revalidate = 0

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const isNew = id === 'new'

  let product: Product | null = null
  let variants: ProductVariant[] = []

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single()

    if (!data) notFound()

    const { product_variants, ...rest } = data
    product = rest as Product
    variants = (product_variants ?? []) as ProductVariant[]
    variants.sort((a, b) => a.sort_order - b.sort_order)
  }

  return (
    <div>
      <Link
        href="/admin/products"
        prefetch={false}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        ← Back to Products
      </Link>

      <h1 className="text-2xl font-serif font-bold mb-6">
        {isNew ? 'Add Product' : `Edit: ${product?.name}`}
      </h1>

      <ProductForm product={product} />

      {!isNew && product && (
        <div className="mt-8">
          <VariantManager productId={product.id} variants={variants} />
        </div>
      )}
    </div>
  )
}
