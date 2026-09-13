/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' https://*.supabase.co data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // tighten after testing
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co https://nominatim.openstreetmap.org",
    ].join('; ')
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
]

const nextConfig = {
  experimental: {
    // Tree-shake heavy barrel imports so only the icons/animations actually used
    // are bundled, shrinking the client JS for every page.
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimized images are cached for a year. Upload paths are timestamped
    // (see ImageUploader), so every new upload is a new URL — a long TTL is safe.
    // The default is 60s, which meant most visitors hit a cold optimizer and
    // re-paid the full source fetch + AVIF encode.
    minimumCacheTTL: 31536000,
    // Next 15 rejects quality values not listed here. These are the ones in use.
    qualities: [60, 65, 70, 75, 80],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  }
}

module.exports = nextConfig