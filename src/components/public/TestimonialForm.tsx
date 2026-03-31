'use client'

import { useState } from 'react'
import { submitTestimonial } from '@/app/(public)/community/actions'

export default function TestimonialForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storyLength, setStoryLength] = useState(0)

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-medium">Thank you! Your story is under review.</p>
        <p className="text-green-600 text-sm mt-2">
          Once approved, it will appear on this page for others to read.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get('name')?.toString().trim() ?? ''
    const title = formData.get('title')?.toString().trim() ?? ''
    const story = formData.get('story')?.toString().trim() ?? ''

    if (!name || !title || !story) {
      setError('Please fill in all required fields.')
      return
    }
    if (name.length > 100) {
      setError('Name must be under 100 characters.')
      return
    }
    if (title.length > 150) {
      setError('Title must be under 150 characters.')
      return
    }
    if (story.length > 2000) {
      setError('Story must be under 2000 characters.')
      return
    }

    setSubmitting(true)
    const result = await submitTestimonial(formData)
    setSubmitting(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error ?? 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-brand-rose">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
          className="w-full border border-gray-300 rounded px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-gray-400 text-xs">(optional, never shown publicly)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border border-gray-300 rounded px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-brand-rose">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={150}
          placeholder="e.g. My favourite lipstick ever"
          className="w-full border border-gray-300 rounded px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose"
        />
      </div>

      <div>
        <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
          Your Story <span className="text-brand-rose">*</span>
        </label>
        <textarea
          id="story"
          name="story"
          required
          maxLength={2000}
          rows={5}
          onChange={(e) => setStoryLength(e.target.value.length)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{storyLength} / 2000</p>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-rose text-white px-8 py-3 min-h-[44px] text-sm uppercase tracking-widest font-medium rounded hover:bg-brand-rose/90 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Share Your Story'}
      </button>
    </form>
  )
}
