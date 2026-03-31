# UPDATES.md — Inoya Rouge Project Changelog

> **Claude Code: Read this file before writing any code.**
> Add a new entry at the TOP of this file (newest first) before starting any work.
> Format: date, summary, files touched, status, what's next.

---

## How to Read This File

- **Status: DONE** — fully built and verified
- **Status: IN PROGRESS** — currently being worked on
- **Status: PLANNED** — queued, not started
- **Status: BLOCKED** — waiting on external action (admin, credentials, images, etc.)

---

## Build Phase Plan

The project is split into 6 sequential phases. Complete each phase fully before starting the next. Phase 1 can start immediately. Phase 2 requires Supabase to be set up by the project owner first.

| Phase | Name | Blocked on admin? | Status |
|-------|------|-------------------|--------|
| 1 | Foundation — scaffold, config, Supabase clients, middleware | No | DONE |
| 2 | Admin — login, testimonial moderation, product management, sidebar | Yes — Supabase must be set up | DONE |
| 3 | Public layout + Homepage — navbar, footer, hero, featured products | No | DONE |
| 4 | Shop — product listing with filters, product detail with shade selector | No | DONE |
| 5 | Remaining public pages — our-story, community, contact, policies | No | DONE |
| 6 | Deploy & harden — Vercel, domain, smoke test, UptimeRobot | Yes — Vercel + domain setup | PLANNED |

### Phase 1 — Foundation
Files to create:
- `next.config.js` — security headers
- `tailwind.config.js` — brand colors + fonts
- `src/styles/globals.css` — font import, antialiasing, safe-area insets
- `src/lib/supabase/client.ts` — browser Supabase client
- `src/lib/supabase/server.ts` — server Supabase client
- `src/lib/types.ts` — TypeScript types
- `src/middleware.ts` — auth guard using getUser()
- `.env.local` — env var placeholders (no real values committed)

End state: App boots. Supabase connected. Auth middleware active. No pages yet.

### Phase 2 — Admin (Testimonials + Products)
Requires: Supabase project created + schema SQL run + admin user created + UID in admin_users table.
Files to create:
- `src/app/layout.tsx` — root layout
- `src/app/admin/layout.tsx` — admin shell
- `src/components/admin/Sidebar.tsx` — with pending count badge, Products link always visible
- `src/components/admin/StatusBadge.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/testimonials/page.tsx`
- `src/components/admin/TestimonialTable.tsx`
- `src/app/admin/testimonials/actions.ts` — Server Actions: approve, reject, fetch
- `src/app/admin/products/page.tsx` — product list with table
- `src/app/admin/products/[id]/page.tsx` — edit individual product
- `src/app/admin/products/actions.ts` — Server Actions: product/variant CRUD + image upload
- `src/components/admin/ProductTable.tsx` — filterable product list
- `src/components/admin/ProductForm.tsx` — add/edit product fields
- `src/components/admin/VariantManager.tsx` — manage variants within product
- `src/components/admin/VariantForm.tsx` — add/edit individual variant
- `src/components/admin/ImageUploader.tsx` — image upload with MIME/size validation

End state: Admin can log in, moderate testimonials, and manage all products/variants/images.

### Phase 3 — Public Layout + Homepage
Files to create:
- `src/components/public/Navbar.tsx`
- `src/components/public/Footer.tsx`
- `src/components/public/TrustBadges.tsx`
- `src/components/public/ProductCard.tsx`
- `src/components/public/TestimonialCard.tsx`
- `src/app/page.tsx` — Homepage (ISR 1h): hero, trust badges, featured products, brand story teaser, category cards, testimonials section, Instagram placeholder

End state: Site has a face. Homepage pulls real products and testimonials from DB.

### Phase 4 — Shop
Files to create:
- `src/app/shop/page.tsx` — product listing (ISR 30min) with category + collection filters
- `src/components/public/CategoryFilter.tsx` — client component
- `src/app/shop/[id]/page.tsx` — product detail (SSR)
- `src/components/public/ShadeSelector.tsx` — client component, opacity-swap pattern

End state: Full product browsing. Shade selector works on all devices.

### Phase 5 — Remaining Public Pages
Files to create:
- `src/app/our-story/page.tsx` — SSG
- `src/app/community/page.tsx` — SSR
- `src/components/public/TestimonialForm.tsx` — client component
- `src/app/community/actions.ts` — Server Action with rate limiting
- `src/app/contact/page.tsx` — SSG
- `src/app/policies/page.tsx` — SSG with tab switching

End state: Every public page exists. Module A is feature-complete.

