'use client'

import { computePriceStandalone, formatINR } from '@/lib/pricing'

export default function DiscountSection({
  basePrice,
  enabled,
  setEnabled,
  type,
  setType,
  value,
  setValue,
  startsAt,
  setStartsAt,
  endsAt,
  setEndsAt,
  label = 'Apply a discount to this product',
  radioGroupName = 'discount_type_radio',
}: {
  basePrice: string
  enabled: boolean
  setEnabled: (b: boolean) => void
  type: 'percent' | 'flat'
  setType: (t: 'percent' | 'flat') => void
  value: string
  setValue: (s: string) => void
  startsAt: string
  setStartsAt: (s: string) => void
  endsAt: string
  setEndsAt: (s: string) => void
  label?: string
  radioGroupName?: string
}) {
  const baseNum = parseFloat(basePrice) || 0
  const valueNum = parseFloat(value) || 0
  const preview = computePriceStandalone(baseNum, enabled, type, valueNum)
  const disabled = !enabled
  const fieldCls = `mt-1.5 block w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B] transition-shadow shadow-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`

  return (
    <div className="border border-gray-200 rounded-md p-5 bg-gray-50/50">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-[#720B0B] focus:ring-[#720B0B]/40"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>

      <div className={`mt-4 grid gap-4 ${disabled ? 'opacity-60' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Type</span>
            <div className="mt-1.5 flex gap-2">
              <label className="flex-1">
                <input
                  type="radio"
                  name={radioGroupName}
                  value="percent"
                  checked={type === 'percent'}
                  onChange={() => setType('percent')}
                  disabled={disabled}
                  className="sr-only peer"
                />
                <span className="block text-center py-2 text-sm border border-gray-300 rounded-md cursor-pointer peer-checked:bg-[#720B0B] peer-checked:text-white peer-checked:border-[#720B0B] peer-disabled:cursor-not-allowed transition-colors">
                  Percent (%)
                </span>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name={radioGroupName}
                  value="flat"
                  checked={type === 'flat'}
                  onChange={() => setType('flat')}
                  disabled={disabled}
                  className="sr-only peer"
                />
                <span className="block text-center py-2 text-sm border border-gray-300 rounded-md cursor-pointer peer-checked:bg-[#720B0B] peer-checked:text-white peer-checked:border-[#720B0B] peer-disabled:cursor-not-allowed transition-colors">
                  Flat (₹)
                </span>
              </label>
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {type === 'percent' ? 'Discount %' : 'Discount (₹)'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={type === 'percent' ? 100 : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              placeholder={type === 'percent' ? 'e.g. 20' : 'e.g. 200'}
              className={fieldCls}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Starts at</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              disabled={disabled}
              className={fieldCls}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ends at</span>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              disabled={disabled}
              className={fieldCls}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 -mt-2">Leave empty for always-on / no end date.</p>

        {enabled && preview.hasDiscount && baseNum > 0 && (
          <div className="mt-2 p-3 bg-white border border-gray-200 rounded text-sm">
            <span className="text-gray-500">Preview:</span>{' '}
            <span className="text-gray-400 line-through">{formatINR(preview.original)}</span>
            {' → '}
            <span className="font-semibold text-[#720B0B]">{formatINR(preview.final)}</span>
            <span className="ml-2 text-xs text-gray-500">(−{preview.discountPercent}%)</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
