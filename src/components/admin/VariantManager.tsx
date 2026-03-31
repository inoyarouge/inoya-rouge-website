'use client'

import { useState, useTransition } from 'react'
import type { ProductVariant } from '@/lib/types'
import { deleteVariant } from '@/app/admin/products/actions'
import VariantForm from './VariantForm'

export default function VariantManager({
  productId,
  variants,
}: {
  productId: string
  variants: ProductVariant[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(v: ProductVariant) {
    startTransition(async () => {
      await deleteVariant(v.id, productId, v.image_url)
      setConfirmDeleteId(null)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-bold">Shades / Variants</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
          className="px-4 py-2 bg-brand-rose text-white text-sm rounded hover:bg-brand-rose/90"
        >
          Add Shade
        </button>
      </div>

      {/* Add new form */}
      {showForm && !editingId && (
        <div className="mb-4">
          <VariantForm
            productId={productId}
            variant={null}
            onDone={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Variant list */}
      {variants.length === 0 && !showForm && (
        <p className="text-sm text-gray-400">No shades yet. Add your first shade.</p>
      )}

      <div className="grid gap-3">
        {variants.map((v) => (
          <div key={v.id}>
            {editingId === v.id ? (
              <VariantForm
                productId={productId}
                variant={v}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center gap-4 bg-white rounded shadow px-4 py-3">
                {/* Color swatch */}
                {v.shade_color && (
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: v.shade_color }}
                  />
                )}

                {/* Thumbnail */}
                {v.image_url && (
                  <img
                    src={v.image_url}
                    alt={v.shade_name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{v.shade_name}</p>
                  {v.price_override && (
                    <p className="text-xs text-gray-500">₹{v.price_override}</p>
                  )}
                </div>

                {/* Status */}
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    v.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {v.is_active ? 'Active' : 'Inactive'}
                </span>

                <span className="text-xs text-gray-400">#{v.sort_order}</span>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(v.id)
                      setShowForm(false)
                    }}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  {confirmDeleteId === v.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(v)}
                        disabled={isPending}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-xs bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(v.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
