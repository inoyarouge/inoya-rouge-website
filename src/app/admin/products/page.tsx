import { createClient } from '@/lib/supabase/server'
import ProductTable from '@/components/admin/ProductTable'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <a
          href="/admin/products/new"
          className="px-4 py-2 bg-brand-rose text-white text-sm rounded hover:bg-brand-rose/90"
        >
          Add Product
        </a>
      </div>
      <ProductTable products={products} />
    </div>
  )
}
