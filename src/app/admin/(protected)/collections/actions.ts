'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/requireAdmin'

function revalidateAll() {
  revalidatePath('/admin/collections')
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function createCollection(category: string, name: string) {
  const { supabase } = await requireAdmin()

  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name is required')
  if (!['Lips', 'Eyes', 'Face'].includes(category)) {
    throw new Error('Invalid category')
  }

  const { data: maxRow } = await supabase
    .from('collections')
    .select('sort_order')
    .eq('category', category)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = (maxRow?.sort_order ?? -1) + 1

  const { data, error } = await supabase
    .from('collections')
    .insert({ category, name: trimmed, sort_order: nextOrder })
    .select('id')
    .single()

  if (error) {
    console.error('createCollection error:', error)
    throw new Error('Failed to create collection')
  }

  revalidateAll()
  return data.id
}

export async function updateCollection(id: string, newName: string) {
  const { supabase } = await requireAdmin()

  const trimmed = newName.trim()
  if (!trimmed) throw new Error('Name is required')

  const { data: existing, error: fetchErr } = await supabase
    .from('collections')
    .select('category, name')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) {
    throw new Error('Collection not found')
  }

  if (existing.name === trimmed) return

  const { error } = await supabase
    .from('collections')
    .update({ name: trimmed })
    .eq('id', id)

  if (error) {
    console.error('updateCollection error:', error)
    throw new Error('Failed to update collection')
  }

  const { error: cascadeErr } = await supabase
    .from('products')
    .update({ collection: trimmed })
    .eq('category', existing.category)
    .eq('collection', existing.name)

  if (cascadeErr) {
    console.error('updateCollection cascade error:', cascadeErr.message)
  }

  revalidateAll()
}

export async function deleteCollection(id: string) {
  const { supabase } = await requireAdmin()

  const { data: existing, error: fetchErr } = await supabase
    .from('collections')
    .select('category, name')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) {
    throw new Error('Collection not found')
  }

  const { error: nullifyErr } = await supabase
    .from('products')
    .update({ collection: null })
    .eq('category', existing.category)
    .eq('collection', existing.name)

  if (nullifyErr) {
    console.error('deleteCollection nullify error:', nullifyErr.message)
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteCollection error:', error)
    throw new Error('Failed to delete collection')
  }

  revalidateAll()
}

export async function reorderCollections(
  items: { id: string; sort_order: number }[]
) {
  const { supabase } = await requireAdmin()

  const results = await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase.from('collections').update({ sort_order }).eq('id', id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error('Failed to reorder collections')

  revalidateAll()
}
