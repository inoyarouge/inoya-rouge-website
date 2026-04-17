'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/slug'

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

async function upsertDiscount(
  supabase: Awaited<ReturnType<typeof verifyAdmin>>,
  productId: string,
  formData: FormData,
) {
  const enabled = formData.get('discount_enabled') === '1'
  if (!enabled) {
    const { error } = await supabase.from('discounts').delete().eq('product_id', productId)
    if (error) {
      console.error('Supabase deleteDiscount error:', error.message, error.code, error.details)
      throw new Error(`Failed to clear discount: ${error.message}`)
    }
    return
  }
  const type = formData.get('discount_type') as 'percent' | 'flat'
  const valueStr = formData.get('discount_value') as string
  const value = parseFloat(valueStr)
  if (!value || value <= 0) {
    throw new Error('Discount value must be greater than 0')
  }
  if (type === 'percent' && value > 100) {
    throw new Error('Percent discount cannot exceed 100')
  }
  const startsAtRaw = (formData.get('discount_starts_at') as string) || ''
  const endsAtRaw = (formData.get('discount_ends_at') as string) || ''
  const payload = {
    product_id: productId,
    type,
    value,
    starts_at: startsAtRaw ? new Date(startsAtRaw).toISOString() : null,
    ends_at: endsAtRaw ? new Date(endsAtRaw).toISOString() : null,
    is_active: true,
  }
  const { error } = await supabase
    .from('discounts')
    .upsert(payload, { onConflict: 'product_id' })
  if (error) {
    console.error('Supabase upsertDiscount error:', error.message, error.code, error.details)
    throw new Error(`Failed to save discount: ${error.message}`)
  }
}

// --- Products ---

export async function createProduct(formData: FormData) {
  const supabase = await verifyAdmin()

  const name = formData.get('name') as string
  const baseSlug = slugify(name) || 'product'

  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .like('slug', `${baseSlug}%`)

  const taken = new Set((existing ?? []).map((r) => r.slug))
  let slug = baseSlug
  let n = 2
  while (taken.has(slug)) {
    slug = `${baseSlug}-${n}`
    n++
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      tagline: (formData.get('tagline') as string) || null,
      description: (formData.get('description') as string) || null,
      base_price: parseFloat(formData.get('base_price') as string),
      category: formData.get('category') as string,
      collection: (formData.get('collection') as string) || null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      about_product: (formData.get('about_product') as string) || null,
      what_makes_unique: (formData.get('what_makes_unique') as string) || null,
      how_to_use: (formData.get('how_to_use') as string) || null,
      ingredients: (formData.get('ingredients') as string) || null,
      additional_info: (formData.get('additional_info') as string) || null,
      buy_url: (formData.get('buy_url') as string) || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase createProduct error:', error.message, error.code, error.details)
    throw new Error(`Failed to create product: ${error.message}`)
  }

  await upsertDiscount(supabase, data.id, formData)

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath(`/shop/${slug}`)
  revalidatePath('/')
  return data.id
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await verifyAdmin()

  const name = formData.get('name') as string

  // Fetch the current slug so we can revalidate the old URL
  const { data: currentProduct } = await supabase
    .from('products')
    .select('slug')
    .eq('id', id)
    .single()
  const oldSlug = currentProduct?.slug

  // Regenerate slug from the (possibly updated) name
  const baseSlug = slugify(name) || 'product'

  // Check for collisions, excluding this product's own row
  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .like('slug', `${baseSlug}%`)
    .neq('id', id)

  const taken = new Set((existing ?? []).map((r) => r.slug))
  let slug = baseSlug
  let n = 2
  while (taken.has(slug)) {
    slug = `${baseSlug}-${n}`
    n++
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      tagline: (formData.get('tagline') as string) || null,
      description: (formData.get('description') as string) || null,
      base_price: parseFloat(formData.get('base_price') as string),
      category: formData.get('category') as string,
      collection: (formData.get('collection') as string) || null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      about_product: (formData.get('about_product') as string) || null,
      what_makes_unique: (formData.get('what_makes_unique') as string) || null,
      how_to_use: (formData.get('how_to_use') as string) || null,
      ingredients: (formData.get('ingredients') as string) || null,
      additional_info: (formData.get('additional_info') as string) || null,
      buy_url: (formData.get('buy_url') as string) || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Supabase updateProduct error:', error.message, error.code, error.details)
    throw new Error(`Failed to update product: ${error.message}`)
  }

  await upsertDiscount(supabase, id, formData)

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/shop')
  // Revalidate both old and new slug paths so stale caches are cleared
  if (oldSlug) revalidatePath(`/shop/${oldSlug}`)
  if (slug !== oldSlug) revalidatePath(`/shop/${slug}`)
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  const supabase = await verifyAdmin()

  // Delete variant images from storage first
  const { data: variants } = await supabase
    .from('product_variants')
    .select('image_url')
    .eq('product_id', id)

  if (variants) {
    const paths = variants
      .map((v) => v.image_url)
      .filter(Boolean)
      .map((url) => {
        const parts = url!.split('/product-images/')
        return parts[1] ?? ''
      })
      .filter(Boolean)

    if (paths.length > 0) {
      await supabase.storage.from('product-images').remove(paths)
    }
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    console.error('Supabase deleteProduct error:', error.message, error.code, error.details)
    throw new Error(`Failed to delete product: ${error.message}`)
  }
  revalidatePath('/admin/products')
}

