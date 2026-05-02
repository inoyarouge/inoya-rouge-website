export function supabaseImageUrl(url: string, width: number, quality = 70): string {
  if (!url || !url.includes('supabase.co')) return url
  try {
    const u = new URL(url)
    u.searchParams.set('width', String(width))
    u.searchParams.set('quality', String(quality))
    return u.toString()
  } catch {
    return url
  }
}
