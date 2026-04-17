import { createClient } from '@/lib/supabase/server'
import ProductTable from '@/components/admin/ProductTable'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, product_variants(id)')
    .order('sort_order', { ascending: true })

  const products = (data ?? []).map((p) => ({
    ...p,
    variant_count: p.product_variants?.length ?? 0,
  }))

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display text-gray-900">Products</h1>
        <a
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#720B0B] text-white text-sm font-medium rounded-md"
        >
          <Plus size={16} />
          Add Product
        </a>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
