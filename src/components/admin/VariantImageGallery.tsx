'use client'

import { useState, useTransition, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { VariantImage } from '@/lib/types'
import {
  uploadVariantImages,
  deleteVariantImage,
  reorderVariantImages,
} from '@/app/admin/(protected)/products/actions'
import { GripVertical, Trash2, Loader2, Upload } from 'lucide-react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function SortableTile({
  image,
  index,
  onDelete,
  isDeleting,
}: {
  image: VariantImage
  index: number
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square border border-gray-200 rounded-md overflow-hidden bg-gray-50"
    >
      {index === 0 && (
        <span className="absolute top-1.5 left-1.5 z-10 bg-[#720B0B] text-white text-[10px] font-semibold tracking-wide uppercase rounded px-1.5 py-0.5">
          Primary
        </span>
      )}

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-1.5 right-1.5 z-10 p-1 bg-white/90 border border-gray-200 rounded cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-900 shadow-sm"
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt="" className="w-full h-full object-cover pointer-events-none" />

      <button
        type="button"
        onClick={() => onDelete(image.id)}
        disabled={isDeleting}
        className="absolute bottom-1.5 right-1.5 z-10 p-1.5 bg-white/90 border border-gray-200 rounded text-red-600 hover:bg-red-50 shadow-sm disabled:opacity-50"
        title="Delete image"
      >
        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
    </div>
  )
}

export default function VariantImageGallery({
  productId,
  variantId,
  initialImages,
}: {
  productId: string
  variantId: string
  initialImages: VariantImage[]
}) {
  const [items, setItems] = useState<VariantImage[]>(
    [...initialImages].sort((a, b) => a.sort_order - b.sort_order),
  )
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [, startReorder] = useTransition()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return
    setError('')

    for (const f of selected) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError(`"${f.name}": only JPEG, PNG, or WebP.`)
        e.target.value = ''
        return
      }
      if (f.size > MAX_SIZE) {
        setError(`"${f.name}": must be under 5MB.`)
        e.target.value = ''
        return
      }
    }

    setUploading(true)
    try {
      const fd = new FormData()
      for (const f of selected) fd.append('files', f)
      const newRows = await uploadVariantImages(productId, variantId, fd)
      setItems((prev) => [...prev, ...newRows].sort((a, b) => a.sort_order - b.sort_order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleDelete(id: string) {
    const prev = items
    setItems((list) => list.filter((it) => it.id !== id))
    setDeletingId(id)
    ;(async () => {
      try {
        await deleteVariantImage(id, productId, variantId)
      } catch {
        setItems(prev)
        setError('Failed to delete image.')
      } finally {
        setDeletingId(null)
      }
    })()
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex((i) => i.id === active.id)
    const newIdx = items.findIndex((i) => i.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return

    const reordered = arrayMove(items, oldIdx, newIdx).map((img, idx) => ({
      ...img,
      sort_order: idx,
    }))
    const prev = items
    setItems(reordered)

    const updates = reordered.map((img) => ({ id: img.id, sort_order: img.sort_order }))
    startReorder(async () => {
      try {
        await reorderVariantImages(productId, variantId, updates)
      } catch {
        setItems(prev)
        setError('Failed to save new order.')
      }
    })
  }

  return (
    <div>
      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((img, idx) => (
                <SortableTile
                  key={img.id}
                  image={img}
                  index={idx}
                  onDelete={handleDelete}
                  isDeleting={deletingId === img.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-xs text-gray-500 bg-white border border-dashed border-gray-300 rounded-md p-6 text-center mb-3">
          No images yet. Upload the first one below.
        </p>
      )}

      <div className="mt-4">
        <label
          className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
            uploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading...' : 'Add Images'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="text-[11px] text-gray-500 mt-2">
          JPEG / PNG / WebP up to 5MB each. The first image in the grid is used as the primary — drag to reorder.
        </p>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  )
}
