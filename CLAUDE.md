# CLAUDE.md — Inoya Rouge Project

## MANDATORY: Read This Before Writing Any Code

**Before touching a single line of code, always:**
1. Read `UPDATES.md` to understand what has already been built, what is in progress, and what is pending
2. Read the relevant section of `plan.md` for the feature you are about to work on
3. Log your planned changes in `UPDATES.md` before starting

This is not optional. Skipping this will cause duplicate work, broken logic, or conflicts with already-completed features.

---

## Project Overview

**Client:** Inoya Rouge — Indian luxury cosmetics brand
**Site:** inoyarouge.com
**Stack:** Next.js 14+ (App Router) + Supabase + Tailwind CSS
**Deployment:** Vercel + Supabase free tier

Two sides:
- **Public site** — product catalog, brand story, testimonials, contact, policies
- **Admin dashboard** — product management (CRUD with variants and image upload) + testimonial moderation

Full specification lives in `plan.md`. Always refer to it for data schemas, page specs, RLS policies, and build order.

---

## Admin Dashboard Scope

The admin dashboard includes:
- **Product management** — full CRUD for products, variants/shades, and image uploads
- **Testimonial moderation** — approve/reject user-submitted stories

Both are part of the core build. Products are seeded via SQL for initial launch; admin can then manage them through the dashboard.

---

## Security Rules (Non-Negotiable)

1. **RLS admin policies must use `admin_users` table** — never `auth.role() = 'authenticated'`
   ```sql
   -- CORRECT
   USING (auth.uid() IN (SELECT user_id FROM admin_users))
   -- WRONG — do not use this
   USING (auth.role() = 'authenticated')
   ```

2. **Middleware must use `getUser()` not `getSession()`**
   ```typescript
   // CORRECT
   const { data: { user } } = await supabase.auth.getUser()
   // WRONG
   const { data: { session } } = await supabase.auth.getSession()
   ```

3. **Never use `NEXT_PUBLIC_` prefix on `SUPABASE_SERVICE_ROLE_KEY`** — it would expose full DB access publicly

4. **Testimonial content is always plain text** — never use `dangerouslySetInnerHTML` for user-submitted content

5. **Admin login errors are always generic** — "Invalid credentials" — never reveal whether email exists

6. **Security headers must be set in `next.config.js`** — see `plan.md` for the full header block

7. **Testimonial form uses Next.js Server Actions** — not plain API routes — for built-in CSRF protection

---

## Performance Rules (Non-Negotiable)

1. **Hero image must have `priority` prop** — it is the LCP element
2. **All product images must have an explicit aspect-ratio wrapper** to prevent CLS:
   ```tsx
   <div className="relative aspect-[3/4] overflow-hidden">
     <Image fill className="object-cover" ... />
   </div>
   ```
3. **Shade selector uses opacity-swap, NOT src-swap** — all variant images are pre-rendered; only opacity toggles
4. **Every `<Image>` must have a `sizes` attribute** — no exceptions
5. **Admin routes: `<Link prefetch={false}>`** — never prefetch admin pages from public pages

### Rendering strategy per page (set `export const revalidate = X` at top of file):

| Page | Strategy | Value |
|------|----------|-------|
| `/` | ISR | `3600` |
| `/shop` | ISR | `1800` |
| `/shop/[id]` | SSR | `0` |
| `/our-story` | SSG | `false` |
| `/community` | SSR | `0` |
| `/contact` | SSG | `false` |
| `/policies` | SSG | `false` |
| `/admin/*` | SSR | `0` |

---

## Cross-Browser / Device Rules

1. **Mobile-first Tailwind breakpoints** — base styles are mobile, scale up: `sm:` `md:` `lg:` `xl:`
2. **Product grid base is `grid-cols-1`** — never `grid-cols-2` as the base (too cramped on small phones)
   ```tsx
   className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
   ```
3. **Touch targets minimum sizes:**
   - Buttons, tabs, filters: `min-h-[44px]`
   - Shade swatches: `w-12 h-12` on mobile, `w-10 h-10` on desktop
4. **Shade swatches use `ring` for selection, not `border`** — border changes element size and causes CLS
5. **Swatch rows use horizontal scroll on mobile:**
   ```tsx
   className="flex overflow-x-auto gap-3 pb-2 overscroll-x-contain"
   ```
6. **Viewport meta in root layout:**
   ```tsx
   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
   ```
7. **Product detail layout by breakpoint:**
   - Mobile: `flex-col` (image top, details below)
   - Tablet: `md:grid md:grid-cols-2`
   - Desktop: `lg:grid-cols-[60%_40%]`

---

