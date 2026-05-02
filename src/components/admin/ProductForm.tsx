'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Collection } from '@/lib/types'
import { createProduct, updateProduct } from '@/app/admin/(protected)/products/actions'
import DiscountSection, { toDatetimeLocal } from './DiscountSection'
import { Loader2 } from 'lucide-react'

export default function ProductForm({
  product,
  collections,
}: {
  product: Product | null
  collections: Collection[]
}) {
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
  const sortOrder = product?.sort_order?.toString() ?? '0'
  const [aboutProduct, setAboutProduct] = useState(product?.about_product ?? '')
  const [whatMakesUnique, setWhatMakesUnique] = useState(product?.what_makes_unique ?? '')
  const [howToUse, setHowToUse] = useState(product?.how_to_use ?? '')
  const [ingredients, setIngredients] = useState(product?.ingredients ?? '')
  const [additionalInfo, setAdditionalInfo] = useState(product?.additional_info ?? '')
  const [buyUrl, setBuyUrl] = useState(product?.buy_url ?? '')

  // Discount state
  const existingDiscount = product?.discount ?? null
  const [discountEnabled, setDiscountEnabled] = useState(Boolean(existingDiscount))
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>(existingDiscount?.type ?? 'percent')
  const [discountValue, setDiscountValue] = useState(existingDiscount?.value?.toString() ?? '')
  const [discountStartsAt, setDiscountStartsAt] = useState(toDatetimeLocal(existingDiscount?.starts_at))
  const [discountEndsAt, setDiscountEndsAt] = useState(toDatetimeLocal(existingDiscount?.ends_at))

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
    formData.set('about_product', aboutProduct)
    formData.set('what_makes_unique', whatMakesUnique)
    formData.set('how_to_use', howToUse)
    formData.set('ingredients', ingredients)
    formData.set('additional_info', additionalInfo)
    formData.set('buy_url', buyUrl)
    formData.set('discount_enabled', discountEnabled ? '1' : '')
    formData.set('discount_type', discountType)
    formData.set('discount_value', discountValue)
    formData.set('discount_starts_at', discountStartsAt)
    formData.set('discount_ends_at', discountEndsAt)

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

  const filteredCollections = collections.filter((c) => c.category === category)

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 max-w-3xl">
      <div className="grid gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Name *</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Tagline</span>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Base Price (₹) *</span>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <DiscountSection
          basePrice={basePrice}
          enabled={discountEnabled}
          setEnabled={setDiscountEnabled}
          type={discountType}
          setType={setDiscountType}
          value={discountValue}
          setValue={setDiscountValue}
          startsAt={discountStartsAt}
          setStartsAt={setDiscountStartsAt}
          endsAt={discountEndsAt}
          setEndsAt={setDiscountEndsAt}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Category *</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as 'Lips' | 'Eyes' | 'Face')
                setCollection('')
              }}
              className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
            >
              <option value="Lips">Lips</option>
              <option value="Eyes">Eyes</option>
              <option value="Face">Face</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Collection</span>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
            >
              <option value="">None</option>
              {filteredCollections.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        {/* Product Detail Accordion Fields */}
        <div className="border-t border-gray-100 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Product Detail Page Content</h3>

          <div className="grid gap-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">About the Product</span>
              <textarea
                value={aboutProduct}
                onChange={(e) => setAboutProduct(e.target.value)}
                rows={3}
                className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">What Makes It Unique?</span>
              <textarea
                value={whatMakesUnique}
                onChange={(e) => setWhatMakesUnique(e.target.value)}
                rows={3}
                className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">How to Use?</span>
              <textarea
                value={howToUse}
                onChange={(e) => setHowToUse(e.target.value)}
                rows={3}
                className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Ingredients</span>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={3}
                className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Additional Information</span>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Buy URL (leave empty for default WhatsApp link)</span>
              <input
                type="url"
                value={buyUrl}
                onChange={(e) => setBuyUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
              />
            </label>
          </div>
        </div>

        <div className="mt-2">
          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#720B0B] focus:ring-[#720B0B]/40"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-5">{error}</p>}

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#720B0B] text-white text-sm font-medium rounded-md hover:bg-[#720B0B]/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

