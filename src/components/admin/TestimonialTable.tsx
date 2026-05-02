'use client'

import { useState, useEffect, useTransition } from 'react'
import type { Testimonial } from '@/lib/types'
import StatusBadge from './StatusBadge'
import {
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from '@/app/admin/(protected)/testimonials/actions'
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
import { Check, X, Loader2, Trash2, GripVertical } from 'lucide-react'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

function SortableTestimonialRow({
  testimonial,
  expandedId,
  setExpandedId,
  confirmDelete,
  setConfirmDelete,
  isPending,
  onApprove,
  onReject,
  onDelete,
  showHandle,
}: {
  testimonial: Testimonial
  expandedId: string | null
  setExpandedId: (id: string | null) => void
  confirmDelete: string | null
  setConfirmDelete: (id: string | null) => void
  isPending: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  showHandle: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id, disabled: !showHandle })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const t = testimonial

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50 transition-colors">
      {showHandle && (
        <td className="px-3 py-4 w-10">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          >
            <GripVertical size={16} />
          </button>
        </td>
      )}
      <td
        className="px-5 py-4 font-medium text-gray-900 cursor-pointer"
        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
      >
        {t.author_name}
      </td>
      <td
        className="px-5 py-4 text-gray-600 cursor-pointer"
        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
      >
        {t.title}
      </td>
      <td
        className="px-5 py-4 cursor-pointer"
        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
      >
        <StatusBadge status={t.status} />
      </td>
      <td
        className="px-5 py-4 text-gray-500 cursor-pointer"
        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
      >
        {new Date(t.created_at).toLocaleDateString()}
      </td>
      <td className="px-5 py-4">
        <div className="flex gap-2">
          {t.status !== 'approved' && (
            <button
              onClick={() => onApprove(t.id)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Approve
            </button>
          )}
          {t.status !== 'rejected' && (
            <button
              onClick={() => onReject(t.id)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              Reject
            </button>
          )}
          {confirmDelete === t.id ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(t.id)}
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
              onClick={() => setConfirmDelete(t.id)}
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

function DragOverlayRow({ testimonial }: { testimonial: Testimonial }) {
  const t = testimonial
  return (
    <table className="w-full text-sm">
      <tbody>
        <tr className="bg-white shadow-lg border border-gray-200 rounded-lg">
          <td className="px-3 py-4 w-10">
            <GripVertical size={16} className="text-gray-400" />
          </td>
          <td className="px-5 py-4 font-medium text-gray-900">{t.author_name}</td>
          <td className="px-5 py-4 text-gray-600">{t.title}</td>
          <td className="px-5 py-4">
            <StatusBadge status={t.status} />
          </td>
          <td className="px-5 py-4 text-gray-500">
            {new Date(t.created_at).toLocaleDateString()}
          </td>
          <td className="px-5 py-4" />
        </tr>
      </tbody>
    </table>
  )
}

export default function TestimonialTable({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(50)
  const [isPending, startTransition] = useTransition()

  const [items, setItems] = useState(testimonials)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isReordering, startReorder] = useTransition()

  useEffect(() => {
    setItems(testimonials)
  }, [testimonials])

  const canDrag = filter === 'approved' && search === ''

  const filtered = items
    .filter((t) => filter === 'all' || t.status === filter)
    .filter(
      (t) =>
        !search ||
        t.author_name.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase())
    )

  const visible = filtered.slice(0, visibleCount)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    if (!canDrag) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const approvedItems = items.filter((t) => t.status === 'approved')
    const prev = [...items]
    const { reordered, updates } = computeReorder(approvedItems, active.id as string, over.id as string)
    if (updates.length === 0) return

    // Rebuild full items list with reordered approved items
    const nonApproved = items.filter((t) => t.status !== 'approved')
    setItems([...reordered, ...nonApproved])

    startReorder(async () => {
      try {
        await reorderTestimonials(updates)
      } catch {
        setItems(prev)
      }
    })
  }

  function handleApprove(id: string) {
    startTransition(() => approveTestimonial(id))
  }

  function handleReject(id: string) {
    startTransition(() => rejectTestimonial(id))
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTestimonial(id)
      setConfirmDelete(null)
    })
  }

  const activeTestimonial = activeId ? items.find((t) => t.id === activeId) : null
  const colCount = canDrag ? 6 : 5

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-5 items-center">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setVisibleCount(50) }}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                  filter === s
                    ? 'bg-[#720B0B] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by author or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#720B0B]/50 transition-shadow"
          />
        </div>
      </div>

      {canDrag && (
        <div className="mb-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700 flex items-center gap-2">
          <GripVertical size={12} />
          Drag rows to reorder approved testimonials.
          {isReordering && (
            <>
              <Loader2 size={12} className="animate-spin ml-2" />
              Saving...
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {canDrag && <th className="px-3 py-4 w-10" />}
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <SortableContext items={visible.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <tbody className="divide-y divide-gray-200">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={colCount} className="px-5 py-10 text-center text-gray-500">
                      No testimonials found.
                    </td>
                  </tr>
                )}
                {visible.map((t) => (
                  <SortableTestimonialRow
                    key={t.id}
                    testimonial={t}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    isPending={isPending}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    showHandle={canDrag}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
          <DragOverlay>
            {activeTestimonial ? <DragOverlayRow testimonial={activeTestimonial} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {expandedId && (
        <div className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Testimonial Content:</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {items.find((t) => t.id === expandedId)?.content}
          </p>
          {items.find((t) => t.id === expandedId)?.author_email && (
            <p className="mt-3 text-sm text-gray-500 font-medium">
              Email: {items.find((t) => t.id === expandedId)?.author_email}
            </p>
          )}
        </div>
      )}

      {/* Load more */}
      {filtered.length > visibleCount && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 50)}
            className="px-5 py-2.5 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
