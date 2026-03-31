'use client'

import { useState, useTransition } from 'react'
import type { ProductVariant } from '@/lib/types'
import { createVariant, updateVariant } from '@/app/admin/products/actions'
import ImageUploader from './ImageUploader'

export default function VariantForm({
  productId,
  variant,
  onDone,
}: {
  productId: string
  variant: ProductVariant | null
  onDone: () => void
}) {
  const isNew = !variant
  const [isPending, startTransition] = useTransition()

  const [shadeName, setShadeName] = useState(variant?.shade_name ?? '')
  const [shadeColor, setShadeColor] = useState(variant?.shade_color ?? '#C7365F')
  const [description, setDescription] = useState(variant?.description ?? '')
  const [imageUrl, setImageUrl] = useState(variant?.image_url ?? '')
  const [priceOverride, setPriceOverride] = useState(
    variant?.price_override?.toString() ?? ''
  )
  const [isActive, setIsActive] = useState(variant?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(variant?.sort_order?.toString() ?? '0')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    formData.set('shade_name', shadeName)
    formData.set('shade_color', shadeColor)
    formData.set('description', description)
    formData.set('image_url', imageUrl)
    formData.set('price_override', priceOverride)
    formData.set('is_active', isActive.toString())
    formData.set('sort_order', sortOrder)

    startTransition(async () => {
      if (isNew) {
        await createVariant(productId, formData)
      } else {
        await updateVariant(variant.id, productId, formData)
      }
      onDone()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded p-4 bg-gray-50 grid gap-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-gray-700">Shade Name *</span>
          <input
            type="text"
            required
            value={shadeName}
            onChange={(e) => setShadeName(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Shade Color</span>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={shadeColor}
              onChange={(e) => setShadeColor(e.target.value)}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={shadeColor}
              onChange={(e) => setShadeColor(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-gray-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
        />
      </label>

      <div>
        <span className="text-sm text-gray-700 block mb-1">Image</span>
        <ImageUploader
          productId={productId}
          variantId={variant?.id ?? 'temp'}
          currentUrl={imageUrl || null}
          onUploaded={(url) => setImageUrl(url)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm text-gray-700">Price Override (₹)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={priceOverride}
            onChange={(e) => setPriceOverride(e.target.value)}
            placeholder="Leave empty for base price"
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
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

        <label className="flex items-center gap-2 self-end pb-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-brand-rose text-white text-sm rounded hover:bg-brand-rose/90 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : isNew ? 'Add Shade' : 'Save Shade'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
