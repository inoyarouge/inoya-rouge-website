'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Sidebar({ pendingCount }: { pendingCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const links = [
    {
      href: '/admin/testimonials',
      label: 'Testimonials',
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { href: '/admin/products', label: 'Products', badge: null },
  ]

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={false}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
            pathname.startsWith(link.href)
              ? 'bg-brand-rose text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {link.label}
          {link.badge && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {link.badge}
            </span>
          )}
        </Link>
      ))}
      <hr className="my-2" />
      <Link
        href="/"
        prefetch={false}
        className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded"
      >
        View Site
      </Link>
      <button
        onClick={handleLogout}
        className="px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded"
      >
        Logout
      </button>
    </nav>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-60 bg-white border-r p-4 flex flex-col transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="font-serif text-lg font-bold text-brand-rose mb-6">
          Inoya Rouge
          <span className="block text-xs font-sans font-normal text-gray-400">Admin</span>
        </div>
        {nav}
      </aside>
    </>
  )
}