### Phase 6 — Deploy & Harden
Steps (mostly admin actions):
- Push to GitHub
- Connect repo to Vercel
- Add env vars in Vercel dashboard
- Trigger deploy
- Connect inoyarouge.com domain
- Smoke test all pages + admin flow
- Verify security headers are live (securityheaders.com)
- Set up UptimeRobot to ping Supabase every 5 min

End state: Live site at inoyarouge.com. Project complete for Module A.

---

## Changelog

---

### [2026-03-31] — Phase 5: Remaining Public Pages Complete

**Type:** Build
**Status:** DONE

**What was done:**

All remaining public pages built — Module A is now feature-complete:
- Contact page (`/contact`, SSG): 3 contact cards (phone, email, Instagram placeholder) in responsive grid, CTA to shop
- Our Story page (`/our-story`, SSG): 9 sections — hero, brand story, origin, name meaning, clean beauty pillars, ingredients, differentiators, team, vision with CTA to shop
- Policies page (`/policies`, SSG with client tabs): single page with 4 tabs (Privacy, Terms, Shipping, Returns), `searchParams.tab` for deep-linking from Footer, PolicyTabs client component with `useState` switching, all static placeholder content
- Community page (`/community`, SSR): fetches approved testimonials from Supabase (newest first), stories grid with quote cards, empty state, TestimonialForm client component below
- TestimonialForm: client-side validation (name 100, title 150, story 2000 chars), character counter on textarea, calls Server Action, success/error states
- Community Server Action (`community/actions.ts`): rate limiting via in-memory Map (max 3 per IP per hour), server-side validation + trim + slice, inserts with `status: 'pending'`
- Footer updated: policy links changed from `/policies/privacy` to `/policies?tab=privacy` etc.

**Files created:**
- `src/app/(public)/contact/page.tsx` — contact page
- `src/app/(public)/our-story/page.tsx` — brand story page
- `src/components/public/PolicyTabs.tsx` — client component for tab switching
- `src/app/(public)/policies/page.tsx` — policies page shell
- `src/app/(public)/community/actions.ts` — server action with rate limiting
- `src/components/public/TestimonialForm.tsx` — client component
- `src/app/(public)/community/page.tsx` — community page

**Files modified:**
- `src/components/public/Footer.tsx` — updated policy links to use query params

**Build:** Passes cleanly (`npm run build` — no errors, all routes present)

**What's next:** Phase 6 — Deploy & harden (Vercel, domain, smoke test, UptimeRobot)

---

### [2026-03-31] — Phase 4: Shop Pages Complete

**Type:** Build
**Status:** DONE

**What was done:**

Shop listing and product detail pages with full shade selector:
- Shop page (`/shop`, ISR 1800s): fetches all active products with variants from Supabase, async `ProductGrid` child for Suspense streaming, skeleton fallback
- CategoryFilter (client component): category tabs (All/Lips/Eyes/Face), Lips sub-filters (Kysmé/Liquid Allure/Tint Amour), category taglines, `useMemo` filtering, reads `?category=` search param from homepage links
- Product detail page (`/shop/[id]`, SSR): dynamic metadata via `generateMetadata`, fetches product + all active variants, normalizes `product_variants` → `variants`
- ShadeSelector (client component): opacity-swap pattern — all variant images stacked absolutely with `transition-opacity duration-300`, swatch row with `ring-2 ring-offset-2 ring-brand-rose` selection (not border), mobile w-12 h-12 / desktop w-10 h-10 swatches, horizontal scroll with overscroll-contain, price updates from `price_override ?? base_price`
- Related products section: same-category products (exclude current), limit 4, wrapped in Suspense
- Responsive layout: product grid `grid-cols-1 sm:2 md:3 lg:4`, detail page `flex-col md:grid-cols-2 lg:grid-cols-[60%_40%]`
- Reuses existing ProductCard component (no changes needed)

**Files created:**
- `src/components/public/ShadeSelector.tsx` — client component
- `src/components/public/CategoryFilter.tsx` — client component
- `src/app/(public)/shop/page.tsx` — shop listing
- `src/app/(public)/shop/[id]/page.tsx` — product detail

**What's next:** Phase 5 — Remaining public pages (our-story, community, contact, policies)

---

### [2026-03-31] — Phase 3: Styling Pass

**Type:** Enhancement
**Status:** DONE

