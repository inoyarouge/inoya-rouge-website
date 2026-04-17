'use client'

import { useState, useTransition } from 'react'
import type { ProductVariant } from '@/lib/types'
import { createVariant, updateVariant } from '@/app/admin/products/actions'
import ImageUploader from './ImageUploader'
import { Loader2 } from 'lucide-react'

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
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 grid gap-6 mt-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Shade Name *</span>
          <input
            type="text"
            required
            value={shadeName}
            onChange={(e) => setShadeName(e.target.value)}
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Shade Color</span>
          <div className="flex gap-3 mt-1.5 align-middle">
            <input
              type="color"
              value={shadeColor}
              onChange={(e) => setShadeColor(e.target.value)}
              className="w-11 h-11 rounded-md border border-gray-300 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={shadeColor}
              onChange={(e) => setShadeColor(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
        />
      </label>

      <div>
        <span className="text-sm font-medium text-gray-700 block mb-2">Image</span>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <ImageUploader
            productId={productId}
            variantId={variant?.id ?? 'temp'}
            currentUrl={imageUrl || null}
            onUploaded={(url) => setImageUrl(url)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Price Override (₹)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={priceOverride}
            onChange={(e) => setPriceOverride(e.target.value)}
            placeholder="Leave empty for base price"
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Sort Order</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm"
          />
        </label>

        <label className="flex items-center gap-3 py-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-[#720B0B] focus:ring-[#720B0B]/40"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-6 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#720B0B] text-white text-sm font-medium rounded-md hover:bg-[#720B0B]/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? 'Saving...' : isNew ? 'Add Shade' : 'Save Shade'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
