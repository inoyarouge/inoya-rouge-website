'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product, ProductVariant } from '@/lib/types'
import { computePrice, formatINR } from '@/lib/pricing'

interface BuyNowModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  selectedVariant: ProductVariant | undefined
  quantity: number
}

type AddressForm = {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
}

const EMPTY_FORM: AddressForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
}

type GeoStatus = 'idle' | 'locating' | 'denied' | 'failed' | 'filled'

const WHATSAPP_NUMBER = '919749611551'

export default function BuyNowModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  quantity,
}: BuyNowModalProps) {
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({})
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    const t = setTimeout(() => firstInputRef.current?.focus(), 50)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  const updateField = (key: keyof AddressForm) => (v: string) => {
    setForm(prev => ({ ...prev, [key]: v }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleAutoDetect = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('failed')
      return
    }
    setGeoStatus('locating')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 6000)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' }, signal: controller.signal },
          )
          clearTimeout(timeout)
          if (!res.ok) {
            setGeoStatus('failed')
            return
          }
          const data = await res.json()
          const a = data.address ?? {}
          const line1 = [a.house_number, a.road].filter(Boolean).join(' ') || a.suburb || ''
          const line2 = a.neighbourhood || a.suburb || ''
          const city = a.city || a.town || a.village || a.county || ''
          setForm(prev => ({
            ...prev,
            addressLine1: line1 || prev.addressLine1,
            addressLine2: line2 && line2 !== line1 ? line2 : prev.addressLine2,
            city: city || prev.city,
            state: a.state || prev.state,
            pincode: a.postcode || prev.pincode,
          }))
          setGeoStatus('filled')
        } catch {
          clearTimeout(timeout)
          setGeoStatus('failed')
        }
      },
      err => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'failed')
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof AddressForm, string>> = {}
    if (!form.fullName.trim()) next.fullName = 'Required'
    const phoneDigits = form.phone.replace(/\D/g, '').replace(/^91/, '')
    if (phoneDigits.length !== 10) next.phone = 'Enter a 10-digit Indian mobile number'
    if (!form.addressLine1.trim()) next.addressLine1 = 'Required'
    if (!form.city.trim()) next.city = 'Required'
    if (!form.state.trim()) next.state = 'Required'
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a 6-digit pincode'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const shade = selectedVariant?.shade_name
    const line2 = form.addressLine2.trim()
    const priceInfo = computePrice(product, selectedVariant)
    const total = priceInfo.final * quantity
    const originalTotal = priceInfo.original * quantity

    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://inoyarouge.com'
    const productUrl = `${origin}/shop/${product.slug}`

    const priceLine = priceInfo.hasDiscount
      ? `Price: ${formatINR(total)} (was ${formatINR(originalTotal)}, -${priceInfo.discountPercent}%)`
      : `Price: ${formatINR(total)}`

    const message =
      `Hi Inoya Rouge, I'd like to order:\n\n` +
      `${quantity}× ${product.name}${shade ? ` — ${shade}` : ''}\n` +
      `${productUrl}\n` +
      `${priceLine}\n\n` +
      `Shipping to:\n` +
      `${form.fullName.trim()}\n` +
      `${form.phone.trim()}\n` +
      `${form.addressLine1.trim()}\n` +
      (line2 ? `${line2}\n` : '') +
      `${form.city.trim()}, ${form.state.trim()} — ${form.pincode.trim()}`

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="buy-now-title"
            className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2
                  id="buy-now-title"
                  className="font-serif text-2xl md:text-3xl text-burgundy leading-tight"
                >
                  Shipping Details
                </h2>
                <p className="text-[13px] text-gray-600 mt-1">
                  {quantity}× {product.name}
                  {selectedVariant?.shade_name ? ` — ${selectedVariant.shade_name}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none -mt-1 -mr-1 w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <button
              type="button"
              onClick={handleAutoDetect}
              disabled={geoStatus === 'locating'}
              className="w-full border border-gray-200 text-burgundy text-xs uppercase tracking-[0.15em] py-3 bg-transparent hover:border-burgundy/30 hover:bg-burgundy/5 transition-all outline-none disabled:opacity-50 disabled:cursor-wait mb-2"
            >
              {geoStatus === 'locating' ? 'Detecting…' : 'Auto-detect my address'}
            </button>
            {geoStatus === 'denied' && (
              <p className="text-[12px] text-gray-500 mb-4">
                Permission denied. Please fill the address manually below.
              </p>
            )}
            {geoStatus === 'failed' && (
              <p className="text-[12px] text-gray-500 mb-4">
                Couldn&apos;t detect your address. Please fill it in manually.
              </p>
            )}
            {geoStatus === 'filled' && (
              <p className="text-[12px] text-green-700 mb-4">
                Address auto-filled — please review and correct anything before proceeding.
              </p>
            )}
            {geoStatus === 'idle' && <div className="mb-4" />}
            {geoStatus === 'locating' && <div className="mb-4" />}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field
                label="Full Name"
                value={form.fullName}
                onChange={updateField('fullName')}
                error={errors.fullName}
                inputRef={firstInputRef}
                autoComplete="name"
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={updateField('phone')}
                error={errors.phone}
                placeholder="10-digit mobile number"
                inputMode="tel"
                autoComplete="tel"
              />
              <Field
                label="Address Line 1"
                value={form.addressLine1}
                onChange={updateField('addressLine1')}
                error={errors.addressLine1}
                autoComplete="address-line1"
              />
              <Field
                label="Address Line 2 (optional)"
                value={form.addressLine2}
                onChange={updateField('addressLine2')}
                autoComplete="address-line2"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="City"
                  value={form.city}
                  onChange={updateField('city')}
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <Field
                  label="State"
                  value={form.state}
                  onChange={updateField('state')}
                  error={errors.state}
                  autoComplete="address-level1"
                />
              </div>
              <Field
                label="Pincode"
                value={form.pincode}
                onChange={updateField('pincode')}
                error={errors.pincode}
                inputMode="numeric"
                autoComplete="postal-code"
              />

              <button
                type="submit"
                className="w-full bg-burgundy text-white text-xs uppercase tracking-[0.15em] py-4 hover:bg-burgundy-dark transition-all outline-none mt-2"
              >
                Proceed to Order
              </button>
              <p className="text-[11px] text-gray-500 text-center">
                Continues on WhatsApp with your order and shipping address.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
  inputMode?: 'text' | 'tel' | 'numeric'
  autoComplete?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  autoComplete,
  inputRef,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[12px] text-gray-600 mb-1.5 block uppercase tracking-wider">
        {label}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`w-full border ${
          error ? 'border-red-400' : 'border-gray-200'
        } bg-white px-3 py-2.5 text-[14px] text-gray-900 outline-none focus:border-burgundy transition-colors`}
      />
      {error && <span className="text-[11px] text-red-500 mt-1 block">{error}</span>}
    </label>
  )
}
