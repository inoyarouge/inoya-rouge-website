'use client'

import { useState, useTransition } from 'react'
import type { Testimonial } from '@/lib/types'
import StatusBadge from './StatusBadge'
import { approveTestimonial, rejectTestimonial } from '@/app/admin/testimonials/actions'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export default function TestimonialTable({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(50)
  const [isPending, startTransition] = useTransition()

  const filtered = testimonials
    .filter((t) => filter === 'all' || t.status === filter)
    .filter(
      (t) =>
        !search ||
        t.author_name.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase())
    )

  const visible = filtered.slice(0, visibleCount)

  function handleApprove(id: string) {
    startTransition(() => approveTestimonial(id))
  }

  function handleReject(id: string) {
    startTransition(() => rejectTestimonial(id))
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-1">
          {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setVisibleCount(50) }}
                className={`px-3 py-1.5 text-sm rounded capitalize min-h-[44px] ${
                  filter === s
                    ? 'bg-brand-rose text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
        <input
          type="text"
          placeholder="Search by author or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-brand-rose"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No testimonials found.
                </td>
              </tr>
            )}
            {visible.map((t) => (
              <>
                <tr
                  key={t.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === t.id ? null : t.id)
                  }
                >
                  <td className="px-4 py-3">{t.author_name}</td>
                  <td className="px-4 py-3">{t.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {t.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(t.id)}
                          disabled={isPending}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {t.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(t.id)}
                          disabled={isPending}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedId === t.id && (
                  <tr key={`${t.id}-expanded`} className="border-b bg-gray-50">
                    <td colSpan={5} className="px-4 py-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {t.content}
                      </p>
                      {t.author_email && (
                        <p className="mt-2 text-sm text-gray-500">
                          Email: {t.author_email}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load more */}
      {filtered.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((c) => c + 50)}
          className="mt-4 px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Load more ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </div>
  )
}
