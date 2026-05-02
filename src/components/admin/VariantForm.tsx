'use client'

import { useEffect, useState, useTransition } from 'react'
import type { ProductVariant } from '@/lib/types'
import {
  createVariant,
  updateVariant,
  uploadVariantImages,
} from '@/app/admin/(protected)/products/actions'
import VariantImageGallery from './VariantImageGallery'
import DiscountSection, { toDatetimeLocal } from './DiscountSection'
import { Loader2, Upload, X } from 'lucide-react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function VariantForm({
  productId,
  productBasePrice,
  variant,
  onDone,
}: {
  productId: string
  productBasePrice: number
  variant: ProductVariant | null
  onDone: () => void
}) {
  const isNew = !variant
  const [isPending, startTransition] = useTransition()

  const [shadeName, setShadeName] = useState(variant?.shade_name ?? '')
  const [shadeColor, setShadeColor] = useState(variant?.shade_color ?? '#C7365F')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
  const [imageError, setImageError] = useState('')
  const [priceOverride, setPriceOverride] = useState(
    variant?.price_override?.toString() ?? ''
  )
  const [isActive, setIsActive] = useState(variant?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(variant?.sort_order?.toString() ?? '0')

  const existingDiscount = variant?.discount ?? null
  const [discountEnabled, setDiscountEnabled] = useState(Boolean(existingDiscount))
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>(existingDiscount?.type ?? 'percent')
  const [discountValue, setDiscountValue] = useState(existingDiscount?.value?.toString() ?? '')
  const [discountStartsAt, setDiscountStartsAt] = useState(toDatetimeLocal(existingDiscount?.starts_at))
  const [discountEndsAt, setDiscountEndsAt] = useState(toDatetimeLocal(existingDiscount?.ends_at))

  // Discount preview uses the variant's effective base: override if set, else product base.
  const effectiveBaseForPreview = priceOverride
    ? priceOverride
    : productBasePrice.toString()

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [pendingPreviews])

  function handlePendingFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return
    setImageError('')

    for (const f of selected) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setImageError(`"${f.name}": only JPEG, PNG, or WebP.`)
        e.target.value = ''
        return
      }
      if (f.size > MAX_SIZE) {
        setImageError(`"${f.name}": must be under 5MB.`)
        e.target.value = ''
        return
      }
    }

    const newPreviews = selected.map((f) => URL.createObjectURL(f))
    setPendingFiles((prev) => [...prev, ...selected])
    setPendingPreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ''
  }

  function removePendingAt(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
    setPendingPreviews((prev) => {
      const url = prev[index]
      if (url) URL.revokeObjectURL(url)
      return prev.filter((_, i) => i !== index)
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    formData.set('shade_name', shadeName)
    formData.set('shade_color', shadeColor)
    formData.set('image_url', variant?.image_url ?? '')
    formData.set('price_override', priceOverride)
    formData.set('is_active', isActive.toString())
    formData.set('sort_order', sortOrder)
    formData.set('discount_enabled', discountEnabled ? '1' : '')
    formData.set('discount_type', discountType)
    formData.set('discount_value', discountValue)
    formData.set('discount_starts_at', discountStartsAt)
    formData.set('discount_ends_at', discountEndsAt)

    startTransition(async () => {
      if (isNew) {
        const newId = await createVariant(productId, formData)
        if (pendingFiles.length > 0) {
          const fd = new FormData()
          for (const f of pendingFiles) fd.append('files', f)
          await uploadVariantImages(productId, newId, fd)
        }
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

      <div>
        <span className="text-sm font-medium text-gray-700 block mb-2">Images</span>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          {isNew ? (
            <>
              {pendingPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-3">
                  {pendingPreviews.map((src, idx) => (
                    <div
                      key={src}
                      className="relative group aspect-square border border-gray-200 rounded-md overflow-hidden bg-white"
                    >
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 z-10 bg-[#720B0B] text-white text-[10px] font-semibold tracking-wide uppercase rounded px-1.5 py-0.5">
                          Primary
                        </span>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePendingAt(idx)}
                        className="absolute bottom-1.5 right-1.5 z-10 p-1.5 bg-white/90 border border-gray-200 rounded text-red-600 hover:bg-red-50 shadow-sm"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label
                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
                  isPending ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                <Upload size={14} />
                Add Images
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePendingFiles}
                  disabled={isPending}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gray-500 mt-2">
                JPEG / PNG / WebP up to 5MB each. The first image becomes the primary. Images upload when you save the shade.
              </p>
              {imageError && <p className="text-xs text-red-600 mt-2">{imageError}</p>}
            </>
          ) : (
            <VariantImageGallery
              productId={productId}
              variantId={variant!.id}
              initialImages={variant!.images ?? []}
            />
          )}
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

      <DiscountSection
        basePrice={effectiveBaseForPreview}
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
        label="Apply a discount to this shade (overrides the product discount)"
        radioGroupName={`variant_discount_type_${variant?.id ?? 'new'}`}
      />

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
