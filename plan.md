# Inoya Rouge — Implementation Blueprint v5
# For Claude Code

## Overview

Build a Next.js website for Inoya Rouge (Indian luxury cosmetics brand) with two sides:
1. **Public site** — customers browse products, read approved testimonials, submit stories
2. **Admin dashboard** — admin manages products (with shade variants and image uploads) and moderates testimonials

**Tech stack:** Next.js (App Router) + Supabase (database, auth, storage) + Tailwind CSS
**Hosting:** Vercel (free) + Supabase (free tier) + UptimeRobot (free keep-alive)

**Brand details:**
- Brand: Inoya Rouge — Indian luxury cosmetics
- Tagline: "Inspired by Nature, Defined by Color"
- Categories: Lips, Eyes, Face
- Products: 22 SKUs across 8 collections
- Aesthetic: Luxury, warm, botanical, premium Indian beauty
- Brand colors: Deep rose/pink (#C7365F), warm orange, leaf green (extract from logo)

---

## Architecture

```
Customers → inoyarouge.com (Vercel) → Public pages → fetch from Supabase
Admin    → inoyarouge.com/admin   → Admin pages  → read/write Supabase
UptimeRobot → pings Supabase every 5 min (free tier keep-alive)
```

One Next.js app. One Supabase project. One codebase. One deployment.

---

## Build Scope

Everything in this blueprint is part of the core build. The admin dashboard includes both **product management** (full CRUD with variant/shade management and image upload) and **testimonial moderation**. Products are seeded via SQL for initial launch; the admin can then add, edit, and remove products through the dashboard.

---

## Database Schema

### Table: `products`
*Created at setup. Populated via seed script initially. Managed via admin dashboard.*

| Column       | Type        | Constraints                      | Description                              |
|-------------|-------------|----------------------------------|------------------------------------------|
| id          | uuid        | PK, default: gen_random_uuid()   | Auto-generated unique ID                 |
| name        | text        | NOT NULL                         | Product name (e.g. "Rouge Infinity")     |
| description | text        |                                  | Full product description                 |
| tagline     | text        |                                  | Short tagline (e.g. "The Iconic Red")    |
| base_price  | numeric     | NOT NULL                         | Default price (used if variant has none) |
| category    | text        | NOT NULL, CHECK (category IN ('Lips', 'Eyes', 'Face')) | Product category |
| collection  | text        |                                  | Collection name (e.g. "Kysmé", "Liquid Allure", "Tint Amour") |
| is_active   | boolean     | DEFAULT true                     | true = shown on site, false = hidden     |
| sort_order  | integer     | DEFAULT 0                        | Controls display order in catalog        |
| created_at  | timestamptz | DEFAULT now()                    | Auto-set on creation                     |

### Table: `product_variants`
*Each product can have multiple shades/variants. Each variant has its own image, color, and optional price.*

| Column        | Type        | Constraints                      | Description                              |
|--------------|-------------|----------------------------------|------------------------------------------|
| id           | uuid        | PK, default: gen_random_uuid()   | Auto-generated unique ID                 |
| product_id   | uuid        | FK → products.id, NOT NULL       | Which product this variant belongs to    |
| shade_name   | text        | NOT NULL                         | Shade name (e.g. "Classic Red", "Nude Pink") |
| shade_color  | text        |                                  | Hex color code for swatch display (e.g. "#C7365F") |
| description  | text        |                                  | Shade-specific description               |
| image_url    | text        |                                  | Photo URL for this specific shade        |
| price_override | numeric   |                                  | If set, overrides product's base_price for this shade. If null, uses base_price. |
| is_active    | boolean     | DEFAULT true                     | Toggle individual shades on/off          |
| sort_order   | integer     | DEFAULT 0                        | Admin controls display order of shades   |
| created_at   | timestamptz | DEFAULT now()                    | Auto-set on creation                     |

### Table: `testimonials`
*General brand testimonials. NOT tied to products. Created by visitors, moderated by admin.*

| Column       | Type        | Constraints                      | Description                              |
|-------------|-------------|----------------------------------|------------------------------------------|
| id          | uuid        | PK, default: gen_random_uuid()   | Auto-generated unique ID                 |
| author_name | text        | NOT NULL, max 100 chars          | Visitor's display name                   |
| author_email| text        |                                  | Never shown publicly. Never returned in public API responses. |
| title       | text        | NOT NULL, max 150 chars          | Story headline                           |
| content     | text        | NOT NULL, max 2000 chars         | The actual testimonial text. Always render as plain text — never dangerouslySetInnerHTML. |
| status      | text        | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending', 'approved', 'rejected')) | Moderation status |
| created_at  | timestamptz | DEFAULT now()                    | Auto-set on submission                   |

### Table: `admin_users`
*Explicit allowlist of admin UIDs. Used for RLS policies. More secure than trusting auth.role().*

| Column     | Type        | Constraints                    | Description                    |
|-----------|-------------|--------------------------------|--------------------------------|
| user_id   | uuid        | PK, FK → auth.users.id         | Supabase auth UID of the admin |
| created_at| timestamptz | DEFAULT now()                  | When this admin was added      |

### Auth: `auth.users`
Handled by Supabase Auth automatically. Admin accounts created manually in Supabase dashboard, then their UID is inserted into `admin_users`.

---

## Supabase Row Level Security (RLS)

> **CRITICAL:** All policies use `admin_users` table checks — NOT `auth.role() = 'authenticated'`.
> Using `auth.role() = 'authenticated'` would grant admin access to ANY logged-in Supabase user, not just the actual admin account.

### Products table
```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products (public)
CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (is_active = true);

-- Only verified admins can do everything
CREATE POLICY "Admins full access to products"
ON products FOR ALL
USING (auth.uid() IN (SELECT user_id FROM admin_users));
```

### Product variants table
```sql
-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Anyone can read active variants of active products
CREATE POLICY "Public can view active variants"
ON product_variants FOR SELECT
USING (
  is_active = true
  AND product_id IN (SELECT id FROM products WHERE is_active = true)
);

-- Only verified admins can do everything
CREATE POLICY "Admins full access to variants"
ON product_variants FOR ALL
USING (auth.uid() IN (SELECT user_id FROM admin_users));
```

### Testimonials table
```sql
-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved testimonials (public)
-- author_email is explicitly excluded from the public select
CREATE POLICY "Public can view approved testimonials"
ON testimonials FOR SELECT
USING (status = 'approved');

-- Anyone can insert (public form), forced to pending
-- DB constraint enforces status = 'pending' so client cannot set 'approved' directly
CREATE POLICY "Public can submit testimonials"
ON testimonials FOR INSERT
WITH CHECK (status = 'pending');

-- Admins can read all (including author_email for moderation)
CREATE POLICY "Admins can view all testimonials"
ON testimonials FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Admins can update status only
CREATE POLICY "Admins can update testimonials"
ON testimonials FOR UPDATE
USING (auth.uid() IN (SELECT user_id FROM admin_users));
```

### Admin users table
```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read (to verify their own access)
CREATE POLICY "Admins can read admin_users"
ON admin_users FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- No INSERT/UPDATE/DELETE via client — manage manually via Supabase dashboard only
```

---

## Supabase Storage

Create one public bucket: `product-images`
- Set to public so images load without auth
- Used for product variant photos
- Initially, images uploaded manually via Supabase dashboard or seed script
- Once admin product CRUD is built, images uploaded through admin dashboard UI

**Storage security rules (set in Supabase dashboard):**
```sql
-- Public can read all files in product-images
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Only admins can upload/delete
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid() IN (SELECT user_id FROM admin_users)
);
```

**Image upload validation (admin product form):**
- Validate MIME type server-side (only accept `image/jpeg`, `image/png`, `image/webp`)
- Max file size: 5MB
- Filename: `{product_id}/{variant_id}_{timestamp}.{ext}`

---

## Page Structure

### Public Pages (no auth required)

#### `/` — Homepage
- **Rendering:** ISR, revalidate every 3600s (1 hour)
- **Section 1: Hero** — full-width image, logo, tagline "Inspired by Nature, Defined by Color", CTA "Explore the Collection" → /shop. Hero image uses `<Image priority>` (it is the LCP element — must load immediately).
- **Section 2: Trust badges** — horizontal strip: Cruelty-Free | Skin-Friendly | Paraben Conscious | Inspired by Nature | Made for Indian Skin
- **Section 3: Featured products** — 3 product cards (one per category). Show product image (first active variant's image), name, collection badge, price. Wrapped in `<Suspense>`.
- **Section 4: Brand story teaser** — 2-3 sentences from brand story + lifestyle image + "Read our story" → /our-story
- **Section 5: Shop by category** — 3 large cards: Lips / Eyes / Face with taglines. Click → /shop filtered
- **Section 6: Customer stories** — 2-3 approved testimonials. "Read more" → /community. Hidden if none approved yet. Wrapped in `<Suspense>`.
- **Section 7: Instagram** — "Follow us on Instagram @handle" (placeholder until handle provided)
- **Data:** featured products (1 per category, is_active=true, with first variant) + approved testimonials (limit 3)

#### `/shop` — Product Listing
- **Rendering:** ISR, revalidate every 1800s (30 min)
- **Category filter bar:** All | Lips | Eyes | Face (client-side filtering — no re-fetch)
- **Sub-filters for Lips:** All Lips | Kysmé | Liquid Allure | Tint Amour
- **Category tagline:** shown when category selected (Eyes: "Define, Dazzle, Dominate" / Face: "Naturally Luxe, Perfectly You")
- **Product grid:** responsive (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`). Each card:
  - Image wrapped in `<div className="relative aspect-[3/4]">` — prevents CLS
  - Product name, collection badge, price
  - Click → /shop/[id]
- Product grid wrapped in `<Suspense fallback={<SkeletonGrid />}>`
- **Data:** all products where is_active=true, with their first active variant (sorted by sort_order)

#### `/shop/[id]` — Single Product Page
- **Rendering:** SSR (revalidate: 0) — variant prices can change
- **Layout:**
  - Mobile: full-width stack (image on top, details below)
  - Tablet (md:): 50/50 side by side
  - Desktop (lg:): `grid-cols-[60%_40%]`
- **Left column:** Large product image. All variant images are preloaded at mount; visibility-swap on swatch click (not src-swap — avoids network flicker).
- **Right column:**
  - Collection badge
  - Product name (large)
  - Tagline
  - **Shade selector:** row of color swatches. Mobile: 48px circles (`w-12 h-12`), desktop: 40px (`w-10 h-10`). Horizontal scroll with `overflow-x-auto overscroll-x-contain` if many shades. Clicking a swatch:
    - Highlights that swatch with `ring-2 ring-offset-2 ring-brand-rose` (not border — avoids CLS)
    - Swaps visible image using opacity toggle (all images pre-rendered, only one visible)
    - Updates shade name display
    - Updates price if that shade has a price_override
  - Price display (variant price_override if exists, else product base_price)
  - Full description
  - CTA: "Available soon" or external link
- **Below:** "You may also love" — 3-4 products from same collection/category. Wrapped in `<Suspense>`.
- **Data:** single product + all its active variants (sorted by sort_order) + related products
- **ShadeSelector** is a Client Component (`'use client'`). Rest of the page is Server Component.

#### `/our-story` — Brand Story Page
- **Rendering:** SSG (no revalidation — fully static)
- Section 1: Hero — "Beauty, redefined the natural way" + lifestyle image
- Section 2: Brand story (80-100 word version)
- Section 3: Origin story (founders narrative)
- Section 4: Name meaning ("Inoya" + "Rouge")
- Section 5: Clean beauty promise (5 pillars with icons)
- Section 6: Ingredients — Inspired by India
- Section 7: What makes us different (4 pillars)
- Section 8: Team (4 members)
- Section 9: Vision (closing quote)
- **Data:** none — all static content

#### `/community` — Customer Stories
- **Rendering:** SSR (revalidate: 0) — testimonials change frequently
- **Page header:** "Your stories" + intro text + "Share your story" CTA
- **Stories grid:** approved testimonials, newest first. Each card: author name, title, content snippet (expandable), date. Testimonial content always rendered as plain text — never as HTML.
- **Empty state:** "Be the first to share your Inoya Rouge story"
- **Submission form (Client Component):**
  - name (required, max 100 chars)
  - email (optional)
  - title (required, max 150 chars)
  - story (required, textarea, max 2000 chars)
  - Client-side validation before submit
  - Uses Next.js Server Action (built-in CSRF protection)
  - On success: "Thank you! Your story is under review."
  - Rate-limited: max 3 submissions per IP per hour (enforced in Server Action)
- **Data:** all testimonials where status='approved' ORDER BY created_at DESC

#### `/contact` — Contact Page
- **Rendering:** SSG (fully static)
- Contact cards: Phone (9836048717, Mon-Sat 10AM-8PM), Email (InoyaRouge@gmail.com), Social (Instagram handle — pending)
- Optional: simple enquiry form
- **Data:** none — static content

#### `/policies` — Policies Page
- **Rendering:** SSG (fully static)
- Tabbed layout: Privacy | Shipping | Returns. Tab switching is client-side only (no re-fetch).
- All content provided by admin, rendered as formatted text
- Tab buttons min height 44px for touch targets
- **Data:** none — static content

---

### Admin Pages (auth required)

#### Middleware: `middleware.ts`
- Intercepts all `/admin/*` requests
- Uses `supabase.auth.getUser()` — NOT `getSession()`. `getUser()` validates the token against Supabase server; `getSession()` trusts the local cookie without server validation.
- No valid user → redirect to `/admin/login`
- Valid user → allow through and refresh session cookie
- Do NOT prefetch admin routes from public pages (`<Link prefetch={false}>`)

```typescript
// Correct middleware pattern
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        }
      }
    }
  )
  // getUser() validates server-side — use this, not getSession()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return response
}
```

#### `/admin/login`
- **Rendering:** SSR, no-cache
- Email + password form (Client Component)
- `supabase.auth.signInWithPassword({ email, password })`
- On success → redirect to `/admin/testimonials`
- No public registration — admin accounts created manually in Supabase dashboard only
- Generic error message on failure ("Invalid credentials") — do not reveal whether email exists

#### `/admin/testimonials` — Testimonial Moderation (MODULE A — BUILD NOW)
- **Rendering:** SSR, no-cache — always fresh
- Table listing ALL testimonials (admin can see all statuses)
- **Filters (client-side state):**
  - Status: All / Pending / Approved / Rejected (default: Pending)
  - Search: by author name or title (backend filter — not client-side)
  - Sort: newest first (default)
- **Columns:** author name, title, status badge, date
- **Expandable rows:** clicking shows full content (plain text only)
- **Actions (Server Actions):** Approve button, Reject button per row
  - Approve → `UPDATE testimonials SET status='approved' WHERE id=X`
  - Reject → `UPDATE testimonials SET status='rejected' WHERE id=X`
  - Both actions verify admin UID before updating (defense in depth beyond RLS)
- **Pending count badge** in sidebar nav
- Pagination: load 50 rows at a time (`.limit(50).range(offset, offset+49)`)

#### `/admin/products` — Product Management
- **Rendering:** SSR, no-cache — always fresh

**Product list view:**
- Table listing ALL products (active and inactive)
- Columns: thumbnail (first variant image), name, collection, category, base price, variants count, status, sort order
- "Add Product" button
- Each row: Edit, Delete (with confirmation), Activate/Deactivate toggle
- Drag-to-reorder OR sort_order number input for manual ordering

**Add/Edit product form:**
- Product name (text, required)
- Tagline (text)
- Description (textarea)
- Base price (number, required)
- Category (dropdown: Lips / Eyes / Face)
- Collection (dropdown: depends on category selection)
  - Lips → Kysmé, Liquid Allure, Tint Amour, Other
  - Eyes → Kajal, Mascara, Eyeliner, Other
  - Face → Foundation, Compact, Primer, Blush, Highlighter, Other
- Active toggle
- Sort order (number)
- Save button

**Variant management (within product edit):**
- Section below the product form: "Shades & Variants"
- List of existing variants with:
  - Color swatch preview (circle with shade_color)
  - Shade name
  - Price override (or "Uses base price" if null)
  - Thumbnail
  - Active toggle
  - Sort order (drag or number)
  - Edit / Delete buttons
- "Add Shade" button opens variant form:
  - Shade name (text, required)
  - Shade color (color picker → hex code)
  - Description (textarea)
  - Image upload (file picker → Supabase Storage → saves URL). Validate: MIME type must be image/jpeg, image/png, or image/webp. Max 5MB.
  - Price override (number, optional — leave blank to use base price)
  - Active toggle
  - Sort order (number)
  - Save button

**Image upload flow:**
1. Admin clicks upload in variant form
2. File picker opens
3. Client validates MIME type and size before upload
4. Selected image uploads to Supabase Storage `product-images` bucket
5. Filename: `{product_id}/{variant_id}_{timestamp}.{ext}`
6. Get public URL: `supabase.storage.from('product-images').getPublicUrl(path)`
7. Save URL to variant's `image_url` field

**Variant display logic on public site:**
- Shade swatches shown in sort_order (admin-controlled)
- First active variant (lowest sort_order) is the default displayed shade
- Clicking a swatch → opacity-based image swap (all images pre-rendered in DOM)
- Only active variants shown (is_active = true)
- If a variant has price_override → show that price. If null → show product's base_price

#### `/admin/products/[id]` — Edit Product
- **Rendering:** SSR, no-cache
- Loads existing product data + all variants (active and inactive)
- Uses ProductForm for product fields (name, tagline, description, base_price, category, collection, active, sort_order)
- Uses VariantManager below the product form to list/add/edit/delete variants
- Each variant row opens VariantForm for editing (shade name, color, description, image, price override, active, sort_order)
- ImageUploader component within VariantForm handles image upload to Supabase Storage
- Save updates product in DB via Server Action
- Back link to /admin/products

#### `/admin/products/actions.ts` — Product Server Actions
```typescript
'use server'
// All actions verify admin UID via getUser() before executing (defense in depth beyond RLS)

// Product CRUD
export async function createProduct(formData: FormData) { ... }
export async function updateProduct(id: string, formData: FormData) { ... }
export async function deleteProduct(id: string) { ... }  // cascades to variants

// Variant CRUD
export async function createVariant(productId: string, formData: FormData) { ... }
export async function updateVariant(id: string, formData: FormData) { ... }
export async function deleteVariant(id: string) { ... }  // also deletes image from Storage

// Image upload
export async function uploadVariantImage(variantId: string, file: File) { ... }
// Validates MIME (jpeg/png/webp), max 5MB, uploads to Supabase Storage, returns public URL
```

---

### Admin Sidebar Navigation
- **Products** — links to /admin/products
- **Testimonials** — with pending count badge
- **View site** — opens public site in new tab
- **Logout** — signs out, redirects to /admin/login

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with navbar + security headers
│   ├── page.tsx                      # Homepage (ISR 1h)
│   ├── shop/
│   │   ├── page.tsx                  # Product catalog (ISR 30min)
│   │   └── [id]/
│   │       └── page.tsx              # Single product (SSR)
│   ├── our-story/
│   │   └── page.tsx                  # Brand story page (SSG)
│   ├── community/
│   │   └── page.tsx                  # Testimonials + submission form (SSR)
│   ├── contact/
│   │   └── page.tsx                  # Contact info (SSG)
│   ├── policies/
│   │   └── page.tsx                  # Tabbed policies (SSG)
│   └── admin/
│       ├── login/
│       │   └── page.tsx              # Admin login (SSR, no-cache)
│       ├── testimonials/
│       │   └── page.tsx              # Moderation queue (SSR, no-cache)
│       ├── products/
│       │   ├── page.tsx              # Product list (SSR, no-cache)
│       │   ├── [id]/
│       │   │   └── page.tsx          # Edit product (SSR, no-cache)
│       │   └── actions.ts            # Server Actions for product/variant CRUD
│       └── layout.tsx                # Admin layout with sidebar
├── components/
│   ├── public/
│   │   ├── Navbar.tsx                # Server Component
│   │   ├── Footer.tsx                # Server Component
│   │   ├── ProductCard.tsx           # Server Component
│   │   ├── ShadeSelector.tsx         # CLIENT Component ('use client') — manages selected variant state
│   │   ├── TestimonialCard.tsx       # Server Component
│   │   ├── TestimonialForm.tsx       # CLIENT Component ('use client') — form state + submission
│   │   ├── CategoryFilter.tsx        # CLIENT Component ('use client') — manages active category state
│   │   └── TrustBadges.tsx           # Server Component
│   └── admin/
│       ├── Sidebar.tsx               # CLIENT Component ('use client') — mobile open/close state
│       ├── TestimonialTable.tsx      # CLIENT Component ('use client') — filter/sort/expand state
│       ├── StatusBadge.tsx           # Server Component
│       ├── ProductTable.tsx          # CLIENT Component ('use client') — filter/sort state
│       ├── ProductForm.tsx           # CLIENT Component ('use client') — form state
│       ├── VariantManager.tsx        # CLIENT Component ('use client') — variant list + reorder state
│       ├── VariantForm.tsx           # CLIENT Component ('use client') — individual variant form state
│       └── ImageUploader.tsx         # CLIENT Component ('use client') — file upload + validation
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   └── server.ts                 # Server client
│   └── types.ts                      # TypeScript types
├── middleware.ts                      # Auth middleware (uses getUser not getSession)
└── styles/
    └── globals.css                   # Tailwind + brand styles + safe-area insets
```

---

## TypeScript Types

```typescript
type Product = {
  id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  base_price: number;
  category: 'Lips' | 'Eyes' | 'Face';
  collection: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  variants?: ProductVariant[]; // joined from product_variants
};

type ProductVariant = {
  id: string;
  product_id: string;
  shade_name: string;
  shade_color: string | null;
  description: string | null;
  image_url: string | null;
  price_override: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

type Testimonial = {
  id: string;
  author_name: string;
  author_email: string | null; // only populated in admin context
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
```

---

## Key Implementation Notes

### Supabase Client Setup
- `@supabase/supabase-js` and `@supabase/ssr`
- Browser client for client components, server client for server components + middleware
- Env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Never use `SUPABASE_SERVICE_ROLE_KEY` in any `NEXT_PUBLIC_` variable — this would expose full database access to all users**

### Security Headers (next.config.js)
Must be set in `next.config.js`:
```javascript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' https://*.supabase.co data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // tighten after testing
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co",
    ].join('; ')
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  }
}
```

### Tailwind Brand Colors (tailwind.config.js)
Define brand colors in config — NOT as CSS variables — for zero-runtime fallback:
```javascript
theme: {
  extend: {
    colors: {
      'brand-rose': '#C7365F',
      // Add warm orange and leaf green once extracted from logo
    },
    fontFamily: {
      serif: ['Playfair Display', 'Georgia', 'serif'],
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    }
  }
}
```

### Font Setup (globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Safe area insets for notched phones (iPhone X+) */
@supports (padding: max(0px)) {
  .safe-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
```

### Shade Selector Logic (Public Product Page)
```
1. Fetch product + all active variants (sorted by sort_order) — server side
2. Pass variants as props to ShadeSelector (Client Component)
3. Default state: first variant selected
4. Render all variant images stacked with position:absolute — only selected one is opacity-100, others opacity-0
5. On swatch click:
   - Set selected variant state
   - Selected image becomes opacity-100, others opacity-0 (CSS transition: opacity 300ms)
   - Price display = variant's price_override ?? product's base_price
   - Shade name display = variant's shade_name
6. Active shade swatch gets ring-2 ring-offset-2 ring-brand-rose (ring, not border — avoids CLS)
7. Swatch sizes: w-12 h-12 on mobile (48px — WCAG touch target), w-10 h-10 on desktop
8. Swatch row: flex overflow-x-auto gap-3 pb-2, overscroll-behavior-x: contain
```

### Image Optimization Rules
All product images MUST follow these rules — no exceptions:
```tsx
// Product card (shop grid)
<div className="relative aspect-[3/4] overflow-hidden rounded-lg">
  <Image
    src={variant.image_url}
    alt={`${product.name} - ${variant.shade_name}`}
    fill
    className="object-cover"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
  />
</div>

// Hero image (homepage) — must use priority
<Image
  src={heroUrl}
  alt="Inoya Rouge"
  width={1920}
  height={1080}
  priority  // <-- LCP element, load immediately
  sizes="100vw"
  className="w-full h-auto"
/>

// Product detail — all variant images pre-rendered for opacity-swap
{variants.map((variant, index) => (
  <div
    key={variant.id}
    className={`absolute inset-0 transition-opacity duration-300 ${
      selectedId === variant.id ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <Image
      src={variant.image_url}
      alt={`${product.name} - ${variant.shade_name}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 60vw"
      priority={index === 0}  // first variant loads eagerly
    />
  </div>
))}
```

### Product Data Fetching
```sql
-- Shop page: all active products with their first active variant
SELECT p.*,
  (SELECT row_to_json(v) FROM product_variants v
   WHERE v.product_id = p.id AND v.is_active = true
   ORDER BY v.sort_order LIMIT 1) as first_variant
FROM products p
WHERE p.is_active = true
ORDER BY p.sort_order;

-- Product detail page: single product + all active variants
SELECT * FROM products WHERE id = $1;
SELECT * FROM product_variants WHERE product_id = $1 AND is_active = true ORDER BY sort_order;

-- Related products (same category, exclude current)
SELECT p.*, (SELECT row_to_json(v) FROM product_variants v
  WHERE v.product_id = p.id AND v.is_active = true ORDER BY v.sort_order LIMIT 1) as first_variant
FROM products p
WHERE p.category = $1 AND p.id != $2 AND p.is_active = true
LIMIT 4;

-- Homepage featured (1 per category)
-- Run once per category (3 queries) — results cached by ISR
```

### Testimonial Flows

**Public submission (Server Action with rate limiting):**
```typescript
// app/community/actions.ts
'use server'
import { headers } from 'next/headers'

export async function submitTestimonial(formData: FormData) {
  // Rate limiting: check IP against a simple in-memory or Supabase counter
  const ip = headers().get('x-forwarded-for') ?? 'unknown'
  // (implement rate check here — max 3 per IP per hour)

  const name = formData.get('name')?.toString().trim().slice(0, 100)
  const email = formData.get('email')?.toString().trim() || null
  const title = formData.get('title')?.toString().trim().slice(0, 150)
  const content = formData.get('story')?.toString().trim().slice(0, 2000)

  if (!name || !title || !content) return { error: 'Missing required fields' }

  const supabase = createServerClient(...)
  const { error } = await supabase.from('testimonials').insert({
    author_name: name,
    author_email: email,
    title,
    content,
    status: 'pending'  // RLS enforces this anyway, but be explicit
  })

  if (error) return { error: 'Submission failed. Please try again.' }
  return { success: true }
}
```

**Admin moderation (Server Actions, verify admin UID):**
```typescript
// app/admin/testimonials/actions.ts
'use server'
export async function approveTestimonial(id: string) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('testimonials').update({ status: 'approved' }).eq('id', id)
}

export async function rejectTestimonial(id: string) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('testimonials').update({ status: 'rejected' }).eq('id', id)
}

// Fetch with server-side filtering (not client-side)
export async function fetchTestimonials(status: string, search: string, offset = 0) {
  const supabase = createServerClient(...)
  let query = supabase.from('testimonials').select('*', { count: 'exact' })

  if (status !== 'all') query = query.eq('status', status)
  if (search) query = query.or(`author_name.ilike.%${search}%,title.ilike.%${search}%`)

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .limit(50)
    .range(offset, offset + 49)

  return { data, count }
}
```

### Admin Auth Flow
```typescript
// Login (Client Component)
const { error } = await supabase.auth.signInWithPassword({ email, password })
// Error message: always show generic "Invalid credentials" — never reveal if email exists

// Middleware check — use getUser() not getSession()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/admin/login')

// Logout
await supabase.auth.signOut()
redirect('/admin/login')
```

### Rendering / Caching Strategy Per Page

| Page | Strategy | `revalidate` value | Rationale |
|------|----------|-------------------|-----------|
| `/` Homepage | ISR | `3600` | Featured products stable |
| `/shop` | ISR | `1800` | Product list semi-stable |
| `/shop/[id]` | SSR | `0` | Prices/variants dynamic |
| `/our-story` | SSG | `false` | Fully static |
| `/community` | SSR | `0` | Testimonials update often |
| `/contact` | SSG | `false` | Fully static |
| `/policies` | SSG | `false` | Fully static |
| `/admin/login` | SSR | `0` | No caching ever |
| `/admin/testimonials` | SSR | `0` | Always fresh |
| `/admin/products` | SSR | `0` | Always fresh |
| `/admin/products/[id]` | SSR | `0` | Always fresh |

Set these at the top of each page file:
```typescript
export const revalidate = 3600 // or 0 or false
```

### Cross-Browser Compatibility Rules

Follow these when writing components:
1. **Swatch circles:** Use `rounded-full` + `overflow-hidden` + explicit `aspect-square` (not just border-radius alone — Safari inconsistency)
2. **Product grid:** Use `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (never 2 as mobile base — too cramped)
3. **Swatch hover:** Always maintain a persistent selected state with `ring` — hover states don't exist on touch devices
4. **Touch targets:** All interactive elements (buttons, tabs, swatches) min 44px height / 48px for swatches on mobile
5. **Font smoothing:** Add `-webkit-font-smoothing: antialiased` globally in CSS
6. **Transitions:** Use `transition-opacity` for image swaps (not transform) — better cross-browser performance
7. **Viewport meta:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />` — required for notched iPhone safe areas

### Server vs Client Components (Quick Reference)

| Component | Type | Why |
|-----------|------|-----|
| Navbar, Footer | Server | No interactivity |
| ProductCard, ProductGrid | Server | No interactivity |
| ShadeSelector | **Client** | Selected variant state |
| CategoryFilter | **Client** | Active category state |
| TestimonialForm | **Client** | Form state + submission |
| TestimonialCard | Server | Display only |
| Sidebar (admin) | **Client** | Mobile open/close state |
| TestimonialTable | **Client** | Filter/sort/expand state |
| AdminLogin form | **Client** | Form state + auth call |
| StatusBadge | Server | Display only |
| ProductTable (admin) | **Client** | Filter/sort state |
| ProductForm (admin) | **Client** | Form state |
| VariantManager (admin) | **Client** | Variant list + reorder state |
| VariantForm (admin) | **Client** | Individual variant form state |
| ImageUploader (admin) | **Client** | File upload + validation state |

---

## Seed Data

For initial launch, products are seeded via SQL. The admin can then manage products through the dashboard. Here's the seed structure:

```sql
-- Insert products
INSERT INTO products (name, tagline, description, base_price, category, collection, sort_order) VALUES
-- Lips: Kysmé Collection
('Velisse', 'Soft romantic nude shades', 'Velvet + kiss. A soft, romantic collection of nude shades...', [PRICE], 'Lips', 'Kysmé', 1),
('Cremora', 'Luminous pinks with fresh glow', 'Crème + aurora. Luminous pinks with a fresh glow...', [PRICE], 'Lips', 'Kysmé', 2),
('Rouva', 'Bold reds that steal the spotlight', 'Rouge + nova. Bold reds designed to steal the spotlight...', [PRICE], 'Lips', 'Kysmé', 3),
('Amoura', 'Passionate plums and wine shades', 'From amour. Passionate plums and wine shades...', [PRICE], 'Lips', 'Kysmé', 4),
('Zyra', 'Deep berries and edgy statement shades', 'Means blossom. Deep berries and edgy statement shades...', [PRICE], 'Lips', 'Kysmé', 5),
-- Lips: Liquid Allure Collection
('Rouge Infinity', 'The Iconic Red', 'For the fearless, the bold, the unforgettable. A classic red...', [PRICE], 'Lips', 'Liquid Allure', 6),
('Velisse Kiss', 'The Everyday Nude Pink', 'Soft, chic, and effortless. Your everyday companion...', [PRICE], 'Lips', 'Liquid Allure', 7),
('Amoura Flame', 'The Passionate Wine Plum', 'Romantic, intense, and powerful. A deep wine shade...', [PRICE], 'Lips', 'Liquid Allure', 8),
('Berry Noir', 'The Deep Berry Plum', 'Dark, sultry, and dramatic. A statement shade for evenings...', [PRICE], 'Lips', 'Liquid Allure', 9),
('Cocoa Veil', 'The Luxe Brown Nude', 'Smooth as chocolate. A sophisticated nude for all skin tones...', [PRICE], 'Lips', 'Liquid Allure', 10),
-- Lips: Tint Amour Collection
('Petal Flush', 'Soft Pink', 'A delicate rosy tint with just-bloomed freshness...', [PRICE], 'Lips', 'Tint Amour', 11),
('Coral Glow', 'Warm Peach Coral', 'Bright, playful, and sun-kissed. A radiant everyday pop...', [PRICE], 'Lips', 'Tint Amour', 12),
('Berry Whisp', 'Berry Mauve', 'Boldness with elegance. A sheer whisper of color...', [PRICE], 'Lips', 'Tint Amour', 13),
('Dewkiss', 'Deep Rose', 'Universally flattering. Instant luminosity...', [PRICE], 'Lips', 'Tint Amour', 14),
-- Eyes
('CelestEye', 'Kajal Pencil', 'Celestial eyes, dreamy vibe...', [PRICE], 'Eyes', 'Kajal', 15),
('MystiQ', 'Mascara', 'Mystique, modern spelling...', [PRICE], 'Eyes', 'Mascara', 16),
('Nayaná', 'Ultimate Waterproof Eyeliner', 'From Sanskrit Nayan. Vision and gaze...', [PRICE], 'Eyes', 'Eyeliner', 17),
-- Face
('Canvas Veil', 'Foundation', 'Smooth, soft finish like a veil...', [PRICE], 'Face', 'Foundation', 18),
('Bare Veil', 'Compact', 'Weightless, natural finish...', [PRICE], 'Face', 'Compact', 19),
('Smoothique', 'Primer', 'Smooth and perfect base...', [PRICE], 'Face', 'Primer', 20),
('Rosaira', 'Blush', 'Rose-inspired blush...', [PRICE], 'Face', 'Blush', 21),
('LumiVeil', 'Highlighter', 'Luminous veil of light...', [PRICE], 'Face', 'Highlighter', 22);

-- Insert variants (example for Rouge Infinity — repeat pattern for all products)
-- [PRICES] and [IMAGE_URLS] to be filled with actual data from admin
INSERT INTO product_variants (product_id, shade_name, shade_color, image_url, price_override, sort_order) VALUES
('[rouge_infinity_id]', 'Classic Red', '#C62828', '[IMAGE_URL]', NULL, 1),
('[rouge_infinity_id]', 'Deep Crimson', '#8B0000', '[IMAGE_URL]', NULL, 2);
```

Replace `[PRICE]`, `[IMAGE_URL]`, and IDs with actual values from admin.

---

## Environment Variables

```env
# .env.local — safe to use NEXT_PUBLIC_ for these two only
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEVER put SUPABASE_SERVICE_ROLE_KEY in NEXT_PUBLIC_ — it gives full DB access to anyone
# If ever needed server-side only:
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  ← server-only, never NEXT_PUBLIC_
```

---

## Setup Checklist

### What you (the admin) need to do — Claude Code cannot do these for you

These steps require manual action in external dashboards:

1. **Supabase project** — create at supabase.com using your email
2. **Run the SQL** — copy the schema SQL from this plan into Supabase → SQL Editor → Run
   - Create tables: `products`, `product_variants`, `testimonials`, `admin_users`
   - Enable RLS on all tables
   - Create all policies (use the corrected versions in this plan — not the old `auth.role()` ones)
3. **Create admin user** — Supabase dashboard → Authentication → Users → Add user
4. **Add UID to admin_users** — after creating the user, copy their UUID and run:
   ```sql
   INSERT INTO admin_users (user_id) VALUES ('paste-the-uuid-here');
   ```
5. **Create storage bucket** — Supabase → Storage → New bucket → name: `product-images` → set to Public
6. **Apply storage policies** — run the storage RLS SQL from this plan
7. **Add real prices** to seed SQL, then run the seed
8. **Upload product images** manually via Supabase Storage dashboard (for Module A)
9. **Vercel deployment** — connect GitHub repo, add env vars in Vercel dashboard
10. **Connect domain** — inoyarouge.com → point to Vercel
11. **UptimeRobot** — create monitor to ping your Supabase URL every 5 min (keeps free tier alive)

### Build order (Claude Code does this)
1. Next.js app scaffold: `npx create-next-app@latest --typescript --tailwind`
2. Install deps: `npm install @supabase/supabase-js @supabase/ssr`
3. `tailwind.config.js` — add brand colors + fonts
4. `next.config.js` — add security headers
5. `globals.css` — font import + antialiasing + safe-area insets
6. Supabase clients (`lib/supabase/client.ts`, `server.ts`)
7. TypeScript types (`lib/types.ts`)
8. Middleware (`middleware.ts`) — using `getUser()` pattern
9. Admin layout + sidebar (Products link always visible)
10. Admin login page
11. Admin testimonials moderation page
12. Admin products list page (ProductTable)
13. Admin product edit page (ProductForm + VariantManager)
14. VariantForm component (add/edit individual variants)
15. ImageUploader component (MIME/size validation, Supabase Storage upload)
16. Admin product Server Actions (products/actions.ts)
17. Public layout + navbar + footer
18. Homepage (ISR)
19. Shop page with filters (ISR)
20. Product detail page with shade selector (SSR)
21. Our Story page (SSG)
22. Community page — stories grid + Server Action form (SSR)
23. Contact page (SSG)
24. Policies page (SSG)
25. Deploy to Vercel
