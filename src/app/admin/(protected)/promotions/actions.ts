'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!data) throw new Error('Unauthorized')
  return supabase
}

function parsePromotionPayload(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) throw new Error('Name is required')

  const discount_type = formData.get('discount_type') as 'percent' | 'flat'
  if (discount_type !== 'percent' && discount_type !== 'flat') {
    throw new Error('Invalid discount type')
  }

  const discount_value = parseFloat(formData.get('discount_value') as string)
  if (!discount_value || discount_value <= 0) {
    throw new Error('Discount value must be greater than 0')
  }
  if (discount_type === 'percent' && discount_value > 100) {
    throw new Error('Percent discount cannot exceed 100')
  }

  const scope = formData.get('scope') as 'all' | 'category'
  if (scope !== 'all' && scope !== 'category') {
    throw new Error('Invalid scope')
  }
  const scope_value = scope === 'category'
    ? ((formData.get('scope_value') as string) || null)
    : null
  if (scope === 'category' && !scope_value) {
    throw new Error('Please select a category')
  }

  const startsAtRaw = (formData.get('starts_at') as string) || ''
  const endsAtRaw = (formData.get('ends_at') as string) || ''

  return {
    name,
    description: (formData.get('description') as string) || null,
    discount_type,
    discount_value,
    scope,
    scope_value,
    starts_at: startsAtRaw ? new Date(startsAtRaw).toISOString() : null,
    ends_at: endsAtRaw ? new Date(endsAtRaw).toISOString() : null,
    is_active: formData.get('is_active') === 'true',
  }
}

export async function createPromotion(formData: FormData) {
  const supabase = await verifyAdmin()
  const payload = parsePromotionPayload(formData)

  const { data, error } = await supabase
    .from('promotions')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    console.error('Supabase createPromotion error:', error.message, error.code, error.details)
    throw new Error(`Failed to create promotion: ${error.message}`)
  }

  revalidatePath('/admin/promotions')
  revalidatePath('/shop')
  revalidatePath('/')
  return data.id
}

export async function updatePromotion(id: string, formData: FormData) {
  const supabase = await verifyAdmin()
  const payload = parsePromotionPayload(formData)

  const { error } = await supabase
    .from('promotions')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('Supabase updatePromotion error:', error.message, error.code, error.details)
    throw new Error(`Failed to update promotion: ${error.message}`)
  }

  revalidatePath('/admin/promotions')
  revalidatePath(`/admin/promotions/${id}`)
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function deletePromotion(id: string) {
  const supabase = await verifyAdmin()

  const { error } = await supabase.from('promotions').delete().eq('id', id)
  if (error) {
    console.error('Supabase deletePromotion error:', error.message, error.code, error.details)
    throw new Error(`Failed to delete promotion: ${error.message}`)
  }

  revalidatePath('/admin/promotions')
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function togglePromotionActive(id: string, is_active: boolean) {
  const supabase = await verifyAdmin()

  const { error } = await supabase
    .from('promotions')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    console.error('Supabase togglePromotion error:', error.message, error.code, error.details)
    throw new Error(`Failed to toggle promotion: ${error.message}`)
  }

  revalidatePath('/admin/promotions')
  revalidatePath('/shop')
  revalidatePath('/')
}
