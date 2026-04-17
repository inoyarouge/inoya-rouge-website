import { createClient } from '@/lib/supabase/server'
import TestimonialTable from '@/components/admin/TestimonialTable'
import type { Testimonial } from '@/lib/types'

export const revalidate = 0

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const testimonials: Testimonial[] = data ?? []

  return (
    <div className="max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-display text-gray-900 mb-6">Testimonials</h1>
      <TestimonialTable testimonials={testimonials} />
    </div>
  )
}
