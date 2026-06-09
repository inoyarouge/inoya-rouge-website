import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cookieless Supabase client for PUBLIC, read-only data (products, variants,
 * promotions, approved testimonials, collections).
 *
 * Unlike `server.ts`'s `createClient()`, this never calls `cookies()`, so pages
 * that use it stay statically renderable / ISR-cacheable instead of being forced
 * into per-request dynamic rendering. It reads as the anon role, so RLS still
 * applies exactly as it does for any unauthenticated visitor.
 *
 * Do NOT use this for anything that needs the signed-in user (admin pages,
 * Server Actions, mutations) — use `createClient()` from `server.ts` for those.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
