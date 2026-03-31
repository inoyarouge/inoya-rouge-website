'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteProduct, toggleProductActive } from '@/app/admin/products/actions'

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

export default function ProductTable({ products }: { products: ProductRow[] }) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProduct(id)
      setConfirmDelete(null)
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleProductActive(id, !current))
  }

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Collection</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Shades</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                No products yet. Add your first product.
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3">{p.category}</td>
              <td className="px-4 py-3 text-gray-500">{p.collection ?? '—'}</td>
              <td className="px-4 py-3">₹{p.base_price}</td>
              <td className="px-4 py-3">{p.variant_count}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggle(p.id, p.is_active)}
                  disabled={isPending}
                  className={`px-2 py-1 text-xs rounded ${
                    p.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {p.is_active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-4 py-3 text-gray-500">{p.sort_order}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    prefetch={false}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Edit
                  </Link>
                  {confirmDelete === p.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={isPending}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 text-xs bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
