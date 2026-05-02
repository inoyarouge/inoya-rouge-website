'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/requireAdmin'

export async function approveTestimonial(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from('testimonials')
    .update({ status: 'approved' })
    .eq('id', id)

  if (error) throw new Error('Failed to approve testimonial')
  revalidatePath('/admin/testimonials')
}

export async function rejectTestimonial(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from('testimonials')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (error) throw new Error('Failed to reject testimonial')
  revalidatePath('/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Failed to delete testimonial')
  revalidatePath('/admin/testimonials')
}

export async function reorderTestimonials(items: { id: string; sort_order: number }[]) {
  const { supabase } = await requireAdmin()

  const results = await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase.from('testimonials').update({ sort_order }).eq('id', id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error('Failed to reorder testimonials')

  revalidatePath('/admin/testimonials')
}