## Component Rules

### Server vs Client — always get this right

| Component | Type | Rule |
|-----------|------|------|
| Navbar, Footer | Server | No `'use client'` |
| ProductCard, ProductGrid | Server | No `'use client'` |
| ShadeSelector | **Client** | `'use client'` — manages selected variant state |
| CategoryFilter | **Client** | `'use client'` — manages active category state |
| TestimonialForm | **Client** | `'use client'` — form state + Server Action |
| TestimonialCard | Server | No `'use client'` |
| Sidebar (admin) | **Client** | `'use client'` — mobile open/close state |
| TestimonialTable | **Client** | `'use client'` — filter/sort/expand state |
| AdminLogin form | **Client** | `'use client'` — form state |
| StatusBadge | Server | No `'use client'` |
| ProductTable (admin) | **Client** | `'use client'` — filter/sort state |
| ProductForm (admin) | **Client** | `'use client'` — form state |
| VariantManager (admin) | **Client** | `'use client'` — variant list + reorder state |
| VariantForm (admin) | **Client** | `'use client'` — individual variant form state |
| ImageUploader (admin) | **Client** | `'use client'` — file upload + validation state |

### Suspense boundaries — use these
```tsx
// Homepage
<Suspense fallback={<SkeletonGrid />}><FeaturedProducts /></Suspense>
<Suspense fallback={<SkeletonCards />}><CustomerStories /></Suspense>

// Shop page
<Suspense fallback={<SkeletonGrid cols={3} />}><ProductGrid /></Suspense>

// Product detail
<Suspense fallback={<SkeletonGrid cols={4} />}><RelatedProducts /></Suspense>
```

---

## Tailwind Brand Config

Brand colors live in `tailwind.config.js` — not CSS variables:
```javascript
colors: {
  'brand-rose': '#C7365F',
  // warm orange and leaf green to be added when extracted from logo
}
```

Font families:
```javascript
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],   // headings
  sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // body
}
```

---

## File Structure

Full structure is in `plan.md`. Key points:
- All source code lives under `src/`
- Public components: `src/components/public/`
- Admin components: `src/components/admin/`
- Admin product pages: `src/app/admin/products/page.tsx` and `src/app/admin/products/[id]/page.tsx`
- Admin product actions: `src/app/admin/products/actions.ts`
- Supabase clients: `src/lib/supabase/client.ts` and `server.ts`
- Types: `src/lib/types.ts`
- Middleware: `src/middleware.ts`

---

## What Claude Code Does NOT Do

These require manual action by the project owner — Claude Code cannot access external dashboards:
- Creating the Supabase project
- Running SQL in Supabase dashboard
- Creating the admin user in Supabase Auth
- Inserting the admin UID into `admin_users`
- Creating the storage bucket
- Setting up Vercel deployment
- Connecting the domain
- Setting up UptimeRobot

See the "Setup Checklist → What you need to do" section in `plan.md` for the full list.

---

## Worktrees (Parallel Agent Execution)

When instructed to build multiple independent features simultaneously, Claude Code will use git worktrees to isolate each agent on its own branch. This prevents conflicts when parallel work is in progress.

Example parallel execution:
- Worktree 1: `feature/public-pages` — building homepage, shop, product detail
- Worktree 2: `feature/admin` — building admin login, testimonials moderation
- Worktree 3: `feature/layout` — building navbar, footer, layout components

Each worktree is merged back to main after completion and verification.

**To trigger parallel execution:** Say "build X and Y in parallel" — Claude Code will automatically use worktrees.

---

## Build Phase Plan (summary — full detail in UPDATES.md)

| Phase | Name | Status |
|-------|------|--------|
| 1 | Foundation — scaffold, config, Supabase clients, middleware | PLANNED |
| 2 | Admin — login, testimonial moderation, product management, sidebar | PLANNED |
| 3 | Public layout + Homepage | PLANNED |
| 4 | Shop — product listing + product detail with shade selector | PLANNED |
| 5 | Remaining public pages — our-story, community, contact, policies | PLANNED |
| 6 | Deploy & harden — Vercel, domain, smoke test, UptimeRobot | PLANNED |

Build phases sequentially. Do not start Phase N+1 until Phase N is marked DONE in UPDATES.md.
Phase 2 is blocked until admin sets up Supabase (see UPDATES.md blocked items).

---

## Updates Protocol

Every time a change is made to this project:
1. Open `UPDATES.md`
2. Add a new entry at the TOP of the changelog (newest first)
3. Include: date, what was built/changed, what files were touched, what is next
4. Then — and only then — write the code

This creates a living project history that survives context resets and new conversations.
