'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Promotion } from '@/lib/types'
import { deletePromotion, togglePromotionActive } from '@/app/admin/(protected)/promotions/actions'
import { Pencil, Trash2 } from 'lucide-react'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function scopeLabel(p: Promotion): string {
  if (p.scope === 'all') return 'All products'
  return `Category: ${p.scope_value ?? '—'}`
}

function discountLabel(p: Promotion): string {
  return p.discount_type === 'percent'
    ? `${p.discount_value}%`
    : `₹${p.discount_value}`
}

export default function PromotionTable({ promotions }: { promotions: Promotion[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  function handleToggle(p: Promotion) {
    setBusyId(p.id)
    startTransition(async () => {
      try {
        await togglePromotionActive(p.id, !p.is_active)
        router.refresh()
      } finally {
        setBusyId(null)
      }
    })
  }

  function handleDelete(p: Promotion) {
    if (!confirm(`Delete promotion "${p.name}"?`)) return
    setBusyId(p.id)
    startTransition(async () => {
      try {
        await deletePromotion(p.id)
        router.refresh()
      } finally {
        setBusyId(null)
      }
    })
  }

  if (promotions.length === 0) {
    return (
      <div className="border border-gray-200 rounded-md p-8 text-center text-gray-500 text-sm">
        No promotions yet. Create your first campaign to run a site-wide or category-wide sale.
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Scope</th>
            <th className="px-4 py-3 font-medium">Discount</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Active</th>
            <th className="px-4 py-3 font-medium w-[1%]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {promotions.map((p) => {
            const isBusy = pending && busyId === p.id
            return (
              <tr key={p.id} className={isBusy ? 'opacity-60' : ''}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{p.name}</div>
                  {p.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{p.description}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{scopeLabel(p)}</td>
                <td className="px-4 py-3 text-gray-700">{discountLabel(p)}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {formatDate(p.starts_at)} → {formatDate(p.ends_at)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(p)}
                    disabled={isBusy}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/promotions/${p.id}`}
                      prefetch={false}
                      className="p-1.5 text-gray-500 hover:text-[#720B0B]"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      disabled={isBusy}
                      className="p-1.5 text-gray-500 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
