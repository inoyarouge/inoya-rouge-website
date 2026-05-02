'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60 // 1 hour
// Strip Unicode bidi controls and zero-width chars used for spoofing.
const INVISIBLE_CHARS = /[‪-‮⁦-⁩​-‏﻿]/g
// Reject any HTML/XML-tag-like content as defense-in-depth on top of React escaping.
const TAG_LIKE = /<[^>]+>/

function getClientIp(headerStore: Headers): string {
  // Vercel sets x-real-ip from its trusted edge; prefer it over user-controllable XFF.
  const realIp = headerStore.get('x-real-ip')?.trim()
  if (realIp) return realIp
  // Fall back to last entry in XFF (closest hop), not first (which a client can spoof).
  const xff = headerStore.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return 'unknown'
}

function sanitize(input: string): string {
  return input.replace(INVISIBLE_CHARS, '').trim()
}

export async function submitTestimonial(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const headerStore = await headers()
  const ip = getClientIp(headerStore)
  const bucket = `testimonial:${ip}`

  const name = sanitize(formData.get('name')?.toString() ?? '').slice(0, 100)
  const emailRaw = sanitize(formData.get('email')?.toString() ?? '')
  const email = emailRaw.length > 0 ? emailRaw.slice(0, 254) : null
  const title = sanitize(formData.get('title')?.toString() ?? '').slice(0, 150)
  const content = sanitize(formData.get('story')?.toString() ?? '').slice(0, 2000)

  if (!name || !title || !content) {
    return { success: false, error: 'Please fill in all required fields.' }
  }
  if (TAG_LIKE.test(name) || TAG_LIKE.test(title) || TAG_LIKE.test(content) || (email && TAG_LIKE.test(email))) {
    return { success: false, error: 'HTML is not allowed in submissions.' }
  }

  const supabase = await createClient()

  const { data: allowed, error: rlError } = await supabase.rpc('rate_limit_check_and_record', {
    p_bucket: bucket,
    p_max: RATE_LIMIT_MAX,
    p_window: `${RATE_LIMIT_WINDOW_SECONDS} seconds`,
  })

  if (rlError) {
    console.error('rate_limit_check_and_record error')
    return { success: false, error: 'Submission failed. Please try again.' }
  }
  if (allowed === false) {
    return { success: false, error: 'Please wait before submitting again.' }
  }

  const { error } = await supabase.from('testimonials').insert({
    author_name: name,
    author_email: email,
    title,
    content,
    status: 'pending',
  })

  if (error) {
    console.error('submitTestimonial insert error')
    return { success: false, error: 'Submission failed. Please try again.' }
  }

  return { success: true }
}
