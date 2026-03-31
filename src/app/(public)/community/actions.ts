'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW)
  rateLimitMap.set(ip, recent)
  return recent.length < RATE_LIMIT_MAX
}

function recordSubmission(ip: string) {
  const timestamps = rateLimitMap.get(ip) ?? []
  timestamps.push(Date.now())
  rateLimitMap.set(ip, timestamps)
}

export async function submitTestimonial(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return { success: false, error: 'Please wait before submitting again.' }
  }

  const name = formData.get('name')?.toString().trim().slice(0, 100)
  const email = formData.get('email')?.toString().trim() || null
  const title = formData.get('title')?.toString().trim().slice(0, 150)
  const content = formData.get('story')?.toString().trim().slice(0, 2000)

  if (!name || !title || !content) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').insert({
    author_name: name,
    author_email: email,
    title,
    content,
    status: 'pending',
  })

  if (error) {
    return { success: false, error: 'Submission failed. Please try again.' }
  }

  recordSubmission(ip)
  return { success: true }
}
