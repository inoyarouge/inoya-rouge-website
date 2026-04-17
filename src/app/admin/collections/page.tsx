import { createClient } from '@/lib/supabase/server'
import CollectionManager from '@/components/admin/CollectionManager'
import type { Collection } from '@/lib/types'

export const revalidate = 0

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })

  const collections = (data ?? []) as Collection[]

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-display text-gray-900 mb-2">Collections</h1>
      <p className="text-sm text-gray-500 mb-8">
        Manage product collections per category. These appear in the product form dropdown and as sub-filters on the shop page.
      </p>
      <CollectionManager collections={collections} />
    </div>
  )
}
