import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { SITE_URL } from '@/lib/constants'

const staticRoutes: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/shop', changeFrequency: 'daily', priority: 0.9 },
  { path: '/shop/lips', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/shop/eyes', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/shop/face', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about-us', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/our-team', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/community', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/returns-and-refunds', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/shipping-and-delivery', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/orders-and-payments', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/product-information', changeFrequency: 'yearly', priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true)

    productEntries = (data ?? []).map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch {
    // If the DB/env isn't reachable at build time, ship the sitemap with
    // static routes only rather than failing the whole build.
  }

  return [...staticEntries, ...productEntries]
}
