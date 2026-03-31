export type Product = {
  id: string
  name: string
  description: string | null
  tagline: string | null
  base_price: number
  category: 'Lips' | 'Eyes' | 'Face'
  collection: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  variants?: ProductVariant[]
}

export type ProductVariant = {
  id: string
  product_id: string
  shade_name: string
  shade_color: string | null
  description: string | null
  image_url: string | null
  price_override: number | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export type Testimonial = {
  id: string
  author_name: string
  author_email: string | null
  title: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
