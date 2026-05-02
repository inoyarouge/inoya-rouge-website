'use client'

import { useState } from 'react'
import { uploadVariantImage } from '@/app/admin/(protected)/products/actions'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function ImageUploader({
  productId,
  variantId,
  currentUrl,
  onUploaded,
}: {
  productId: string
  variantId: string
  currentUrl: string | null
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are allowed.')
      return
    }

    if (file.size > MAX_SIZE) {
      setError('Image must be under 5MB.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.set('file', file)
      const url = await uploadVariantImage(productId, variantId, formData)
      onUploaded(url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {currentUrl && (
        <img
          src={currentUrl}
          alt="Variant"
          className="w-20 h-20 object-cover rounded mb-2"
        />
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
