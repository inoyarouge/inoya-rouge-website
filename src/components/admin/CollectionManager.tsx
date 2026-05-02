'use client'

import { useState, useEffect, useTransition } from 'react'
import type { Collection } from '@/lib/types'
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
import { computeReorder } from '@/lib/dnd-helpers'
import {
  createCollection,
  updateCollection,
  deleteCollection,
  reorderCollections,
} from '@/app/admin/(protected)/collections/actions'
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  GripVertical,
} from 'lucide-react'

type Category = 'Lips' | 'Eyes' | 'Face'
const CATEGORIES: Category[] = ['Lips', 'Eyes', 'Face']

function SortableCollectionRow({
  collection,
  editingId,
  editValue,
  setEditValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  confirmDeleteId,
  setConfirmDeleteId,
  onDelete,
  isPending,
}: {
  collection: Collection
  editingId: string | null
  editValue: string
  setEditValue: (v: string) => void
  onStartEdit: (c: Collection) => void
  onCancelEdit: () => void
  onSaveEdit: (id: string) => void
  confirmDeleteId: string | null
  setConfirmDeleteId: (id: string | null) => void
  onDelete: (id: string) => void
  isPending: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: collection.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const isEditing = editingId === collection.id

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit(collection.id)
              if (e.key === 'Escape') onCancelEdit()
            }}
            autoFocus
            className="flex-1 min-w-0 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B]"
          />
        ) : (
          <span className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate">
            {collection.name}
          </span>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={() => onSaveEdit(collection.id)}
                disabled={isPending}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                title="Save"
              >
                {isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
              </button>
              <button
                onClick={onCancelEdit}
                disabled={isPending}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(collection)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Rename"
              >
                <Pencil size={16} />
              </button>

              {confirmDeleteId === collection.id ? (
                <div className="flex items-center gap-1 bg-red-50 rounded p-0.5">
                  <button
                    onClick={() => onDelete(collection.id)}
                    disabled={isPending}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                    title="Confirm Delete"
                  >
                    {isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={isPending}
                    className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(collection.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DragOverlayRow({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3">
      <GripVertical size={16} className="text-gray-400 shrink-0" />
      <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
    </div>
  )
}

export default function CollectionManager({
  collections,
}: {
  collections: Collection[]
}) {
  const [activeCategory, setActiveCategory] = useState<Category>('Lips')
  const [items, setItems] = useState(collections)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isReordering, startReorder] = useTransition()

  useEffect(() => {
    setItems(collections)
  }, [collections])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const categoryItems = items.filter((c) => c.category === activeCategory)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const prev = [...items]
    const { reordered, updates } = computeReorder(
      categoryItems,
      active.id as string,
      over.id as string
    )
    if (updates.length === 0) return

    const otherItems = items.filter((c) => c.category !== activeCategory)
    setItems([...reordered, ...otherItems])

    startReorder(async () => {
      try {
        await reorderCollections(updates)
      } catch {
        setItems(prev)
      }
    })
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    setError(null)
    startTransition(async () => {
      try {
        await createCollection(activeCategory, trimmed)
        setNewName('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add collection')
      }
    })
  }

  function handleStartEdit(c: Collection) {
    setEditingId(c.id)
    setEditValue(c.name)
    setConfirmDeleteId(null)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditValue('')
  }

  function handleSaveEdit(id: string) {
    const trimmed = editValue.trim()
    if (!trimmed) return
    setError(null)
    startTransition(async () => {
      try {
        await updateCollection(id, trimmed)
        setEditingId(null)
        setEditValue('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to rename')
      }
    })
  }

  function handleDelete(id: string) {
    setError(null)
    startTransition(async () => {
      try {
        await deleteCollection(id)
        setConfirmDeleteId(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete')
      }
    })
  }

  const activeItem = activeId ? categoryItems.find((c) => c.id === activeId) : null

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat)
              setEditingId(null)
              setConfirmDeleteId(null)
              setError(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
              activeCategory === cat
                ? 'bg-[#720B0B] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 mb-5 bg-white rounded-lg shadow-sm border border-gray-200 p-3"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Add a new ${activeCategory} collection…`}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#720B0B]/40 focus:border-[#720B0B]"
        />
        <button
          type="submit"
          disabled={isPending || !newName.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#720B0B] text-white text-sm font-medium rounded-md hover:bg-[#720B0B]/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Add
        </button>
      </form>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {isReordering && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700 flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" />
          Saving new order...
        </div>
      )}

      {/* List */}
      {categoryItems.length === 0 ? (
        <p className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          No collections yet for {activeCategory}. Add your first above.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryItems.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-2">
              {categoryItems.map((c) => (
                <SortableCollectionRow
                  key={c.id}
                  collection={c}
                  editingId={editingId}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={handleSaveEdit}
                  confirmDeleteId={confirmDeleteId}
                  setConfirmDeleteId={setConfirmDeleteId}
                  onDelete={handleDelete}
                  isPending={isPending}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeItem ? <DragOverlayRow name={activeItem.name} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <p className="mt-6 text-xs text-gray-400">
        Renaming a collection updates all products that reference it. Deleting a
        collection clears it from those products (they fall back to the category
        without a collection).
      </p>
    </div>
  )
}
