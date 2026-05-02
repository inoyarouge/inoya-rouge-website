'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Promotion } from '@/lib/types'
import { toDatetimeLocal } from './DiscountSection'
import { createPromotion, updatePromotion } from '@/app/admin/(protected)/promotions/actions'

const CATEGORIES: Array<'Lips' | 'Eyes' | 'Face'> = ['Lips', 'Eyes', 'Face']

export default function PromotionForm({ promotion }: { promotion: Promotion | null }) {
  const router = useRouter()
  const isEdit = !!promotion

  const [name, setName] = useState(promotion?.name ?? '')
  const [description, setDescription] = useState(promotion?.description ?? '')
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>(promotion?.discount_type ?? 'percent')
  const [discountValue, setDiscountValue] = useState(promotion?.discount_value?.toString() ?? '')
  const [scope, setScope] = useState<'all' | 'category'>(promotion?.scope ?? 'all')
  const [scopeValue, setScopeValue] = useState(promotion?.scope_value ?? 'Lips')
  const [startsAt, setStartsAt] = useState(toDatetimeLocal(promotion?.starts_at))
  const [endsAt, setEndsAt] = useState(toDatetimeLocal(promotion?.ends_at))
  const [isActive, setIsActive] = useState(promotion?.is_active ?? true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fieldCls = `mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const fd = new FormData()
    fd.set('name', name)
    fd.set('description', description)
    fd.set('discount_type', discountType)
    fd.set('discount_value', discountValue)
    fd.set('scope', scope)
    fd.set('scope_value', scope === 'category' ? scopeValue : '')
    fd.set('starts_at', startsAt)
    fd.set('ends_at', endsAt)
    fd.set('is_active', isActive ? 'true' : 'false')

    try {
      if (isEdit && promotion) {
        await updatePromotion(promotion.id, fd)
      } else {
        await createPromotion(fd)
      }
      router.push('/admin/promotions')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Holiday Sale"
          className={fieldCls}
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Banner message (optional)
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="e.g. Limited time offer — shop now before it ends!"
          className={fieldCls}
        />
        <span className="block mt-1.5 text-xs text-gray-500">
          Shown to customers in the site-wide banner (only for &quot;All products&quot; promotions). Leave empty to show the default message.
        </span>
      </label>

      {/* Scope */}
      <div className="border border-gray-200 rounded-md p-5 bg-gray-50/50">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Applies to</span>
        <div className="mt-2 flex gap-2">
          <label className="flex-1">
            <input
              type="radio"
              name="scope"
              value="all"
              checked={scope === 'all'}
              onChange={() => setScope('all')}
              className="sr-only peer"
            />
            <span className="block text-center py-2 text-sm border border-gray-300 rounded-md cursor-pointer peer-checked:bg-[#720B0B] peer-checked:text-white peer-checked:border-[#720B0B] transition-colors">
              All products
            </span>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              name="scope"
              value="category"
              checked={scope === 'category'}
              onChange={() => setScope('category')}
              className="sr-only peer"
            />
            <span className="block text-center py-2 text-sm border border-gray-300 rounded-md cursor-pointer peer-checked:bg-[#720B0B] peer-checked:text-white peer-checked:border-[#720B0B] transition-colors">
              By category
            </span>
          </label>
        </div>

        {scope === 'category' && (
          <label className="block mt-4">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Category</span>
            <select
              value={scopeValue}
              onChange={(e) => setScopeValue(e.target.value)}
              className={fieldCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Discount */}
      <div className="border border-gray-200 rounded-md p-5 bg-gray-50/50">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Discount</span>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Type</span>
            <div className="mt-1.5 flex gap-2">
              <label className="flex-1">
                <input
                  type="radio"
                  name="promo_type"
                  value="percent"
                  checked={discountType === 'percent'}
                  onChange={() => setDiscountType('percent')}
                  className="sr-only peer"
                />
                <span className="block text-center py-2 text-sm border border-gray-300 rounded-md cursor-pointer peer-checked:bg-[#720B0B] peer-checked:text-white peer-checked:border-[#720B0B] transition-colors">
                  Percent (%)
                </span>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="promo_type"
                  value="flat"
                  checked={discountType === 'flat'}
                  onChange={() => setDiscountType('flat')}
                  className="sr-only peer"
                />
                <span className="block text-center py-2 text-sm border border-gray-300 rounded-md cursor-pointer peer-checked:bg-[#720B0B] peer-checked:text-white peer-checked:border-[#720B0B] transition-colors">
                  Flat (₹)
                </span>
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {discountType === 'percent' ? 'Discount %' : 'Discount (₹)'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={discountType === 'percent' ? 100 : undefined}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percent' ? 'e.g. 20' : 'e.g. 200'}
              required
              className={fieldCls}
            />
          </label>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Starts at</span>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={fieldCls}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ends at</span>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className={fieldCls}
          />
        </label>
      </div>
      <p className="text-xs text-gray-500 -mt-4">Leave empty for always-on / no end date.</p>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-[#720B0B] focus:ring-[#720B0B]/40"
        />
        <span className="text-sm font-medium text-gray-700">Active</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-[#720B0B] text-white text-sm font-medium rounded-md disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Promotion'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/promotions')}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
