'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
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
import { deleteProduct, toggleProductActive, reorderProducts } from '@/app/admin/(protected)/products/actions'
import { computeReorder } from '@/lib/dnd-helpers'
import { Pencil, Trash2, Loader2, Check, X, GripVertical } from 'lucide-react'

type ProductRow = {
  id: string
  name: string
  category: string
  collection: string | null
  base_price: number
  is_active: boolean
  sort_order: number
  variant_count: number
}

function SortableProductRow({
  product,
  confirmDelete,
  setConfirmDelete,
  isPending,
  onDelete,
  onToggle,
}: {
  product: ProductRow
  confirmDelete: string | null
  setConfirmDelete: (id: string | null) => void
  isPending: boolean
  onDelete: (id: string) => void
  onToggle: (id: string, current: boolean) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const p = product

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-4 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-5 py-4 font-medium text-gray-900">{p.name}</td>
      <td className="px-5 py-4 text-gray-600">{p.category}</td>
      <td className="px-5 py-4 text-gray-500">{p.collection ?? '—'}</td>
      <td className="px-5 py-4 text-gray-900">₹{p.base_price}</td>
      <td className="px-5 py-4 text-gray-600">{p.variant_count}</td>
      <td className="px-5 py-4">
        <button
          onClick={() => onToggle(p.id, p.is_active)}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
            p.is_active
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : p.is_active ? (
            <Check size={12} />
          ) : (
            <X size={12} />
          )}
          {p.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="px-5 py-4">
        <div className="flex gap-2">
          <Link
            href={`/admin/products/${p.id}`}
            prefetch={false}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Pencil size={14} className="text-gray-500" />
            Edit
          </Link>
          {confirmDelete === p.id ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(p.id)}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 bg-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(p.id)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

function DragOverlayRow({ product }: { product: ProductRow }) {
  const p = product
  return (
    <table className="w-full text-sm">
      <tbody>
        <tr className="bg-white shadow-lg border border-gray-200 rounded-lg">
          <td className="px-3 py-4 w-10">
            <GripVertical size={16} className="text-gray-400" />
          </td>
          <td className="px-5 py-4 font-medium text-gray-900">{p.name}</td>
          <td className="px-5 py-4 text-gray-600">{p.category}</td>
          <td className="px-5 py-4 text-gray-500">{p.collection ?? '—'}</td>
          <td className="px-5 py-4 text-gray-900">₹{p.base_price}</td>
          <td className="px-5 py-4 text-gray-600">{p.variant_count}</td>
          <td className="px-5 py-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                p.is_active
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {p.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-5 py-4" />
        </tr>
      </tbody>
    </table>
  )
}

export default function ProductTable({ products }: { products: ProductRow[] }) {
  const [items, setItems] = useState(products)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isReordering, startReorder] = useTransition()

  useEffect(() => {
    setItems(products)
  }, [products])

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
        await reorderProducts(updates)
      } catch {
        setItems(prev)
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProduct(id)
      setConfirmDelete(null)
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleProductActive(id, !current))
  }

  const activeProduct = activeId ? items.find((p) => p.id === activeId) : null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      {isReordering && (
        <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" />
          Saving new order...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-3 py-4" />
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Collection</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Shades</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    No products yet. Add your first product.
                  </td>
                </tr>
              )}
              {items.map((p) => (
                <SortableProductRow
                  key={p.id}
                  product={p}
                  confirmDelete={confirmDelete}
                  setConfirmDelete={setConfirmDelete}
                  isPending={isPending}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
        <DragOverlay>
          {activeProduct ? <DragOverlayRow product={activeProduct} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