**What was done:**
- Navbar: backdrop blur, shadow, larger brand name, uppercase tracking on nav links
- MobileMenuToggle: wider panel (w-72), shadow, brand name header inside drawer
- Footer: dark bg (gray-900), white headings, proper color contrast
- TrustBadges: uppercase tracking-widest, dot separators
- ProductCard: rounded image corners, subtle hover zoom on image
- Homepage hero: gradient overlay, larger text, rounded CTA button
- Category cards: dark bg with taglines
- Testimonials: white card with border, quote mark, better spacing
- All sections: more vertical padding (py-16), centered headings with subtitles
- tailwind.config.js renamed to tailwind.config.ts (fix for ESM/TypeScript compatibility)
- Cleared stale .next cache

**Files touched:**
- `src/components/public/Navbar.tsx`
- `src/components/public/MobileMenuToggle.tsx`
- `src/components/public/Footer.tsx`
- `src/components/public/TrustBadges.tsx`
- `src/components/public/ProductCard.tsx`
- `src/app/(public)/page.tsx`
- `tailwind.config.js` → `tailwind.config.ts`

**What's next:** Phase 4 — Shop page + Product detail with shade selector

---

### [2026-03-31] — Phase 3: Public Layout + Homepage Complete

**Type:** Build
**Status:** DONE

**What was done:**

Public layout and homepage with real Supabase data fetching:
- Created `(public)` route group to wrap public pages with Navbar/Footer (keeps admin pages unaffected)
- Navbar: server component, sticky header, desktop nav links, mobile hamburger via MobileMenuToggle client component
- Footer: server component, 3-column grid (brand info, quick links, policies)
- TrustBadges: server component, 5 text badges (Cruelty-Free, Skin-Friendly, etc.)
- ProductCard: server component, reusable card with aspect-[3/4] image wrapper, price, shade count
- Homepage (ISR 3600s) with 7 sections: hero (CSS-only), trust badges, featured products (Suspense), brand story teaser, shop by category, customer stories (Suspense), Instagram placeholder
- Featured products fetches 1 product per category (Lips/Eyes/Face) from Supabase
- Customer stories fetches 3 newest approved testimonials from Supabase
- Both data sections wrapped in Suspense with skeleton fallbacks

**Files created:**
- `src/components/public/MobileMenuToggle.tsx` — client component, hamburger state
- `src/components/public/Navbar.tsx` — server component
- `src/components/public/Footer.tsx` — server component
- `src/components/public/TrustBadges.tsx` — server component
- `src/components/public/ProductCard.tsx` — server component
- `src/app/(public)/layout.tsx` — route group layout
- `src/app/(public)/page.tsx` — homepage with all 7 sections

**Files deleted:**
- `src/app/page.tsx` — replaced by `src/app/(public)/page.tsx`

**Build:** Passes cleanly (`npm run build` — no errors)

**What's next:** Phase 4 — Shop page (product listing with filters) + Product detail page with shade selector

---

### [2026-03-30] — Phase 2: Admin Dashboard Complete

**Type:** Build
**Status:** DONE

**What was done:**

Supabase setup (via MCP):
- Created `admin_users`, `products`, `product_variants`, `testimonials` tables with RLS policies
- All admin RLS policies use `admin_users` table (not `auth.role()`)
- Public read policies on products/variants; public read-approved + insert on testimonials
- Created `product-images` storage bucket (public read, admin write/delete)
- Created admin user (inoyarouge@gmail.com) and inserted UID into `admin_users`

Admin code (15 files):
- Admin layout with sidebar showing pending testimonial count badge
- Sidebar with mobile hamburger menu, nav links (prefetch=false), logout
- StatusBadge server component (pending/approved/rejected pills)
- Login page: `signInWithPassword()`, generic "Invalid credentials" error
- Testimonials page: SSR, loads all testimonials, passes to filterable table
- TestimonialTable: client-side filters (All/Pending/Approved/Rejected), search, expandable rows (plain text only), Approve/Reject buttons, 50 rows per load
- Testimonial Server Actions: approve/reject with admin UID verification + revalidatePath
- Products page: SSR, loads products with variant count
- ProductTable: edit/delete/toggle-active per row, delete confirmation
- Product edit page: handles `[id]` = "new" or UUID, renders form + variant manager
- ProductForm: name, tagline, description, base_price, category/collection (dynamic dropdown), is_active, sort_order
- VariantManager: list variants with swatch/thumbnail/status, edit inline, delete with confirmation
- VariantForm: shade_name, color picker, description, image upload, price_override, is_active, sort_order
- ImageUploader: client-side MIME (jpeg/png/webp) + 5MB validation, uploads to Supabase Storage
- Product Server Actions: full CRUD for products + variants, image upload/delete, all verify admin UID

