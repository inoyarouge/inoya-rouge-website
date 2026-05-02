## 2026-05-02 — Fix: Vercel build failed prerendering `/_not-found` (useSearchParams Suspense bailout)

**Status:** DONE

Vercel deploy at 17:21:05 failed with `useSearchParams() should be wrapped in a suspense boundary at page "/404"` → `Error occurred prerendering page "/_not-found"` → exit code 1. Phase 6 (deploy) was blocked.

Root cause: [src/components/providers/SmoothScrollProvider.tsx:14](src/components/providers/SmoothScrollProvider.tsx#L14) calls `useSearchParams()` and is rendered by the **root** layout at [src/app/layout.tsx:52](src/app/layout.tsx#L52) without a Suspense boundary. The route-group layouts at [src/app/(public)/layout.tsx](src/app/(public)/layout.tsx) and `src/app/admin/layout.tsx` already wrap their `useSearchParams` consumer (`NavigationProgress`) — but `/_not-found` is rendered directly under the root layout (it doesn't sit inside any route group), so the unwrapped provider above it forced a CSR bailout and broke static prerendering for that one page.

Fix: wrapped `<SmoothScrollProvider>{children}</SmoothScrollProvider>` in `<Suspense fallback={children}>` in the root layout, and added `import { Suspense } from 'react'`. Same pattern the route-group layouts use for `NavigationProgress`. Fallback is `children` (not `null`) so page content still renders during the brief client-only suspension on initial hydration — the provider only adds Lenis smooth scroll, it does not gate rendering.

**Files touched:**
- [src/app/layout.tsx](src/app/layout.tsx) — added `Suspense` import; wrapped the `<SmoothScrollProvider>` invocation in `<Suspense fallback={children}>`

Not changed: `SmoothScrollProvider` itself (the `useSearchParams` dependency in the `lenis.scrollTo(0)` effect at [SmoothScrollProvider.tsx:33-37](src/components/providers/SmoothScrollProvider.tsx#L33-L37) is preserved — it re-triggers scroll-to-top when query params change, e.g. `?shade=rose`). `NavigationProgress` was already correctly wrapped at every layout level and inside [not-found.tsx:33-35](src/app/not-found.tsx#L33-L35).

**Verification:** `npm run build` ran locally and completed `Generating static pages (15/15)` with `/_not-found` listed as `○ (Static)` (171 B, 106 kB First Load JS) — was previously failing prerender. Phase 6 deploy unblocked; pushing this commit should let the Vercel build succeed.

---

## 2026-05-02 — Remove unused variant `description` field

**Status:** DONE

The `description` field on `product_variants` (per-shade short copy) was wired into the schema, the `ProductVariant` type, and the admin `VariantForm` textarea, but never rendered anywhere on the public site — not in `ShadeSelector`, not in `BuyNowModal`, not in `ProductCard`, not on the product detail page. It was a write-only field with zero customer-facing presence.

This reverses the prior keep-decision noted at [UPDATES.md:890](UPDATES.md#L890) ("shade-specific descriptions are valuable"). Decision now: shade-level copy isn't worth the admin effort, so the field is dropped from the codebase entirely instead of building the missing display.

**Files touched:**
- [src/lib/types.ts](src/lib/types.ts) — removed `description: string | null` from `ProductVariant`
- [src/components/admin/VariantForm.tsx](src/components/admin/VariantForm.tsx) — dropped the `description` state, the `formData.set('description', ...)` line, and the entire `<label>`/`<textarea>` block from the form UI
- [src/app/admin/(protected)/products/actions.ts](src/app/admin/(protected)/products/actions.ts) — removed the `description: ...` keys from both the `createVariant` INSERT and the `updateVariant` UPDATE objects
- [plan.md](plan.md) — removed the `description` row from the `product_variants` table documentation

Not changed: the public components (`ShadeSelector`, `BuyNowModal`, `ProductCard`, etc.) never referenced the field. All `select('*')` callers on `product_variants` ([shop](src/app/(public)/shop/page.tsx), [shop/[slug]](src/app/(public)/shop/[slug]/page.tsx), [shop/lips|eyes|face](src/app/(public)/shop/lips/page.tsx), [home](src/app/(public)/page.tsx), [admin product edit](src/app/admin/(protected)/products/[id]/page.tsx)) keep working — wildcard select just returns an extra column nothing reads. Historical UPDATES.md entries that mention variant description ([line 801](UPDATES.md#L801), [line 890](UPDATES.md#L890)) are preserved as written.

**Database column:** the `description` column still exists in Supabase. To drop it permanently, run this in the Supabase dashboard SQL editor:

```sql
ALTER TABLE product_variants DROP COLUMN description;
```

Safe to defer — leaving the column in place causes no functional or performance issue now that nothing reads or writes it.

**Verification:** `npm run build` (type-check + production build) must pass — the type removal will surface any missed reader. Smoke test admin: `/admin/products` → open a product → open a variant → confirm the Description textarea is gone and saving still works. Smoke test public: any `/shop/[slug]` page → shade selector and Buy Now modal render identically to before.

---

## 2026-05-02 — Fix: shade swatch click on Shop card triggered product-page navigation ("infinite loading")

**Status:** DONE

User reported that clicking any of the 4 shade swatches under a product card on `/shop` would route the page into `/shop/[slug]` and get stuck on the product-detail loading skeleton.

Root cause was a structural bug in [src/components/public/ProductCard.tsx](src/components/public/ProductCard.tsx) shop variant: the swatch `<div>`s were rendered **inside** the wrapping `<Link href="/shop/${slug}">`. Clicks bubbled up to the `<a>`, and Next.js App-Router `<Link>`'s own onClick → `router.push` fired. The existing `e.preventDefault()` on the swatch handler was unreliable in that nested-interactive layout. The "infinite loading" was just `src/app/(public)/shop/[slug]/loading.tsx` shown while the SSR (`dynamic = 'force-dynamic'`) detail page fetched.

Fix: closed the wrapping `<Link>` after the price block, and moved the swatches block out as a sibling of the `<Link>` (still inside the outer card flex column, with `mt-auto` preserved on the swatches wrapper so the `CHOOSE SHADE` button stays pinned to the bottom). Converted each swatch from `<div>` to `<button type="button">` with `aria-label`, `aria-pressed`, focus-visible ring, and `e.stopPropagation()` on click (kept onMouseEnter to retain the existing hover-preview behavior). Image, name, price, and the explicit CHOOSE SHADE button still navigate to the detail page.

**Files touched:**
- [src/components/public/ProductCard.tsx](src/components/public/ProductCard.tsx) — restructured the `variant === 'shop'` branch so swatches sit between the (now image+name+price-only) `<Link>` and the `CHOOSE SHADE` `<Link>`. Replaced the `<div>` swatches with `<button>`s. Removed `e.preventDefault()` (no longer in an anchor); kept `stopPropagation`.

Not changed: `default` and `curated` variants of `ProductCard` (no swatches), `ShadeSelector` on the detail page, the `[slug]` loading skeleton, or any data fetching.

**Verification:** dev-server smoke test — open `/shop`, hover a swatch (image preview switches), click a swatch (image switches, URL stays `/shop`, no loading screen). Click the product image / name / `CHOOSE SHADE` button — navigates to `/shop/[slug]`. Tab to a swatch and press Enter/Space — shade updates, no nav. Mobile viewport tap — no nav. `npm run build` passes type-check.

---

## 2026-05-02 — Multi-image upload at shade creation time

**Status:** DONE

User flow before: creating a new shade only allowed a single image via `ImageUploader`; to add more images you had to save the shade first, then re-open it to use `VariantImageGallery`. User wanted to add multiple images during creation in one step.

Implementation: in [src/components/admin/VariantForm.tsx](src/components/admin/VariantForm.tsx), the create-mode UI now stages multiple `File` objects client-side (with `URL.createObjectURL` previews) until the user clicks "Add Shade". On submit, `createVariant` runs first to get the new variant ID, then `uploadVariantImages(productId, newId, fd)` uploads the staged files in a single batch. The existing `syncVariantPrimaryImage` call inside `uploadVariantImages` populates the variant's `image_url` from the first uploaded image, so the legacy single-image field stays in sync without any backend changes. Pending preview object URLs are revoked on unmount to avoid leaks. Validation (allowed types, 5MB limit) mirrors `VariantImageGallery`. Files can be removed from the staging grid before submit. The single-image `ImageUploader` is no longer used in the create path.

**Files touched:**
- [src/components/admin/VariantForm.tsx](src/components/admin/VariantForm.tsx) — replaced `ImageUploader` with a multi-file staging UI for new variants; added `pendingFiles` / `pendingPreviews` state, `handlePendingFiles`, `removePendingAt`, an `useEffect` cleanup for object URLs, and an extra step in `handleSubmit` that batch-uploads after `createVariant` returns. Dropped the unused `imageUrl` state and `ImageUploader` import.

Not changed: server actions ([src/app/admin/(protected)/products/actions.ts](src/app/admin/(protected)/products/actions.ts)) — `createVariant` and `uploadVariantImages` already supported the two-step flow; the only adjustment was on the client. `ImageUploader` itself is left intact (still used elsewhere; not removing it for a follow-up).

**Verification:** dev-server smoke test — open a product, click "Add Shade", select 3 images via the file picker (or in two separate clicks), verify previews render with the first marked "Primary"; remove one preview; click "Add Shade" and confirm the form closes, the new shade appears in the list with all selected images attached, and re-opening the shade shows them in `VariantImageGallery` in the order picked. Also confirm `image_url` (the single-image legacy field) reflects the first upload by checking the shade's swatch on the public product page.

---

## 2026-05-02 — Fix: variant images appearing to "replace" each other on multi-upload

**Status:** DONE

User reported that uploading multiple images to a shade in the admin panel sometimes caused a previously-uploaded image to disappear from the grid, as if the new image had replaced it. The DB rows and storage objects were always intact — only the local UI state was being clobbered until a hard refresh restored the gallery.

Root cause was in [src/components/admin/VariantImageGallery.tsx](src/components/admin/VariantImageGallery.tsx): a `useEffect` was syncing `items` from the `initialImages` prop on every parent render. Because `uploadVariantImages` calls `revalidatePath` ([src/app/admin/(protected)/products/actions.ts:514](src/app/admin/(protected)/products/actions.ts#L514)), the parent server component refetches and passes a new `initialImages` array reference. If the user kicked off a second upload before the RSC payload landed (or if a slightly-stale snapshot streamed in mid-flight), the effect overwrote the optimistic local state and the second image visually vanished.

Fix: removed the `useEffect` that resyncs from `initialImages`, and removed the now-unused `useEffect` import. Local state is initialized once from `initialImages` via `useState`, then the existing optimistic updates in `handleFiles` / `handleDelete` / `handleDragEnd` are authoritative. Switching shades remounts the gallery (different variant in `VariantForm`), so per-variant initial state still flows correctly on mount.

**Files touched:**
- [src/components/admin/VariantImageGallery.tsx](src/components/admin/VariantImageGallery.tsx) — dropped the prop-sync `useEffect` (3 lines) and trimmed the import.

Not changed: [src/app/admin/(protected)/products/actions.ts](src/app/admin/(protected)/products/actions.ts) — `uploadVariantImages` is sequential, computes `sort_order` correctly, and the `Date.now()_${i}` storage path is collision-free within a batch. No data corruption, just a UI race.

**Verification:** dev-server smoke test — open a product with a shade, add 3 images one-by-one rapidly, confirm none disappear; add 3 images at once via multi-select; delete and reorder still work; hard-refresh shows the same set in the same order; switching shades shows the right variant's images.

---

## 2026-04-29 — Our Story page redesigned to match Figma "About Us" design

**Status:** IN PROGRESS

Rebuild of `/our-story` against Figma node `241:5` in file `fxVWLAnNKcY4SUCRz52ro1`. Replaces the gray placeholder card-grid layout with the brand's editorial alternating image/text rhythm — cream background, burgundy Agatho display headings, Satoshi body, founders' actual narrative copy.

Sections (top → bottom):
- Hero band (cream): "ABOUT US" pill + "Our Story" Agatho 54px burgundy + tagline
- Manifesto quote (Agatho Bold 40px burgundy)
- About Us essay (7 paragraphs + signature line)
- Our Clean Beauty Promise (image L / text R)
- Our Products (5 bulleted SVG-icon rows / image R)
- Our Ingredients (2 alternating rows, 4 paragraphs total)
- What Makes Us Different (2 alternating rows with 4 sub-headings)
- Our Story (4 alternating image/text rows — founders' personal narrative)
- Our Mission (3 alternating rows ending in italic tagline)
- Our Team (eyebrow + placeholder block)

**Files touched:**
- `src/app/(public)/our-story/page.tsx` — full body rewrite. Kept `metadata`, `revalidate = false` (SSG), and `<PromotionBannerResolver />`. All copy lifted verbatim from Figma. Bullets use inline `<svg>` glyphs (no asset pipeline). Signature is Newsreader italic text (no asset upload). All section images reuse `/images/about/about-image.jpeg` with a TODO for brand-supplied finals.

**Reused infra (no edits):**
- Tailwind tokens: `bg-cream`, `text-burgundy`, `font-display` (Agatho), `font-sans` (Satoshi), `font-accent` (Newsreader) — all already in `tailwind.config.ts`.
- Fonts already wired in `src/app/layout.tsx`.
- `(public)` layout already provides Navbar / Footer / CookieNotice — Figma's nav+footer ignored.

**Verification:** `npm run build` to confirm `/our-story` renders as `○ Static`; dev-server smoke test at 375 / 768 / 1280 viewports; confirm mobile collapses every 2-col row to image-on-top stacked.

---

## 2026-04-29 — Cookie notice + accurate privacy policy section

**Status:** DONE

User asked what cookies the site uses and whether a cookie consent prompt was needed. Audit found: site uses only Supabase auth cookies (strictly necessary) and one `sessionStorage` flag for the dismissable promo banner. Zero analytics, zero tracking, zero third-party scripts.

Decision: rather than add a misleading Yes/No consent banner (both buttons would do nothing because there are no non-essential cookies), add a small one-time informational notice and rewrite the privacy policy section to reflect reality.

- **New:** [src/components/public/CookieNotice.tsx](src/components/public/CookieNotice.tsx) — slim bottom-pinned bar shown on first visit. Stores acknowledgment in `localStorage` under `inoya_cookie_notice_ack` so it appears once per device. `z-[55]` (below promo banner's `z-[60]`). Brand-rose "Got it" button at `min-h-[44px]` per touch-target rule. Privacy policy link inline.
- **Modified:** [src/app/(public)/layout.tsx](src/app/(public)/layout.tsx) — mount `<CookieNotice />` after `<Footer />`. Public layout only — admin layout intentionally untouched.
- **Modified:** [src/components/public/PrivacyPolicyContent.tsx](src/components/public/PrivacyPolicyContent.tsx) section 02 — replaced generic boilerplate with accurate text covering Supabase auth cookies, the `localStorage` flag for this notice, and the `sessionStorage` flag for the promo banner. Explicitly states no analytics/advertising/tracking and no third-party data sharing for marketing.

This is the first `localStorage` usage on the site; previously only `sessionStorage` was used (in `PromotionBanner`).

Not changed: [src/middleware.ts](src/middleware.ts) (Supabase auth cookies are essential, no consent gating needed) and [src/components/public/PromotionBanner.tsx](src/components/public/PromotionBanner.tsx) (sessionStorage usage is functional, no consent needed).

If analytics, advertising pixels, or any third-party tracking is added later (Vercel Analytics, Meta Pixel, Google Ads, etc.), this notice should be upgraded to a real consent banner with conditional script loading.

**Verification:** dev-test in incognito to confirm the notice appears at bottom on first visit, "Got it" dismisses and persists across reloads, clearing localStorage re-shows it, the notice is absent on `/admin/*` routes, and the rewritten privacy section renders on `/privacy-policy`.

---

## 2026-04-18 — Close admin panel auth bypass

**Status:** DONE

User reported: clicking any sidebar menu item in the admin panel entered the panel without a password. Root cause was layered — none of middleware, admin layout, or login form actually checked `admin_users` membership, and middleware failed open when Supabase env vars were missing (which was the likely trigger given the recent Vercel deploy).

Fix:
- **New:** [src/lib/auth/requireAdmin.ts](src/lib/auth/requireAdmin.ts) — shared guard that validates the session is in `admin_users` and redirects to `/admin/login` otherwise. Wraps the Supabase calls in try/catch so any failure fails closed.
- **New:** [src/app/admin/(public)/layout.tsx](src/app/admin/(public)/layout.tsx) — passthrough layout for the `(public)` route group so the login page does not inherit the protected admin layout.
- **Moved:** `src/app/admin/login/page.tsx` → `src/app/admin/(public)/login/page.tsx`. URL is still `/admin/login` — `(public)` is a route group and does not affect the path. This was required to avoid a redirect loop once the protected layout calls `requireAdmin()`.
- **Modified:** [src/app/admin/layout.tsx](src/app/admin/layout.tsx) — calls `await requireAdmin()` before the testimonial count query. This is the authoritative gate: even if middleware is misconfigured again, every protected page render runs this guard.
- **Modified:** [src/middleware.ts](src/middleware.ts) — (a) fails closed on `/admin/*` when Supabase env vars are missing (was returning `next()` unconditionally), (b) also queries `admin_users` to verify membership, not just that a user exists, (c) wraps the admin-path logic in try/catch so any unexpected error redirects to login.
- **Modified:** `src/app/admin/(public)/login/page.tsx` — after `signInWithPassword` succeeds, queries `admin_users`; if the logged-in user is not an admin, signs them out and shows the same generic `"Invalid credentials"` message (per CLAUDE.md, login must not leak whether an email exists or is an admin).

Relied on existing RLS policy on `admin_users` that allows `auth.uid() = user_id` self-SELECT (plan.md:175-177) — an authenticated user can read only their own row, which is all these checks need.

Not done (out of scope): the inline admin checks duplicated across `src/app/admin/*/actions.ts`. They already use the correct pattern; factoring them through `requireAdmin()` is a follow-up.

**Verification:** see plan file for full test matrix (logged-out direct URL, non-admin user, admin happy path, sidebar click after logout, missing env var simulation, login message leak check, admin server action smoke test).

---

## 2026-04-18 — Loading indicators + remove force-dynamic from ISR pages

**Status:** DONE

Visitor-reported issue: clicks felt slow and there was no feedback during navigation. Two causes, both fixed.

**1. Structural — restored ISR on homepage and shop:**
- [src/app/(public)/page.tsx](src/app/(public)/page.tsx) — removed `export const dynamic = 'force-dynamic'`; kept `revalidate = 3600`. Homepage now serves from ISR cache per CLAUDE.md spec instead of full SSR on every request.
- [src/app/(public)/shop/page.tsx](src/app/(public)/shop/page.tsx) — removed `force-dynamic`, removed `unstable_noStore` import and its `noStore()` call. Shop now serves from ISR cache with `revalidate = 1800`.
- `/shop/[slug]` left on SSR intentionally (stock/availability must be fresh per spec).

**2. Cosmetic — loading feedback on every click:**

Files created (skeletons for every public route, matching the existing inline skeleton style — plain Tailwind `bg-gray-200 animate-pulse`):
- `src/app/(public)/loading.tsx`
- `src/app/(public)/shop/loading.tsx`
- `src/app/(public)/shop/[slug]/loading.tsx` — hero + shade swatch + accordion skeleton (the slowest route, highest impact)
- `src/app/(public)/our-story/loading.tsx`
- `src/app/(public)/community/loading.tsx`
- `src/app/(public)/contact/loading.tsx`
- `src/app/(public)/policies/loading.tsx`

Top-of-viewport navigation progress bar (covers the ~100ms gap before `loading.tsx` renders):
- `src/components/public/NavigationProgress.tsx` — 2px brand-rose bar; listens for same-origin link clicks to show immediately, hides on `pathname`/`searchParams` change. No npm dependency.
- Mounted in [src/app/(public)/layout.tsx](src/app/(public)/layout.tsx) and [src/app/admin/layout.tsx](src/app/admin/layout.tsx), each wrapped in `<Suspense fallback={null}>` because it uses `useSearchParams`.

**3. Buy Now submit pending state:**
- [src/components/public/BuyNowModal.tsx](src/components/public/BuyNowModal.tsx) — added `isSubmitting` local state. Submit button is disabled during submit, shows inline `animate-spin` circle, and swaps label to "Sending…". Prevents double-tap and tells the user something is happening.

**4. Admin forms — verified existing behaviour:**
- [src/components/admin/ProductForm.tsx:268-272](src/components/admin/ProductForm.tsx#L268-L272) and [src/components/admin/VariantForm.tsx:201-205](src/components/admin/VariantForm.tsx#L201-L205) already wire `useTransition`'s `isPending` to `disabled` + spinner + "Saving..." label. No change needed.

**Verification:**
- Dev server: clicking into Shop now flashes the shop skeleton; clicking a product flashes the detail skeleton (hero block + shade swatch row).
- Second visit to Home after visiting Shop is near-instant (ISR cache hit, confirming `force-dynamic` removal took effect).
- Buy Now submit shows "Sending…" with spinner.
- Admin Save shows "Saving…" with spinner.
- Need to run `npm run build` to confirm `/` and `/shop` appear as ISR (not λ Dynamic) in the build output.

**Next:** keep Phase 6 deploy work going — this patch is independent of the deploy blockers.

---

## 2026-04-18 — Multi-image upload per shade (variant gallery)

**Status:** DONE (migration applied via Supabase MCP, backfill verified, code complete)

Each shade (product variant) now supports a full image gallery (multi-image upload, reorder via drag-and-drop, delete). The primary image is always the first in the sort order. The variant's existing `image_url` column is kept continuously in sync with whichever gallery row has `sort_order = 0`, so every existing single-image consumer (shop grid, homepage carousel, admin list thumbnail, legacy queries) keeps working unchanged.

On the public product detail page, the thumbnail rail is now **per-shade** (not one-thumbnail-per-shade). Switching shades swaps the rail to the new shade's images and resets the main image to index 0; clicking a thumbnail within the rail swaps the main image via opacity-fade (CLAUDE.md rule preserved).

**DB migration (applied — `add_variant_images_table`):**
```sql
CREATE TABLE variant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX variant_images_variant_idx ON variant_images(variant_id, sort_order);
ALTER TABLE variant_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variant_images_public_read" ON variant_images FOR SELECT USING (true);
CREATE POLICY "variant_images_admin_all"   ON variant_images FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_users));
-- Backfill: 4 existing variants with image_url → 4 variant_images rows.
```

**Files created:**
- `src/components/admin/VariantImageGallery.tsx` — dnd-kit sortable grid with multi-file upload, per-tile delete, "Primary" badge on the first tile. Reuses the 5 MB / JPEG+PNG+WebP validation constants.

**Files modified:**
- `src/lib/types.ts` — new `VariantImage`; `ProductVariant` gains optional `images?: VariantImage[]`.
- `src/app/admin/products/actions.ts` — `uploadVariantImages`, `deleteVariantImage`, `reorderVariantImages`; `deleteVariant` now batch-removes all gallery storage objects; a private `syncVariantPrimaryImage()` keeps `product_variants.image_url` pointed at the current sort-0 row after every mutation.
- `src/components/admin/VariantForm.tsx` — for existing variants, the image field renders `VariantImageGallery`; for a brand-new (unsaved) variant, the old single-image `ImageUploader` remains with a "Save the shade to add more images" hint (agreed UX flow).
- `src/app/admin/products/[id]/page.tsx` — select now pulls `variant_images(*)`; mapped onto `variant.images` sorted by `sort_order`.
- `src/app/(public)/shop/[slug]/page.tsx` — same: PDP query pulls `variant_images(*)`.
- `src/components/public/ShadeSelector.tsx` — new local `selectedImageIndex` state; `galleryImages` derived from `selectedVariant.images` (fallback `[{ url: image_url }]` for legacy rows). Thumbnail rail renders the selected shade's gallery; main image area opacity-swaps within that gallery. Switching shades resets the image index via `useEffect`.

**Design rules honored:**
- `image_url` kept in sync with sort-0 row → zero impact on `ProductCard`, homepage, shop grid (no query changes needed there).
- `ON DELETE CASCADE` handles row cleanup when a variant is deleted; storage paths are stored explicitly so we can remove Supabase Storage objects in one batch.
- Opacity-swap preserved *within* the selected shade's image set.

**Verify:**
1. Admin → Products → open any product → open a shade: gallery shows the backfilled image as Primary.
2. Upload 2–3 more (mixed JPEG/PNG/WebP; try one >5 MB — expect rejection with filename).
3. Drag to reorder → refresh → order persists; Primary badge moves to whatever ends up first.
4. Delete the Primary → next image auto-promotes; run `SELECT image_url FROM product_variants WHERE id = '…'` via MCP to confirm sync.
5. Delete a non-Primary → storage object is gone from the `product-images` bucket.
6. Create a brand-new shade with one image → save → re-open → gallery renders that one image; upload more.
7. `/shop/<slug>` → selecting a shade swaps the thumbnail rail to that shade's gallery; clicking a thumbnail fades the main image; swapping shades resets main to index 0.
8. `/shop` and `/` → ProductCard thumbnails unchanged (still the primary image per shade).
9. Delete a variant → `SELECT COUNT(*) FROM variant_images WHERE variant_id = '…'` returns 0 (cascade) and bucket objects are gone.

**What's next:** Commit + deploy; smoke test on Vercel preview.

---

## 2026-04-18 — User-selectable offer stacking on PDP

**Status:** DONE

Shoppers can now apply multiple offers simultaneously on the product detail page. Reverses the previous "best discount wins / one at a time" rule in favour of explicit, user-driven stacking.

**Stacking rule:** offers apply sequentially on the running price. Percent offers first (highest % first), then flat (largest ₹ first) — deterministic regardless of click order. Final price clamps at ₹0.

**Files touched:**
- `src/lib/pricing.ts` — replaced single-offer `computePriceFromOffer` with `computePriceFromOffers(basePrice, offers[])` which sorts and applies offers sequentially.
- `src/components/public/ShadeSelector.tsx` — state is now `appliedOfferIds: string[]`. Added `useEffect` that drops stale IDs when shade switch removes variant-scoped offers. `appliedOfferLabel` for WhatsApp joins labels with `+`.
- `src/components/public/OffersPanel.tsx` — new props `appliedOfferIds` + `onToggle` + `savings`. Applied buttons are no longer disabled (tap-to-remove). Added a summary row showing applied count and total ₹ saved.

**Data model:** unchanged — no new columns. Stacking is pure client-side UX.

**Verify:**
1. Open a product at `/shop/<slug>` with multiple live offers.
2. Click "Available Offers" → tap two offers → price drops further on each; "2 offers applied — Save ₹X" appears.
3. Tap an applied offer → it removes cleanly.
4. Switch shades → any variant-scoped applied offer silently drops.
5. Math check: ₹1000 base + 20% promo + ₹100 flat → `(1000 × 0.8) − 100 = ₹700`.
6. Edge: 100% + ₹50 flat → clamps at ₹0.
7. Buy Now → WhatsApp message lists both labels joined with `+`.

---

## 2026-04-18 — Category-scope promotion banner (page-aware)

**Status:** DONE

Category-scope promotions now surface as banners on pages where the category is relevant. Rule: more-specific wins — a category banner replaces the site-wide banner on matching pages; only one banner at a time.

**Changes:**
- NEW `src/components/public/PromotionBannerResolver.tsx` — server component that fetches active promotions, filters with `isPromotionLive()`, prefers a matching `scope='category'` promotion when a `category` prop is passed, otherwise falls back to the best `scope='all'` promotion. Renders `<PromotionBanner>` or nothing.
- `src/app/(public)/layout.tsx` — removed `getBannerPromotion()` + `<PromotionBanner>`. Banner selection moved to page level so it can be category-aware.
- Resolver wired into every public page:
  - `/` (home), `/our-story`, `/community`, `/contact`, `/policies` → no category, falls back to site-wide.
  - `/shop` → accepts `searchParams.category`, passes it through only if it's one of `Lips`/`Eyes`/`Face`.
  - `/shop/[slug]` → passes `product.category`.

No DB / type / `PromotionBanner` changes.

**Verify:**
1. Admin → create two promos: Winter Sale (scope=All, 10%), Lips Love (scope=Category, scope_value=Lips, 20%).
2. `/` → Winter Sale · `/shop` → Winter Sale · `/shop?category=Lips` → Lips Love · `/shop?category=Eyes` → Winter Sale · Lips product page → Lips Love · Eyes product page → Winter Sale · delete Lips Love → every page shows Winter Sale.

---

## 2026-04-18 — Promotions (campaigns) + Click-to-Apply offers UX

**Status:** DONE (migration applied via Supabase MCP, code complete, typecheck passes)

Building two intertwined features:
1. **Admin Promotions** — site-wide / category-wide campaigns (e.g. Holiday Sale 20% off Lips). New `promotions` table, admin CRUD at `/admin/promotions`. Independent from per-product discounts.
2. **Customer Click-to-Apply Offers** — wires up the previously-placeholder "AVAILABLE OFFERS" button on PDP. Price now shows at full base price initially; clicking the button reveals available offers (per-product discount + active matching promotion) with individual "Apply Offer" buttons. Clicking Apply updates the price live with strikethrough + Save badge — creates a sense of agency/reward.

**Pricing rule:** "best discount wins" — never stacked. PDP defers application until user clicks Apply; ProductCard discount badges in shop grid remain auto-applied (unchanged).

**DB migration (applied — `add_promotions_table`):**
```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  scope TEXT NOT NULL DEFAULT 'all' CHECK (scope IN ('all', 'category')),
  scope_value TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promotions_public_read" ON promotions FOR SELECT USING (is_active = true);
CREATE POLICY "promotions_admin_all" ON promotions FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
CREATE INDEX promotions_active_idx ON promotions(is_active, starts_at, ends_at);
```

**Files (planned):**
- New: `src/app/admin/promotions/{page,actions}.tsx`, `src/app/admin/promotions/{new,[id]}/page.tsx`, `src/components/admin/{PromotionForm,PromotionTable}.tsx`, `src/components/public/OffersPanel.tsx`
- Modified: `src/lib/types.ts` (Promotion, Offer types), `src/lib/pricing.ts` (promotion helpers), `src/components/admin/Sidebar.tsx` (Promotions link), `src/components/public/ShadeSelector.tsx` (click-to-apply), `src/app/(public)/shop/[slug]/page.tsx` (fetch promotions)

**What's next:** User runs SQL migration; verify admin can create promotion; verify PDP offer panel applies/unapplies correctly.

---

## 2026-04-18 — Per-shade (variant) discount overrides

**Status:** DONE (migration applied via Supabase MCP, code complete, typecheck + build pass)

Extending the existing product-level discount system so each shade (variant) can carry its own optional discount, independently of the product discount. Resolution rule: **variant discount overrides product discount** when live; otherwise the product discount is inherited. Field parity with the existing `Discount` shape — type (percent/flat), value, starts_at, ends_at, is_active — so per-shade sales can be scheduled.

**DB migration (applied — `add_variant_discounts`):**
- Added `variant_id uuid NULL REFERENCES product_variants(id) ON DELETE CASCADE` to `discounts`
- Made `product_id` nullable
- Dropped the old `UNIQUE(product_id)` constraint (`one_discount_per_product`)
- Added partial unique indexes: `discounts_product_id_unique` WHERE variant_id IS NULL, `discounts_variant_id_unique` WHERE variant_id IS NOT NULL
- Added `discounts_scope_check` (exactly one of product_id / variant_id must be set)
- RLS unchanged — existing admin-write policy (`admin_users`) covers variant-scoped rows

**Files touched (code):**
- `src/lib/types.ts` — `Discount.variant_id`, `Discount.product_id` nullable, `ProductVariant.discount`
- `src/lib/pricing.ts` — `computePrice` prefers variant discount over product discount
- `src/components/admin/DiscountSection.tsx` — extracted shared section (reused by Product + Variant forms)
- `src/components/admin/ProductForm.tsx` — imports `DiscountSection` instead of embedding
- `src/components/admin/VariantForm.tsx` — adds discount fields with live preview
- `src/components/admin/VariantManager.tsx` — discount badge beside the price row
- `src/app/admin/products/actions.ts` — `upsertDiscount` now accepts product- or variant-scoped target; `createVariant` / `updateVariant` handle variant discount; `deleteVariant` cascades via FK
- `src/app/(public)/shop/[slug]/page.tsx` — fetches variant-scoped discounts and attaches them to each variant
- `src/app/(public)/shop/page.tsx` + `src/app/(public)/page.tsx` — same for grid/carousel first-variant rendering
- `src/app/admin/products/[id]/page.tsx` — same for admin preview

**What's next:** In the admin dashboard, edit a product → open any shade → set a discount → save, and verify on `/shop/[slug]` that clicking between shades swaps the price between the variant-specific discount and the inherited product discount.

---

## 2026-04-18 — Update: prices set to Satoshi font

**Status:** DONE
**What was done:** 
- Switched the main price font on the product detail page (`ShadeSelector.tsx`) from `font-serif` (Playfair Display) to `font-sans` (Satoshi) to match the brand's primary UI typography and user request.
- Synchronized currency formatting in the shop grid (`ProductCard.tsx`) to use the `formatINR` helper, replacing hardcoded "RS." with the Rupee symbol ("₹") for consistency across the entire storefront.

**Files touched:**
- `src/components/public/ShadeSelector.tsx` — changed price font to `font-sans`.
- `src/components/public/ProductCard.tsx` — updated shop variant to use `formatINR`.

---

# UPDATES.md — Inoya Rouge Project Changelog

> **Claude Code: Read this file before writing any code.**
> Add a new entry at the TOP of this file (newest first) before starting any work.
> Format: date, summary, files touched, status, what's next.

---

## 2026-04-17 — Fix: discount not rendering on product detail page

**Status:** DONE (verified live — HTML now contains ₹800.00 with ~~₹1,000.00~~ strikethrough and Save badge)

Discount was saved correctly (admin preview showed ₹1,000 → ₹800) but the public `/shop/[slug]` page kept rendering ₹1,000 with no badge.

**Root cause:** PostgREST returns a joined row as an **object** (not an array) when the FK column has a `UNIQUE` constraint. The `discounts` table has `UNIQUE(product_id)`, so `discounts(*)` resolves as a single object. Our mapping code did `((p.discounts as Discount[]) ?? [])[0]` — indexing `[0]` on an object returns `undefined`, silently dropping the discount everywhere.

**Fix:** Added `normalizeDiscount(raw)` helper in `src/lib/pricing.ts` that accepts both shapes (object or array) and returns `Discount | null`. Updated all 5 sites that map the embed.

Also tightened admin cache invalidation: `createProduct` / `updateProduct` now call `revalidatePath('/shop/${slug}')` so editing a discount immediately purges the detail page cache.

**Files touched:**
- `src/lib/pricing.ts` — new `normalizeDiscount()` helper
- `src/app/(public)/page.tsx` — use `normalizeDiscount`
- `src/app/(public)/shop/page.tsx` — use `normalizeDiscount`
- `src/app/(public)/shop/[slug]/page.tsx` — use `normalizeDiscount` (main + related)
- `src/app/admin/products/[id]/page.tsx` — use `normalizeDiscount`
- `src/app/admin/products/actions.ts` — revalidate `/shop/${slug}` on create/update

**What's next:** Commit + deploy to Vercel. Verify on production that discount renders on all 3 surfaces (homepage carousel, shop grid, product detail).

---

## 2026-04-17 — Per-product discounting system

**Status:** DONE (migration applied via Supabase MCP, code complete, typecheck passes)

Added a product-level discount system — admin can set a percent or flat ₹ discount with an optional active window (starts_at / ends_at) directly inside the product edit page (no new admin route, no sidebar entry). Storefront shows strikethrough original price + sale price + "-N%" badge everywhere: shop cards, homepage carousel, product detail page. WhatsApp Buy Now message surfaces the saving (`Price: ₹960.00 (was ₹1,200.00, -20%)`).

**DB migration (applied):** `create_discounts_table` via MCP. New `discounts` table (one row per product, UNIQUE on `product_id`), percent/flat type, optional date window, RLS (public read; admin-only write via `admin_users`).

**New files:**
- `src/lib/pricing.ts` — single-source pricing helpers: `computePrice(product, variant)`, `isDiscountLive()`, `formatINR()`, `computePriceStandalone()` (for admin live preview).

**Files modified:**
- `src/lib/types.ts` — added `Discount` type, extended `Product` with optional `discount`
- `src/app/admin/products/[id]/page.tsx` — joins `discounts(*)`, normalizes first row onto `product.discount`
- `src/components/admin/ProductForm.tsx` — new `DiscountSection` below Base Price: enable checkbox, percent/flat radio, value, datetime-local start/end, live preview panel
- `src/app/admin/products/actions.ts` — `upsertDiscount()` helper invoked from `createProduct`/`updateProduct`; validates (>0, percent ≤100), converts `datetime-local` → ISO; revalidates `/shop` and `/`
- `src/app/(public)/shop/page.tsx`, `src/app/(public)/shop/[slug]/page.tsx` (2 queries), `src/app/(public)/page.tsx` — all queries now select `discounts(*)` and normalize first row onto `product.discount`
- `src/components/public/ProductCard.tsx` — `computePrice` + strike-through UI in all three variants (shop, curated, default). Also centralized currency formatting through `formatINR`.
- `src/components/public/ShadeSelector.tsx` — uses `computePrice(product, selectedVariant)`; added visible price block (was hidden before) with sale badge; recomputes on shade switch
- `src/components/public/BuyNowModal.tsx` — dropped the `price` prop (now computes internally via `computePrice`); WhatsApp message shows discounted price + original + percent when applicable

**Design rules honored:**
- `UNIQUE(product_id)` keeps the model flat — one discount per product
- "Live" window = `is_active AND (starts_at <= now OR null) AND (ends_at > now OR null)` — evaluated client-side via `isDiscountLive`
- Percent discount applies to `variant.price_override` when present (not just base) — so per-shade prices honor the same % off
- Flat discount clamps to ₹0 via `Math.max(0, …)` to prevent negatives

**What's next:** Admin smoke-test in browser — create a 20% discount, verify strike-through renders on homepage + shop + detail page, verify WhatsApp message shows `(was ₹X)` line. Then mark this entry verified.

---

## 2026-04-17 — Buy Now WhatsApp message includes product URL

**Status:** DONE

Buy Now modal now appends the canonical product URL (`{origin}/shop/{slug}`) to the WhatsApp message, directly under the product name line. Origin is read from `window.location.origin` at submit time (handler runs client-side), with an `https://inoyarouge.com` fallback as an SSR/typing guard. No new env vars, no upstream prop changes.

**Files touched:**
- `src/components/public/BuyNowModal.tsx` — derive `productUrl` in `handleSubmit`; add one line to the message template.

**What's next:** Smoke test — open a product page, submit Buy Now, confirm the URL renders as a tappable link in WhatsApp.

---

## 2026-04-17 — Product URLs: UUID → slug

**Status:** IN PROGRESS (code changes complete; DB migration pending — owner must run SQL in Supabase)

Replaced UUID-based product URLs (`/shop/33448964-8a51-4817-8fbb-...`) with readable slug URLs (`/shop/velvet-rouge-lipstick`). Slugs are auto-generated from product name on create and locked afterwards (no admin edit, no redirects, no SEO churn). Admin routes still use UUIDs.

**Files touched:**
- `src/lib/slug.ts` (new) — `slugify()` helper
- `src/lib/types.ts` — added `slug: string` to `Product`
- `src/app/admin/products/actions.ts` — `createProduct` generates unique slug (appends `-2`, `-3`, … on collision)
- `src/app/(public)/shop/[id]/` → renamed to `src/app/(public)/shop/[slug]/` — queries now `.eq('slug', slug)`
- `src/components/public/ProductCard.tsx` — 5 `href` templates switched from `product.id` to `product.slug`

**Blocked on owner action:** Run the SQL migration (provided in the execution output) in the Supabase SQL editor to add the `slug` column + backfill + UNIQUE constraint.

**What's next:** Owner runs SQL → dev-server smoke test → mark DONE.

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

### [2026-04-17] — Buy Now Address-Capture Modal + WhatsApp Handoff

**Type:** Enhancement
**Status:** IN PROGRESS

**What was done:**

Replaced the direct-redirect BUY NOW button on product detail pages with a popup that captures shipping address before handing off to WhatsApp. Visitors can fill the form manually or click "Auto-detect my address" to have their fields filled from browser geolocation (via OpenStreetMap Nominatim reverse-geocoder — no API key). On PROCEED TO ORDER, opens WhatsApp with a message containing product/quantity/shade + the full shipping address, so the fulfilment team gets everything in the first message.

- Modal is client component, framer-motion fade+scale animation, Escape + backdrop-click dismiss, focus-trap on first input
- Fields: Full Name, Phone (10-digit IN), Address Line 1, Line 2 (optional), City, State, Pincode (6-digit)
- If product has a custom `buy_url` set, modal is bypassed and redirect goes straight to that URL (preserves existing behaviour for external checkouts)
- No DB schema changes — address is transient, only embedded in the WhatsApp message

**Files created:**
- `src/components/public/BuyNowModal.tsx`

**Files modified:**
- `src/components/public/ShadeSelector.tsx` — BUY NOW button now opens modal

**What's next:** Verify in browser (auto-detect + manual paths), then mark DONE

---

### [2026-04-17] — Customizable Collections Management

**Type:** Enhancement
**Status:** IN PROGRESS

**What was done:**

Replaced hardcoded collections (Kysmé, Liquid Allure, Kajal, etc.) with a fully database-driven system. Admin can now manage collections per category from a dedicated `/admin/collections` page. Public shop shows collection sub-filters for all categories (Lips, Eyes, Face), not just Lips.

- Created `collections` table (id, category, name, sort_order) with public read + admin-only write RLS
- Seeded existing 11 collections (3 Lips + 3 Eyes + 5 Face); "Other" remains a UI-only sentinel
- New admin page `/admin/collections` with per-category tabs, add/edit/delete, drag-reorder
- Product form dropdown now fetches collections from DB instead of hardcoded object
- Rename cascades to referenced products; delete nullifies them
- Public shop `ShopClient` accepts dynamic collections and renders sub-filter row for any category with ≥1 collection

**Files created:**
- `src/app/admin/collections/page.tsx`
- `src/app/admin/collections/actions.ts`
- `src/components/admin/CollectionManager.tsx`

**Files modified:**
- `src/lib/types.ts` — added `Collection` type
- `src/components/admin/Sidebar.tsx` — added Collections nav link
- `src/components/admin/ProductForm.tsx` — dynamic collections prop, "Other" kept as fallback option
- `src/app/admin/products/[id]/page.tsx` — fetches collections and passes to form
- `src/app/(public)/shop/page.tsx` — fetches collections alongside products
- `src/components/public/ShopClient.tsx` — dynamic collection sub-filters for all categories

**Database migration applied:** `create_collections_table` (via Supabase MCP)

**What's next:** Verify end-to-end, mark DONE

---

### [2026-04-17] — Shop Page Redesigned to Match Figma Design

**Type:** Enhancement
**Status:** DONE

**What was done:**

Redesigned the shop page (`/shop`) to match the Figma design (node 105-202). Used the Figma API to extract the full design specification and implemented it pixel-accurately:

- **Hero Banner:** Full-width hero section (442px height) with hero background image, 22% black overlay, centered "Shop" heading in Agatho display font (87px), subheading "Beauty should never come at the cost of your skin." in Satoshi (39px), and "VIEW ALL PRODUCTS" CTA button in burgundy (#7a0000)
- **Category Tabs:** Replaced pill-style buttons with Figma's underline-style tabs — ALL PRODUCTS | LIPS | EYES | FACE, with a burgundy underline on the active tab, Satoshi 11px uppercase
- **Product Count:** Added centered "X PRODUCTS" counter in Satoshi 9px above a subtle divider line
- **Product Grid:** 4-column layout with 40px gap (matching Figma spacing), using the new `shop` variant of ProductCard
- **ProductCard (shop variant):** 211:264 aspect ratio images, product name in Satoshi 20px burgundy, price in Satoshi 14px black, peach (#faebe5) DISCOVER button with burgundy text
- **Trust Badges:** Added scrolling trust badges section below the product grid
- **Lips Sub-filters:** Redesigned from pills to bordered rectangular buttons matching the overall minimal aesthetic

**Files modified:**
- `src/app/(public)/shop/page.tsx` — complete rewrite with hero banner, trust badges integration
- `src/components/public/CategoryFilter.tsx` — redesigned tabs, product count, divider
- `src/components/public/ProductCard.tsx` — added `shop` variant matching Figma spec

**What's next:** Continue polish / other page refinements

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
