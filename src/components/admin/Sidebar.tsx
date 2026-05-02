'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, ShoppingBag, LogOut, Home, Menu, X, Layers, Tag } from 'lucide-react'

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
      icon: MessageSquare,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag, badge: null },
    { href: '/admin/collections', label: 'Collections', icon: Layers, badge: null },
    { href: '/admin/promotions', label: 'Promotions', icon: Tag, badge: null },
  ]

  const nav = (
    <nav className="flex flex-col gap-2 mt-4 text-[15px]">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-[#720B0B] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
              {link.label}
            </div>
            {link.badge && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {link.badge}
              </span>
            )}
          </Link>
        )
      })}
      
      <div className="my-4 border-t border-gray-100"></div>
      
      <Link
        href="/"
        prefetch={false}
        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <Home size={18} className="text-gray-500" />
        View Site
      </Link>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left text-red-600 hover:bg-red-50 rounded-md w-full"
      >
        <LogOut size={18} className="text-red-500" />
        Logout
      </button>
    </nav>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow text-gray-700"
        aria-label="Open menu"
      >
        <Menu size={20} />
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
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-5 flex flex-col ${
          mobileOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-2xl text-[#720B0B] leading-none">
            Inoya Rouge
            <span className="block text-xs font-sans font-medium text-gray-400 mt-1 uppercase tracking-wider">Admin Panel</span>
          </div>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-500 p-1">
              <X size={20} />
            </button>
          )}
        </div>
        {nav}
      </aside>
    </>
  )
}
