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

// --- Products ---

export async function createProduct(formData: FormData) {
  const supabase = await verifyAdmin()

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: formData.get('name') as string,
      tagline: (formData.get('tagline') as string) || null,
      description: (formData.get('description') as string) || null,
      base_price: parseFloat(formData.get('base_price') as string),
      category: formData.get('category') as string,
      collection: (formData.get('collection') as string) || null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase createProduct error:', error.message, error.code, error.details)
    throw new Error(`Failed to create product: ${error.message}`)
  }
  revalidatePath('/admin/products')
  return data.id
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await verifyAdmin()

  const { error } = await supabase
    .from('products')
    .update({
      name: formData.get('name') as string,
      tagline: (formData.get('tagline') as string) || null,
      description: (formData.get('description') as string) || null,
      base_price: parseFloat(formData.get('base_price') as string),
      category: formData.get('category') as string,
      collection: (formData.get('collection') as string) || null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    })
    .eq('id', id)

  if (error) {
    console.error('Supabase updateProduct error:', error.message, error.code, error.details)
    throw new Error(`Failed to update product: ${error.message}`)
  }
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
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
