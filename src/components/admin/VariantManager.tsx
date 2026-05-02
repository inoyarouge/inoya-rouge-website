'use client'

import { useState, useTransition } from 'react'
import type { ProductVariant } from '@/lib/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { deleteVariant, reorderVariants, toggleVariantActive } from '@/app/admin/(protected)/products/actions'
import { isDiscountLive } from '@/lib/pricing'
import { computeReorder } from '@/lib/dnd-helpers'
import VariantForm from './VariantForm'
import { Plus, Pencil, Trash2, Check, X, Loader2, GripVertical } from 'lucide-react'

function SortableVariantCard({
  variant,
  productId,
  productBasePrice,
  editingId,
  setEditingId,
  setShowForm,
  confirmDeleteId,
  setConfirmDeleteId,
  isPending,
  onDelete,
  onToggle,
}: {
  variant: ProductVariant
  productId: string
  productBasePrice: number
  editingId: string | null
  setEditingId: (id: string | null) => void
  setShowForm: (show: boolean) => void
  confirmDeleteId: string | null
  setConfirmDeleteId: (id: string | null) => void
  isPending: boolean
  onDelete: (v: ProductVariant) => void
  onToggle: (v: ProductVariant) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variant.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const v = variant

  if (editingId === v.id) {
    return (
      <div ref={setNodeRef} style={style}>
        <div className="p-1 mb-4">
          <VariantForm
            productId={productId}
            productBasePrice={productBasePrice}
            variant={v}
            onDone={() => setEditingId(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 px-5 py-4 hover:border-gray-300 transition-colors">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none shrink-0"
        >
          <GripVertical size={16} />
        </button>

        {/* Color swatch */}
        {v.shade_color && (
          <div
            className="w-10 h-10 rounded-full border border-gray-200 shrink-0"
            style={{ backgroundColor: v.shade_color }}
            title={v.shade_color}
          />
        )}

        {/* Thumbnail */}
        {v.image_url && (
          <img
            src={v.image_url}
            alt={v.shade_name}
            className="w-12 h-12 object-cover rounded-md border border-gray-100 shrink-0"
          />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {v.shade_name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {v.price_override ? (
              <p className="text-xs text-gray-500">Override ₹{v.price_override}</p>
            ) : (
              <p className="text-xs text-gray-400">Base Price</p>
            )}
            {isDiscountLive(v.discount) && (
              <span className="text-[10px] font-semibold text-[#720B0B] border border-[#720B0B]/30 bg-[#720B0B]/5 rounded px-1.5 py-0.5 tracking-wide">
                {v.discount!.type === 'percent'
                  ? `−${Math.round(v.discount!.value)}%`
                  : `−₹${Math.round(v.discount!.value)}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Status – clickable toggle */}
          <button
            type="button"
            onClick={() => onToggle(v)}
            disabled={isPending}
            className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-full cursor-pointer transition-colors ${
              v.is_active
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
            title={v.is_active ? 'Click to deactivate' : 'Click to activate'}
          >
            {isPending ? (
              <Loader2 size={10} className="animate-spin" />
            ) : v.is_active ? (
              <Check size={10} />
            ) : (
              <X size={10} />
            )}
            {v.is_active ? 'Active' : 'Inactive'}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-gray-100 pl-4">
            <button
              onClick={() => {
                setEditingId(v.id)
                setShowForm(false)
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Pencil size={18} />
            </button>

            {confirmDeleteId === v.id ? (
              <div className="flex items-center gap-1 bg-red-50 rounded p-0.5">
                <button
                  onClick={() => onDelete(v)}
                  disabled={isPending}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                  title="Confirm Delete"
                >
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isPending}
                  className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(v.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DragOverlayCard({ variant }: { variant: ProductVariant }) {
  const v = variant
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow-lg border border-gray-200 px-5 py-4">
      <GripVertical size={16} className="text-gray-400 shrink-0" />
      {v.shade_color && (
        <div
          className="w-10 h-10 rounded-full border border-gray-200 shrink-0"
          style={{ backgroundColor: v.shade_color }}
        />
      )}
      <p className="text-sm font-semibold text-gray-900 truncate">{v.shade_name}</p>
    </div>
  )
}

export default function VariantManager({
  productId,
  productBasePrice,
  variants,
}: {
  productId: string
  productBasePrice: number
  variants: ProductVariant[]
}) {
  const [items, setItems] = useState(variants)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isReordering, startReorder] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const prev = [...items]
    const { reordered, updates } = computeReorder(items, active.id as string, over.id as string)
    if (updates.length === 0) return

    setItems(reordered)
    startReorder(async () => {
      try {
        await reorderVariants(productId, updates)
      } catch {
        setItems(prev)
      }
    })
  }

  function handleDelete(v: ProductVariant) {
    startTransition(async () => {
      await deleteVariant(v.id, productId, v.image_url)
      setConfirmDeleteId(null)
    })
  }

  function handleToggle(v: ProductVariant) {
    startTransition(() => toggleVariantActive(v.id, productId, !v.is_active))
  }

  const activeVariant = activeId ? items.find((v) => v.id === activeId) : null

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display text-gray-900">Shades & Variants</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#720B0B] text-white text-sm font-medium rounded-md hover:bg-[#720B0B]/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Shade
        </button>
      </div>

      {isReordering && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700 flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" />
          Saving new order...
        </div>
      )}

      {/* Add new form */}
      {showForm && !editingId && (
        <div className="mb-8">
          <div className="p-1">
            <VariantForm
              productId={productId}
              productBasePrice={productBasePrice}
              variant={null}
              onDone={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Variant list */}
      {items.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          No shades yet. Add your first shade.
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((v) => v.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {items.map((v) => (
              <SortableVariantCard
                key={v.id}
                variant={v}
                productId={productId}
                productBasePrice={productBasePrice}
                editingId={editingId}
                setEditingId={setEditingId}
                setShowForm={setShowForm}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                isPending={isPending}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeVariant ? <DragOverlayCard variant={activeVariant} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
