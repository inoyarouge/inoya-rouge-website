import type { Product, ProductVariant, Discount, Promotion, Offer } from './types'

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
  // Variant discount takes precedence when live; otherwise inherit the product discount.
  const d = isDiscountLive(variant?.discount) ? variant!.discount! : product.discount
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

export function isPromotionLive(p: Promotion | null | undefined, now = new Date()): boolean {
  if (!p || !p.is_active) return false
  if (p.starts_at && new Date(p.starts_at) > now) return false
  if (p.ends_at && new Date(p.ends_at) <= now) return false
  return true
}

export function promotionAppliesTo(p: Promotion, product: Product): boolean {
  if (p.scope === 'all') return true
  if (p.scope === 'category') return p.scope_value === product.category
  return false
}

export function computePriceFromOffers(basePrice: number, offers: Offer[]): PriceInfo {
  if (offers.length === 0) {
    return { original: basePrice, final: basePrice, discountPercent: null, hasDiscount: false }
  }

  // Sort deterministically: percent offers first (highest % first), then flat (largest ₹ first).
  // This keeps the order independent of the click order and prevents flat discounts from being
  // wasted on a zero price.
  const sorted = [...offers].sort((a, b) => {
    if (a.discountType !== b.discountType) return a.discountType === 'percent' ? -1 : 1
    return b.discountValue - a.discountValue
  })

  let running = basePrice
  for (const o of sorted) {
    running =
      o.discountType === 'percent'
        ? running * (1 - o.discountValue / 100)
        : Math.max(0, running - o.discountValue)
  }
  const final = Math.round(Math.max(0, running) * 100) / 100
  const discountPercent =
    basePrice > 0 ? Math.round(((basePrice - final) / basePrice) * 100) : 0
  return { original: basePrice, final, discountPercent, hasDiscount: final < basePrice }
}

export function getAvailableOffers(
  product: Product,
  variant: ProductVariant | null | undefined,
  promotions: Promotion[],
): Offer[] {
  const offers: Offer[] = []

  if (variant && isDiscountLive(variant.discount)) {
    const d = variant.discount!
    offers.push({
      id: `discount:${d.id}`,
      source: 'variant',
      label:
        d.type === 'percent'
          ? `${d.value}% off this shade`
          : `₹${d.value} off this shade`,
      endsAt: d.ends_at,
      discountType: d.type,
      discountValue: d.value,
    })
  }

  if (isDiscountLive(product.discount)) {
    const d = product.discount!
    offers.push({
      id: `discount:${d.id}`,
      source: 'product',
      label:
        d.type === 'percent'
          ? `${d.value}% off this product`
          : `₹${d.value} off this product`,
      endsAt: d.ends_at,
      discountType: d.type,
      discountValue: d.value,
    })
  }

  for (const p of promotions) {
    if (!isPromotionLive(p)) continue
    if (!promotionAppliesTo(p, product)) continue
    const amount =
      p.discount_type === 'percent'
        ? `${p.discount_value}% off`
        : `₹${p.discount_value} off`
    const scopeLabel =
      p.scope === 'category' && p.scope_value ? ` ${p.scope_value}` : ''
    offers.push({
      id: `promotion:${p.id}`,
      source: 'promotion',
      label: `${p.name} — ${amount}${scopeLabel}`,
      endsAt: p.ends_at,
      discountType: p.discount_type,
      discountValue: p.discount_value,
    })
  }

  return offers
}
