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
  target: { productId: string } | { variantId: string },
  formData: FormData,
) {
  const isVariant = 'variantId' in target
  const scopeColumn = isVariant ? 'variant_id' : 'product_id'
  const scopeValue = isVariant ? target.variantId : target.productId

  const enabled = formData.get('discount_enabled') === '1'
  if (!enabled) {
    const { error } = await supabase.from('discounts').delete().eq(scopeColumn, scopeValue)
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
    product_id: isVariant ? null : target.productId,
    variant_id: isVariant ? target.variantId : null,
    type,
    value,
    starts_at: startsAtRaw ? new Date(startsAtRaw).toISOString() : null,
    ends_at: endsAtRaw ? new Date(endsAtRaw).toISOString() : null,
    is_active: true,
  }
  const { error } = await supabase
    .from('discounts')
    .upsert(payload, { onConflict: scopeColumn })
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

  await upsertDiscount(supabase, { productId: data.id }, formData)

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

  await upsertDiscount(supabase, { productId: id }, formData)

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

async function revalidateStorefrontForProduct(
  supabase: Awaited<ReturnType<typeof verifyAdmin>>,
  productId: string,
) {
  const { data } = await supabase.from('products').select('slug').eq('id', productId).single()
  revalidatePath('/shop')
  revalidatePath('/')
  if (data?.slug) revalidatePath(`/shop/${data.slug}`)
}

export async function createVariant(productId: string, formData: FormData) {
  const supabase = await verifyAdmin()

  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      shade_name: formData.get('shade_name') as string,
      shade_color: (formData.get('shade_color') as string) || null,
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

  await upsertDiscount(supabase, { variantId: data.id }, formData)

  revalidatePath(`/admin/products/${productId}`)
  await revalidateStorefrontForProduct(supabase, productId)
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

  await upsertDiscount(supabase, { variantId: id }, formData)

  revalidatePath(`/admin/products/${productId}`)
  await revalidateStorefrontForProduct(supabase, productId)
}

export async function deleteVariant(id: string, productId: string, imageUrl: string | null) {
  const supabase = await verifyAdmin()

  // Pull all gallery storage paths so we can remove them in one batch.
  const { data: galleryRows } = await supabase
    .from('variant_images')
    .select('storage_path')
    .eq('variant_id', id)

  const paths = new Set<string>()
  for (const row of galleryRows ?? []) {
    if (row.storage_path) paths.add(row.storage_path)
  }
  // Also cover legacy `image_url` values not yet migrated into the gallery.
  if (imageUrl) {
    const legacy = imageUrl.split('/product-images/')[1]
    if (legacy) paths.add(legacy)
  }

  if (paths.size > 0) {
    await supabase.storage.from('product-images').remove([...paths])
  }

  // FK ON DELETE CASCADE removes variant_images rows automatically.
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase deleteVariant error:', error.message, error.code, error.details)
    throw new Error(`Failed to delete variant: ${error.message}`)
  }
  revalidatePath(`/admin/products/${productId}`)
  await revalidateStorefrontForProduct(supabase, productId)
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

// --- Variant image gallery (multi-image per shade) ---

async function syncVariantPrimaryImage(
  supabase: Awaited<ReturnType<typeof verifyAdmin>>,
  variantId: string,
) {
  const { data: primary } = await supabase
    .from('variant_images')
    .select('url')
    .eq('variant_id', variantId)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  await supabase
    .from('product_variants')
    .update({ image_url: primary?.url ?? null })
    .eq('id', variantId)
}

export async function uploadVariantImages(
  productId: string,
  variantId: string,
  formData: FormData,
) {
  const supabase = await verifyAdmin()

  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) throw new Error('No files provided')

  const { data: existing } = await supabase
    .from('variant_images')
    .select('sort_order')
    .eq('variant_id', variantId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextSort = (existing?.sort_order ?? -1) + 1
  const inserted: Array<{ id: string; variant_id: string; url: string; storage_path: string; sort_order: number; created_at: string }> = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext = file.name.split('.').pop()
    const storagePath = `${productId}/${variantId}_${Date.now()}_${i}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, file)

    if (uploadError) {
      console.error('Supabase uploadVariantImages upload error:', uploadError.message)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(storagePath)

    const { data: row, error: insertError } = await supabase
      .from('variant_images')
      .insert({
        variant_id: variantId,
        url: urlData.publicUrl,
        storage_path: storagePath,
        sort_order: nextSort,
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Supabase uploadVariantImages insert error:', insertError.message)
      await supabase.storage.from('product-images').remove([storagePath])
      throw new Error(`Failed to record image: ${insertError.message}`)
    }

    inserted.push(row)
    nextSort++
  }

  await syncVariantPrimaryImage(supabase, variantId)

  revalidatePath(`/admin/products/${productId}`)
  await revalidateStorefrontForProduct(supabase, productId)
  return inserted
}

export async function deleteVariantImage(
  imageId: string,
  productId: string,
  variantId: string,
) {
  const supabase = await verifyAdmin()

  const { data: row, error: fetchErr } = await supabase
    .from('variant_images')
    .select('storage_path')
    .eq('id', imageId)
    .single()

  if (fetchErr || !row) {
    throw new Error('Image not found')
  }

  if (row.storage_path) {
    await supabase.storage.from('product-images').remove([row.storage_path])
  }

  const { error: delErr } = await supabase.from('variant_images').delete().eq('id', imageId)
  if (delErr) {
    console.error('Supabase deleteVariantImage error:', delErr.message)
    throw new Error(`Failed to delete image: ${delErr.message}`)
  }

  // Re-compact sort_order so 0..n-1 stays contiguous and the primary is always sort_order=0.
  const { data: remaining } = await supabase
    .from('variant_images')
    .select('id')
    .eq('variant_id', variantId)
    .order('sort_order', { ascending: true })

  if (remaining && remaining.length > 0) {
    await Promise.all(
      remaining.map((r, idx) =>
        supabase.from('variant_images').update({ sort_order: idx }).eq('id', r.id),
      ),
    )
  }

  await syncVariantPrimaryImage(supabase, variantId)

  revalidatePath(`/admin/products/${productId}`)
  await revalidateStorefrontForProduct(supabase, productId)
}

export async function reorderVariantImages(
  productId: string,
  variantId: string,
  items: { id: string; sort_order: number }[],
) {
  const supabase = await verifyAdmin()

  const results = await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase.from('variant_images').update({ sort_order }).eq('id', id),
    ),
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error('Failed to reorder images')

  await syncVariantPrimaryImage(supabase, variantId)

  revalidatePath(`/admin/products/${productId}`)
  await revalidateStorefrontForProduct(supabase, productId)
}
