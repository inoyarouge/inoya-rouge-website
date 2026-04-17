export type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  tagline: string | null
  base_price: number
  category: 'Lips' | 'Eyes' | 'Face'
  collection: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  about_product: string | null
  what_makes_unique: string | null
  how_to_use: string | null
  ingredients: string | null
  additional_info: string | null
  buy_url: string | null
  variants?: ProductVariant[]
  discount?: Discount | null
}

export type Discount = {
  id: string
  product_id: string
  type: 'percent' | 'flat'
  value: number
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  created_at: string
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
  sort_order: number
  created_at: string
}

export type Collection = {
  id: string
  category: 'Lips' | 'Eyes' | 'Face'
  name: string
  sort_order: number
  created_at: string
}
