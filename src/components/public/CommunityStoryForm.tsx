'use client'

import { useState } from 'react'
import { submitTestimonial } from '@/app/(public)/community/actions'

export default function CommunityStoryForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await submitTestimonial(formData)

    setSubmitting(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error ?? 'Something went wrong.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
        <p className="font-accent italic text-[28px] md:text-[36px] text-burgundy-dark text-center leading-tight">
          Thank you for sharing.
        </p>
      </div>
    )
  }

  const inputStyles = "w-full bg-white/95 border border-burgundy-dark/30 font-sans text-[15px] text-gray-900 placeholder:text-gray-400 px-6 py-4 focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 transition-all rounded-none shadow-sm"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[14px] w-full max-w-[650px] mx-auto mt-6">

      {/* Row 1: Name and Email */}
      <div className="flex flex-col md:flex-row gap-[14px]">
        <input
          type="text"
          name="name"
          required
          maxLength={100}
          placeholder="Your Name *"
          className={`${inputStyles} md:flex-1 h-[54px]`}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email (optional)"
          className={`${inputStyles} md:flex-1 h-[54px]`}
        />
      </div>

      {/* Row 2: Title */}
      <input
        type="text"
        name="title"
        required
        maxLength={150}
        placeholder="Story Title *"
        className={`${inputStyles} h-[54px]`}
      />

      {/* Row 3: Story */}
      <textarea
        name="story"
        required
        maxLength={2000}
        rows={4}
        placeholder="Tell us your story... *"
        className={`${inputStyles} resize-none`}
      />

      {error && (
        <p className="text-red-700 font-sans text-sm tracking-wide text-center">{error}</p>
      )}

      {/* Row 4: Submit Button */}
      <div className="flex justify-center mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="group/btn relative bg-burgundy overflow-hidden text-white font-sans text-[14px] font-normal uppercase tracking-[0.15em] px-12 h-[54px] disabled:opacity-50 disabled:pointer-events-none min-w-[200px]"
        >
          <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] transition-all duration-[800ms] ease-in-out group-hover/btn:left-[200%]" />
          <span className="relative z-10">
            {submitting ? 'Submitting...' : 'Submit Story'}
          </span>
        </button>
      </div>
    </form>
  )
}
