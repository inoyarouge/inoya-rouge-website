'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types'
import { createProduct, updateProduct } from '@/app/admin/products/actions'

const COLLECTIONS: Record<string, string[]> = {
  Lips: ['Kysmé', 'Liquid Allure', 'Tint Amour', 'Other'],
  Eyes: ['Kajal', 'Mascara', 'Eyeliner', 'Other'],
  Face: ['Foundation', 'Compact', 'Primer', 'Blush', 'Highlighter', 'Other'],
}

export default function ProductForm({ product }: { product: Product | null }) {
  const isNew = !product
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(product?.name ?? '')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [basePrice, setBasePrice] = useState(product?.base_price?.toString() ?? '')
  const [category, setCategory] = useState<'Lips' | 'Eyes' | 'Face'>(product?.category ?? 'Lips')
  const [collection, setCollection] = useState(product?.collection ?? '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(product?.sort_order?.toString() ?? '0')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    formData.set('name', name)
    formData.set('tagline', tagline)
    formData.set('description', description)
    formData.set('base_price', basePrice)
    formData.set('category', category)
    formData.set('collection', collection)
    formData.set('is_active', isActive.toString())
    formData.set('sort_order', sortOrder)

    setError(null)
    startTransition(async () => {
      try {
        if (isNew) {
          const id = await createProduct(formData)
          router.push(`/admin/products/${id}`)
        } else {
          await updateProduct(product.id, formData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save product. Please try again.')
      }
    })
  }

  const collections = COLLECTIONS[category] ?? []

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-2xl">
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm text-gray-700">Name *</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Tagline</span>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Base Price (₹) *</span>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Category *</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as 'Lips' | 'Eyes' | 'Face')
                setCollection('')
              }}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
            >
              <option value="Lips">Lips</option>
              <option value="Eyes">Eyes</option>
              <option value="Face">Face</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Collection</span>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Sort Order</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
            />
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 px-6 py-2 bg-brand-rose text-white text-sm rounded hover:bg-brand-rose/90 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
      </button>
    </form>
  )
}
