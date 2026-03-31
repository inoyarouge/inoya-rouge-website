'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid credentials')
      setLoading(false)
      return
    }

    router.push('/admin/testimonials')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded shadow"
      >
        <h1 className="font-serif text-2xl font-bold text-brand-rose mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <label className="block mb-4">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-gray-700">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-rose text-white py-2 rounded text-sm font-medium hover:bg-brand-rose/90 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
