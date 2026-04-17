import type { Product, ProductVariant, Discount } from './types'

export type PriceInfo = {
  original: number
  final: number
  discountPercent: number | null
  hasDiscount: boolean
}

export function normalizeDiscount(
  raw: Discount | Discount[] | null | undefined,
): Discount | null {
  if (!raw) return null
  if (Array.isArray(raw)) return raw[0] ?? null
  return raw
}

export function isDiscountLive(d: Discount | null | undefined, now = new Date()): boolean {
  if (!d || !d.is_active) return false
  if (d.starts_at && new Date(d.starts_at) > now) return false
  if (d.ends_at && new Date(d.ends_at) <= now) return false
  return true
}

export function computePrice(product: Product, variant?: ProductVariant | null): PriceInfo {
  const original = variant?.price_override ?? product.base_price
  const d = product.discount
  if (!isDiscountLive(d)) {
    return { original, final: original, discountPercent: null, hasDiscount: false }
  }
  const raw =
    d!.type === 'percent'
      ? original * (1 - d!.value / 100)
      : Math.max(0, original - d!.value)
  const final = Math.round(raw * 100) / 100
  const discountPercent =
    d!.type === 'percent'
      ? Math.round(d!.value)
      : original > 0
      ? Math.round(((original - final) / original) * 100)
      : 0
  return { original, final, discountPercent, hasDiscount: true }
}

export function computePriceStandalone(
  basePrice: number,
  discountEnabled: boolean,
  discountType: 'percent' | 'flat',
  discountValue: number,
): PriceInfo {
  if (!discountEnabled || !discountValue || discountValue <= 0) {
    return { original: basePrice, final: basePrice, discountPercent: null, hasDiscount: false }
  }
  const raw =
    discountType === 'percent'
      ? basePrice * (1 - discountValue / 100)
      : Math.max(0, basePrice - discountValue)
  const final = Math.round(raw * 100) / 100
  const discountPercent =
    discountType === 'percent'
      ? Math.round(discountValue)
      : basePrice > 0
      ? Math.round(((basePrice - final) / basePrice) * 100)
      : 0
  return { original: basePrice, final, discountPercent, hasDiscount: true }
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