export async function toggleProductActive(id: string, is_active: boolean) {
  const supabase = await verifyAdmin()

  const { error } = await supabase
    .from('products')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    console.error('Supabase toggleProduct error:', error.message, error.code, error.details)
    throw new Error(`Failed to toggle product: ${error.message}`)
  }
  revalidatePath('/admin/products')
}

// --- Variants ---

export async function createVariant(productId: string, formData: FormData) {
  const supabase = await verifyAdmin()

  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      shade_name: formData.get('shade_name') as string,
      shade_color: (formData.get('shade_color') as string) || null,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('image_url') as string) || null,
      price_override: formData.get('price_override')
        ? parseFloat(formData.get('price_override') as string)
        : null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase createVariant error:', error.message, error.code, error.details)
    throw new Error(`Failed to create variant: ${error.message}`)
  }
  revalidatePath(`/admin/products/${productId}`)
  return data.id
}

export async function updateVariant(
  id: string,
  productId: string,
  formData: FormData
) {
  const supabase = await verifyAdmin()

  const { error } = await supabase
    .from('product_variants')
    .update({
      shade_name: formData.get('shade_name') as string,
      shade_color: (formData.get('shade_color') as string) || null,
      description: (formData.get('description') as string) || null,
      image_url: (formData.get('image_url') as string) || null,
      price_override: formData.get('price_override')
        ? parseFloat(formData.get('price_override') as string)
        : null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    })
    .eq('id', id)

  if (error) {
    console.error('Supabase updateVariant error:', error.message, error.code, error.details)
    throw new Error(`Failed to update variant: ${error.message}`)
  }
  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteVariant(id: string, productId: string, imageUrl: string | null) {
  const supabase = await verifyAdmin()

  // Delete image from storage
  if (imageUrl) {
    const parts = imageUrl.split('/product-images/')
    const path = parts[1]
    if (path) {
      await supabase.storage.from('product-images').remove([path])
    }
  }

  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase deleteVariant error:', error.message, error.code, error.details)
    throw new Error(`Failed to delete variant: ${error.message}`)
  }
  revalidatePath(`/admin/products/${productId}`)
}

export async function toggleVariantActive(id: string, productId: string, is_active: boolean) {
  const supabase = await verifyAdmin()

  const { error } = await supabase
    .from('product_variants')
    .update({ is_active })
    .eq('id', id)

  if (error) {
    console.error('Supabase toggleVariant error:', error.message, error.code, error.details)
    throw new Error(`Failed to toggle variant: ${error.message}`)
  }
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function reorderProducts(items: { id: string; sort_order: number }[]) {
  const supabase = await verifyAdmin()

  const results = await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase.from('products').update({ sort_order }).eq('id', id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error('Failed to reorder products')

  revalidatePath('/admin/products')
}

export async function reorderVariants(
  productId: string,
  items: { id: string; sort_order: number }[]
) {
  const supabase = await verifyAdmin()

  const results = await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase.from('product_variants').update({ sort_order }).eq('id', id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error('Failed to reorder variants')

  revalidatePath(`/admin/products/${productId}`)
}

export async function uploadVariantImage(
  productId: string,
  variantId: string,
  formData: FormData
) {
  const supabase = await verifyAdmin()

  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const ext = file.name.split('.').pop()
  const path = `${productId}/${variantId}_${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file)

  if (uploadError) {
    console.error('Supabase uploadImage error:', uploadError.message)
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return urlData.publicUrl
}