**Files created:**
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/testimonials/page.tsx`
- `src/app/admin/testimonials/actions.ts`
- `src/app/admin/products/page.tsx`
- `src/app/admin/products/[id]/page.tsx`
- `src/app/admin/products/actions.ts`
- `src/components/admin/Sidebar.tsx`
- `src/components/admin/StatusBadge.tsx`
- `src/components/admin/TestimonialTable.tsx`
- `src/components/admin/ProductTable.tsx`
- `src/components/admin/ProductForm.tsx`
- `src/components/admin/VariantManager.tsx`
- `src/components/admin/VariantForm.tsx`
- `src/components/admin/ImageUploader.tsx`

**Verification:**
- `npm run build` passes with zero errors
- All admin routes server-rendered on demand (dynamic)
- Middleware compiled (83.9 kB)

**What's next:**
- Phase 3: Public layout + Homepage (navbar, footer, hero, featured products, testimonials)

---

### [2026-03-30] — Phase 1: Foundation Complete

**Type:** Build
**Status:** DONE

**What was done:**
- Created browser Supabase client (`createBrowserClient` from `@supabase/ssr`)
- Created server Supabase client (`createServerClient` with cookie handling)
- Created TypeScript types: `Product`, `ProductVariant`, `Testimonial`
- Created auth middleware: protects `/admin/*` routes using `getUser()` (not `getSession()`), redirects unauthenticated users to `/admin/login`
- Created `.env.local` with placeholder Supabase credentials
- Created root layout with viewport meta (`viewport-fit=cover`), font-sans body, metadata
- Created placeholder homepage with ISR (revalidate=3600)
- Cleaned up `globals.css`: removed dark mode variables and gradient background, kept Tailwind directives, font import, antialiasing, safe-area insets

**Files created:**
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/types.ts`
- `src/middleware.ts`
- `.env.local`
- `src/app/layout.tsx`
- `src/app/page.tsx`

**Files modified:**
- `src/styles/globals.css`

**Verification:**
- `npm run build` passes with zero errors
- Middleware compiled (83.9 kB)
- Homepage statically generated

**What's next:**
- Phase 2 (Admin) — blocked until admin sets up Supabase project, runs schema SQL, creates admin user, inserts UID into `admin_users`

---

### [2026-03-30] — Blueprint v5: Product Management Activated as Core

**Type:** Planning / Documentation
**Status:** DONE

**What was done:**
- Updated plan.md from v4 to v5
- Removed Module A/B gating — product management is now part of core build
- Added `/admin/products/[id]` route for editing individual products
- Added `VariantForm.tsx` and `ImageUploader.tsx` components to the spec
- Added `products/actions.ts` — Server Actions for product/variant CRUD
- Moved product CRUD into Phase 2 (Admin) build order
- Updated admin sidebar to always show Products link
- Updated CLAUDE.md to remove Module B activation gate
- Updated UPDATES.md to merge Module B items into active build queue
- **Preserved all v4 security hardening:** admin_users RLS, getUser() middleware, storage policies
- **Schema unchanged:** kept tagline on products, description on product_variants, single image_url per variant

**Design decisions:**
- Single `image_url` kept (simpler; multi-image can be added later as non-breaking change)
- `tagline` kept on products (used in product detail page display)
- `description` kept on product_variants (shade-specific descriptions are valuable)
- Product CRUD placed in Phase 2 alongside other admin features

**Files touched:**
- `plan.md` (v4 → v5)
- `CLAUDE.md` (updated)
- `UPDATES.md` (updated)

**What's next:**
- Begin Phase 1 (Foundation) build

---

### [2026-03-25] — Project Planning & Architecture

**Type:** Planning / Documentation
**Status:** DONE

**What was done:**
- Created initial implementation blueprint (`plan.md` v1–v3)
- Ran security audit against the plan
- Ran cross-browser and performance optimization audit
- Updated `plan.md` to v4 incorporating all audit findings:
  - Fixed RLS policies (replaced `auth.role()` with `admin_users` table check)
  - Fixed middleware to use `getUser()` instead of `getSession()`
  - Added `admin_users` table to schema
  - Added security headers spec (`next.config.js`)
  - Added per-page rendering strategy (ISR/SSG/SSR)
  - Added shade selector opacity-swap pattern (not src-swap)
  - Added image optimization rules (aspect ratios, priority, sizes)
  - Added cross-browser rules (touch targets, grid breakpoints, swatch sizing)
  - Added Server vs Client component map
  - Added Server Actions pattern for testimonial form (CSRF protection)
  - Added pagination to admin testimonial table
  - Added storage RLS policies
- Created `CLAUDE.md` — project rules and context for Claude Code
- Created `UPDATES.md` — this file

**Files touched:**
- `plan.md` (v3 → v4)
- `CLAUDE.md` (created)
- `UPDATES.md` (created)

**What's next (requires admin action first):**
- Admin must create Supabase project and run schema SQL
- Admin must create admin user and insert UID into `admin_users`
- Admin must create `product-images` storage bucket
- Admin must fill in real prices and image URLs in seed data
- Once Supabase is ready → begin Module A build

---

## Pending: Build Queue

These items are PLANNED but not started. They will be checked off and moved to the changelog as they are completed.

### Infrastructure
- [x] Scaffold Next.js project (`npx create-next-app@latest --typescript --tailwind`)
- [x] Install Supabase packages (`@supabase/supabase-js @supabase/ssr`)
- [x] Configure `tailwind.config.js` — brand colors + fonts
- [x] Configure `next.config.js` — security headers
- [x] Configure `globals.css` — font import + antialiasing + safe-area insets
- [x] Create `.env.local` with Supabase credentials

### Core Library
- [x] `src/lib/supabase/client.ts` — browser Supabase client
- [x] `src/lib/supabase/server.ts` — server Supabase client
- [x] `src/lib/types.ts` — TypeScript types (Product, ProductVariant, Testimonial)
- [x] `src/middleware.ts` — auth middleware using `getUser()`

### Admin
- [x] `src/app/admin/layout.tsx` — admin layout with sidebar
- [x] `src/components/admin/Sidebar.tsx` — sidebar with pending count badge + Products link
- [x] `src/app/admin/login/page.tsx` — login form
- [x] `src/app/admin/testimonials/page.tsx` — moderation queue
- [x] `src/components/admin/TestimonialTable.tsx` — filterable table
- [x] `src/components/admin/StatusBadge.tsx` — status indicator
- [x] `src/app/admin/testimonials/actions.ts` — Server Actions for approve/reject
- [x] `src/app/admin/products/page.tsx` — product list
- [x] `src/app/admin/products/[id]/page.tsx` — edit product
- [x] `src/app/admin/products/actions.ts` — Server Actions for product/variant CRUD
- [x] `src/components/admin/ProductTable.tsx` — filterable product table
- [x] `src/components/admin/ProductForm.tsx` — add/edit product form
- [x] `src/components/admin/VariantManager.tsx` — variant list + reorder
- [x] `src/components/admin/VariantForm.tsx` — add/edit individual variant
- [x] `src/components/admin/ImageUploader.tsx` — image upload with validation

### Public Layout
- [x] `src/app/layout.tsx` — root layout with viewport meta
- [ ] `src/components/public/Navbar.tsx`
- [ ] `src/components/public/Footer.tsx`
- [ ] `src/components/public/TrustBadges.tsx`

### Public Pages
- [ ] `src/app/page.tsx` — Homepage (ISR 1h)
- [ ] `src/components/public/ProductCard.tsx`
- [ ] `src/components/public/TestimonialCard.tsx`
- [x] `src/app/shop/page.tsx` — Product listing (ISR 30min)
- [x] `src/components/public/CategoryFilter.tsx` — client component
- [x] `src/app/shop/[id]/page.tsx` — Product detail (SSR)
- [x] `src/components/public/ShadeSelector.tsx` — client component
- [x] `src/app/our-story/page.tsx` — Brand story (SSG)
- [x] `src/app/community/page.tsx` — Testimonials + form (SSR)
- [x] `src/components/public/TestimonialForm.tsx` — client component
- [x] `src/app/community/actions.ts` — Server Action for submission
- [x] `src/app/contact/page.tsx` — Contact page (SSG)
- [x] `src/app/policies/page.tsx` — Policies tabs (SSG)

### Deployment
- [ ] Deploy to Vercel
- [ ] Connect domain (inoyarouge.com)
- [ ] Set up UptimeRobot ping

---

## Blocked Items (Waiting on Admin)

| Item | Blocked by | Required before |
|------|-----------|----------------|
| DB schema creation | Admin must run SQL in Supabase | Any DB-connected code can be tested |
| Admin user creation | Admin must create user in Supabase Auth | Admin login can be tested |
| `admin_users` seed | Admin must insert UID after user creation | Admin auth flow works |
| Product images | Admin must upload via Supabase Storage | Product pages show real images |
| Real prices | Admin must provide pricing | Seed SQL can be finalized |
| Domain connection | Admin must configure DNS | Live site accessible |
