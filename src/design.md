# Inoya Rouge — Brand Identity System

**Status:** Sections 1–12 are **normative** — they describe the brand as it exists and govern the website build.
**Appendix A is NOT actionable.** It records what a corrected identity would look like for a future reprint cycle only.

**Hard constraint:** All packaging, logo artwork, and product photography in `references/` is already printed and in market. It is treated as **fixed**. Nothing in sections 1–12 requires reprinting anything.

**Last updated:** 2026-09-07 · Derived from `references/` + the skills in `.claude/skills/`

---

## 1. Aesthetic brief

Produced with `creative-direction`. The four axis positions were selected by the brand owners and govern every decision below.

| Axis | Position | Rationale |
|---|---|---|
| **Tone register** | Conversational | The founder story — two childhood friends from finance who built a beauty brand — is the single most distinctive asset. A category full of cold luxury-speak makes warmth the differentiator. |
| **Aesthetic philosophy** | Editorial Restrained | Generous whitespace, one definitive image over grids, low colour count. Also the mechanism that lets three clashing product palettes coexist. |
| **Audience relationship** | Companion | "We walk with you" — the reader is the protagonist. Matches the existing line *"made for every shade of you."* |
| **Sensory ambition** | Resonant | The visitor should feel the Indian botanical heritage and the friendship origin. The brand narrative is rich enough to carry it. |

No incompatible pairing. (`creative-direction` flags Functional+Provocative and Authority+Functional; neither applies.)

### Archetype position — a documented blend

Per `brand-archetype-system`, the DTC-beauty vertical has three lanes and warns: *"Commit to one lane; trying to do two reads as confused."*

Inoya Rouge sits in the **Luxe Considered** lane (Aesop, Tatcha — heritage narrative, cream palette, editorial photography) for **structure**, blended with **Warm Conversational** for **voice**.

| Dimension | Archetype governing it |
|---|---|
| Colour | Luxe Considered |
| Typography | Luxe Considered |
| Layout | Luxe Considered |
| Voice | Warm Conversational |

One dimension of four diverges, which is within the skill's tolerance (it requires re-picking only if two or more diverge). This blend is deliberate and documented.

**Note on the existing brand:** the current copy straddles Luxe Considered (*"an exquisite tribute to Swadeshi opulence"*) and Vibrant Saturated (the multicolour daisy, the heart doodles on Nuage Tint). This is the confusion the skill warns about. The resolution is to commit the *website* to Luxe Considered while the printed Vibrant Saturated elements remain in market.

### Synthesis

This brief produces a site that feels like a quiet, well-made magazine about a family business. It moves slowly, shows one large photograph rather than a grid of six, writes in complete sentences using "we" and "you," and never shouts. Premium is communicated by pacing and omission, not by the word "luxury." The founder story is told plainly rather than mythologised.

### Rejection list

- No stock photography of generic models
- No exclamation marks in body copy
- No "Shop Now!" urgency language, countdown timers, or spin-to-win popups
- No testimonial walls
- No emoji as icons
- No "luxury," "premium," or "exquisite" describing ourselves — show it instead
- No gradient-on-gradient beauty-brand clichés
- No pure `#FFFFFF` as the dominant page background (reads cheap in this archetype; use the warm papers)

---

## 2. Brand strategy

**Purpose** — Make cosmetics that care for skin as much as they colour it, rooted in Indian botanical tradition.

**Vision** — A beauty brand where Indian heritage and modern cosmetic science are the same sentence, and where every shade finds someone.

**Mission** — Create thoughtfully formulated colour cosmetics using Indian essential oils and botanicals, designed for Indian skin tones, that feel light enough to forget you are wearing them.

**Core values**
1. **Care before colour** — skin health is not traded for pigment
2. **Rooted, not costumed** — Indian heritage is the substance, not a decorative motif
3. **Compassion** — cruelty-free, no animal testing, without exception
4. **Precision with warmth** — finance-trained rigour, family-business heart
5. **Every shade** — inclusivity as a formulation requirement, not a campaign

**Target audience** — Indian women, roughly 22–40, urban and metro-adjacent, who buy beauty online. Educated, working, and ingredient-literate. She reads the back of the box. She has been let down by shades formulated for other skin tones, and by "natural" brands that were mostly packaging. She wants something that feels considered and is honest about what is in it.

**Positioning** — For the Indian woman who reads the ingredient list, Inoya Rouge is the colour cosmetics brand that treats Indian botanicals as active formulation rather than marketing story — because it was built by two people whose training was in scrutiny.

**Unique value proposition** — Botanical-led lip colour, formulated for Indian skin tones, from a brand that shows its work.

**Brand personality** — Warm, precise, unhurried, quietly confident, generous. Not: exclusive, clinical, girlish, loud.

**Brand promise** — Colour that is comfortable enough to forget, made from things you can pronounce.

---

## 3. Brand name & naming system

### The name

**Inoya Rouge.** *Inoya* — purity, radiance, natural beauty. *Rouge* — colour, confidence, timeless elegance. Together: vibrant yet gentle, modern yet rooted.

Always written **Inoya Rouge**. Never *INOYA ROUGE* in body copy (all-caps is reserved for the packaging lockup), never *Inoya*, never abbreviated to *IR* in prose. *IR* is a mark, not a word.

### Product naming — current state

| Product | Name | Register |
|---|---|---|
| Lipstick | Velvet Lumière | French |
| Matte Lipglow | Zyra Aura | Invented |
| Lip Tint | Nuage Tint | French + English |

These three do not follow a system: two French, one invented, one hybrid construction. **All three names stay as they are** — they are printed.

### Naming convention — for future lines only

Going forward, product names follow **[Texture or Sensation] + [Light or Nature noun]**, in French or English, never invented syllables:

- Texture/sensation words: Velvet, Satin, Sheer, Balm, Cream, Silk
- Light/nature words: Lumière, Aura, Nuage, Rosée, Aurore, Bloom

*Velvet Lumière* and *Nuage Tint* already fit. *Zyra Aura* is the outlier and is grandfathered.

Category descriptor always follows the name in plain English: **Velvet Lumière Lipstick**, not *Velvet Lumière Lip Couture*.

---

## 4. Logo system — AS-IS (normative)

### What exists

`references/logo.png` — a multicolour daisy (rouge, red, marigold, pink petals; green stem and leaves) with an **IR monogram** at the flower's centre, above the wordmark **INOYA ROUGE** in a serif with a small flower glyph replacing the space.

### Measured constraints — tested, not assumed

| Test | Result |
|---|---|
| Source resolution | 112 × 146 px raster |
| Unique colours | **4,206** (favicon spec allows 3–4) |
| Render at 16px | **FAILS** — the IR monogram disappears entirely; reads as an anonymous pink blob |
| Render at 32px | **FAILS** — petals dither into noise |
| Silhouette / single-colour | **PASSES** — daisy shape is distinctive, IR legible |
| Favicon recoverable from existing art? | **NO** — crop-to-head + posterise to 4 colours still yields mush; mono is unreadable |

The concept is sound. The *file* cannot serve small digital sizes, and no processing recovers it, because a 112px raster has nothing left at 16px.

### Usage rules

**Minimum sizes**
- Full lockup (daisy + wordmark): **never below 120px wide** on screen, 30mm in print. Below this the wordmark breaks down.
- Daisy alone: **never below 64px**. Below this, use the monogram.
- **Never** attempt the full-colour daisy below 64px. It becomes noise.

**Clear space** — minimum clear space on all sides equals the height of the daisy's flower head. No text, rule, or image edge inside it.

**The small-size path — digital surfaces only**

Because the daisy cannot render below 64px, small digital contexts use the **IR monogram**, set in the display serif, single colour.

This is the standard production hierarchy, sanctioned by `logo-design`: *"letterform-as-symbol or monogram for embroidery and 16px favicon"* — Slack's pattern; Chanel and Gucci use monograms for square contexts. The IR monogram **already exists** at the centre of the daisy, so this uses existing brand equity rather than inventing a mark.

**Critically: the favicon, app icon, and social avatar are digital-only surfaces. Using the IR monogram there changes no printed packaging.**

| Context | Asset |
|---|---|
| Marketing / hero / footer | Full lockup, full colour |
| Site header (≥120px) | Full lockup |
| Site header (mobile, tight) | Daisy + wordmark stacked, or wordmark alone |
| Social avatar (≥64px) | Daisy alone on `#FCF2EE` |
| Favicon 16/32px | **IR monogram**, plum `#3F3344` on `#FCF2EE` |
| App icon | **IR monogram**, reversed white on plum `#3F3344` |
| Embroidery / foil | **IR monogram**, single colour |

**Single-colour and reverse** — the silhouette test passes, so a single-colour daisy is viable at 64px and above: solid plum `#3F3344` on light grounds, solid `#FCF2EE` on dark grounds. Never single-colour rouge (fails contrast; see §5).

**Incorrect usage — do not**
- Stretch, skew, or rotate the mark
- Recolour the daisy outside the approved single-colour variants
- Place the full-colour daisy on a mid-tone or busy background
- Use the full-colour daisy below 64px
- Add effects: drop shadows, glows, bevels, outlines
- Re-typeset the wordmark in a different face
- Crop the daisy or use a petal as a standalone device
- Place the mark on a colour that leaves less than 3:1 contrast against its ground

---

## 5. Colour

### The governing finding

Every value below was measured from the source artwork with ImageMagick and its contrast computed against `#FFFFFF` and the logo ground `#FCF2EE`.

> **The brand's signature rouge `#E53059` scores 4.29:1 on white — below the 4.5:1 WCAG AA floor.**
> It cannot carry body text and cannot be a button with white text. This is not a stylistic opinion; it is a measurement.

The deep tones already present on the packaging all pass strongly, so they carry the interface while the rouge carries brand presence. `ui-ux-pro-max`'s beauty-vertical palette reaches the same structure independently, pairing a vivid pink primary with a deep `#831843` foreground.

### Master palette

**Neutrals — approximately 80% of all surface area**

| Token | Hex | RGB | CMYK approx. | Role |
|---|---|---|---|---|
| `paper` | `#FCF2EE` | 252, 242, 238 | 0, 4, 6, 1 | Primary page background (the logo's own ground) |
| `paper-cool` | `#F6F6F3` | 246, 246, 243 | 0, 0, 1, 4 | Alternate section background (the product-photo ground) |
| `white` | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | Cards, product imagery grounds only — never the dominant page field |
| `line` | `#E8DDD8` | 232, 221, 216 | 0, 5, 7, 9 | Borders, rules, dividers |

**Ink — text and interface**

| Token | Hex | On `paper` | AA body | Role |
|---|---|---|---|---|
| `ink` | `#3F3344` | **10.79:1** | PASS | Primary body text, headings, UI. From Velvet Lumière packaging |
| `ink-soft` | `#613E43` | **8.37:1** | PASS | Secondary text, captions, metadata. From product photography |
| `ink-deep` | `#251218` | **16.19:1** | PASS | Maximum-contrast text, footer on dark |

**Brand and action**

| Token | Hex | On white | White text on it | Role |
|---|---|---|---|---|
| `rouge` | `#E53059` | 4.29:1 — **FAILS AA** | 4.29:1 — **FAILS** | **Accent only.** Large display type (≥24px bold), rules, iconography, the mark. **Never body text. Never a white-text button.** |
| `cta` | `#9A254D` | 7.65:1 PASS | **7.65:1 PASS** | Primary buttons, links, focus rings. From Nuage Tint packaging |
| `cta-hover` | `#7D1D3E` | — | PASS | Hover/active state |
| `leaf` | `#358646` | 4.52:1 PASS | 4.52:1 PASS | Botanical/ingredient accent, success states. Tight margin — not for small text |

**Rule:** `rouge` is the brand's *voice*; `cta` is its *hand*. The rouge appears where the brand speaks (display headlines, the mark, rules). The magenta appears where the visitor acts (buttons, links).

### Product-line sub-palettes

Each line keeps its printed identity as a **page-level accent and surface** on its own product pages. The Editorial Restrained neutral canvas separates them, which is what allows three unrelated colour worlds to coexist without clashing.

**Velvet Lumière** (lipstick)

| Token | Hex | On white | Role |
|---|---|---|---|
| `vl-primary` | `#8E7698` | 4.04:1 | Large text ≥24px, surfaces, rules |
| `vl-tint` | `#B6A4C4` | 2.31:1 | Background tint only |
| `vl-deep` | `#3F3344` | 11.88:1 | Text on this line's pages |

**Zyra Aura** (matte lipglow)

| Token | Hex | On white | Role |
|---|---|---|---|
| `za-primary` | `#CAABA4` | 2.13:1 | Background tint and surfaces only |
| `za-deep` | `#AC3B46` | 6.06:1 | Text, buttons on this line's pages |
| `za-metal` | `#B98874` | 3.07:1 | Rose-gold echo — decorative rules only |

**Nuage Tint** (lip tint)

| Token | Hex | On white | Role |
|---|---|---|---|
| `nt-primary` | `#99B48F` | 2.26:1 | Background tint and surfaces only |
| `nt-deep` | `#9A254D` | 7.65:1 | Text, buttons on this line's pages |
| `nt-accent` | `#DAD016` | 1.61:1 | Decorative only — never text, never a background for text |

**Sub-palette rules**
1. A line's colour never appears outside that line's pages, except as a small swatch in a product grid.
2. Text on any line page uses that line's `-deep` value or the master `ink`. Never the `-primary` or `-tint`.
3. Only one line's palette on screen at a time. Product listing pages use master neutrals only.
4. Values below 3:1 are surfaces, never text and never carriers of meaning on their own.

### Accessibility rules

- Body text minimum 4.5:1; large text (≥24px, or ≥19px bold) minimum 3:1.
- Colour is never the sole carrier of meaning — shade availability, stock status, and errors carry a label or icon as well. (~8% of men have some colour blindness; this also covers the rouge/magenta pair, which is hard to distinguish for deuteranopes.)
- Focus rings use `cta` at 2px with a 2px offset, never removed.

---

## 6. Typography

Candidates were drawn from `ui-ux-pro-max`'s 74-pairing dataset; the choice follows the Luxe Considered rule *"preserve the relationship, shift the values."*

### The system

| Role | Typeface | Weights | Notes |
|---|---|---|---|
| **Display** | **Cormorant** | 300, 400, 500 | High-contrast old-style serif. Light weights signal confidence without aggression. Matches the packaging wordmark's serif register. |
| **Body** | **Montserrat** | 300, 400, 500, 600 | Geometric sans, highly legible at small sizes, broad Indian-market familiarity. |
| **Devanagari** | **Eczar** | 400, 500, 600 | **Required.** Verified against the Google Fonts dataset: Cormorant, Montserrat, Playfair Display and Inter support **no Devanagari subset**. Eczar is a Devanagari-first serif, so it holds the editorial register. |

Pairing rationale: serif display + sans body is the Luxe Considered relationship. Cormorant's high stroke contrast echoes the packaging wordmark; Montserrat keeps long-form ingredient copy readable, which matters for an audience that reads the back of the box.

**Fallback stack**
```css
--font-display: 'Cormorant', 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
--font-body: 'Montserrat', 'Segoe UI', system-ui, -apple-system, sans-serif;
--font-deva: 'Eczar', 'Noto Serif Devanagari', serif;
```

### Type scale

Editorial proportions — smaller hero, larger body than a typical SaaS scale.

| Step | Size / line-height | Face | Weight | Use |
|---|---|---|---|---|
| Display | 56px / 1.1 | Cormorant | 300 | Homepage hero only |
| H1 | 44px / 1.15 | Cormorant | 300 | Page titles |
| H2 | 32px / 1.2 | Cormorant | 400 | Section headings |
| H3 | 24px / 1.3 | Cormorant | 500 | Sub-sections |
| Body-lg | 20px / 1.6 | Montserrat | 300 | Story and editorial passages |
| Body | 17px / 1.65 | Montserrat | 400 | Default |
| Small | 14px / 1.5 | Montserrat | 400 | Captions, metadata |
| Micro | 12px / 1.4 | Montserrat | 500 | Legal, ingredient lists. Never below 12px |

Mobile: Display 36px, H1 30px, H2 25px, H3 20px. Body stays 17px — never scale body text down.

### Rules

- Letter-spacing: `-0.02em` on Cormorant display sizes; `0` on body; `+0.08em` on all-caps micro labels.
- Measure: 60–75 characters. Max content width 680px for reading passages.
- All-caps only for micro labels and the packaging wordmark. Never for headings or body.
- Never fake bold or italic — load the real weight.
- One display face and one body face per page. No third face outside Devanagari contexts.
- Never set body text in Cormorant below 20px; its high contrast makes small sizes fragile.

---

## 7. Visual language

**Core graphic device — the botanical line drawing.** The Velvet Lumière carton carries a fine line-art botanical (leaves and stems, single colour, engraved feel). This is the one existing element with genuine cross-line potential: it is already printed, reproduces at any scale as vector, works in a single colour, and expresses the botanical positioning without literal ingredient photography.

Usage: section dividers, page margins, an oversized watermark at 8–12% opacity behind story sections, category headers. Always single colour — `ink` on light grounds, `paper` on dark. Never full-colour, never as a background behind body text at above 12% opacity.

**Iconography** — outline, 1.5px stroke, 24×24 grid, rounded caps, single colour `ink`. Used for the product attribute marks already on packaging (cruelty-free, paraben-free, vegan, FDA, Vitamin E, Made in India). These exist as printed roundels; redraw as clean SVG at consistent stroke weight for web. **No emoji as icons, ever.**

**Shapes and layout**
- Asymmetric editorial compositions: 70/30 splits, text against a single dominant photograph.
- Vertical rhythm 96–144px between sections on desktop; 64px mobile.
- Corner radius: 2px on cards and buttons. Nearly square reads considered; heavy rounding reads playful and breaks the archetype.
- Buttons: solid `cta` fill with white text, or text-only with a 1px underline. No gradient fills, no shadows.
- Elevation: borders (`line`), not drop shadows.

**Motion**
- Durations: 200ms for micro-interactions, 300ms for reveals, 500ms for page transitions.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`. Cross-fades, not slides — the archetype calls for deliberate pacing.
- Only opacity and transform are animated (60fps; never width/height).
- `prefers-reduced-motion: reduce` disables all non-essential motion. Non-negotiable.

---

## 8. Imagery

**Direction, derived from the existing product photography** (`references/product photograph.jpg` — near-white `#F6F6F3` ground, soft daylight, tight crop).

| Dimension | Direction |
|---|---|
| Subject | Product first. Texture and swatch second. People third, and always Indian skin tones across a genuine range. |
| Lighting | Soft, directional daylight. A single visible light source. No ring light, no hard flash, no coloured gels. |
| Background | `paper` `#FCF2EE`, `paper-cool` `#F6F6F3`, or natural stone/linen. Never gradient, never seamless black. |
| Composition | Generous negative space. One subject. Off-centre placement. Full-bleed or near-full-bleed heroes — the image carries the page. |
| Colour grading | True to product. The shade in the photograph must match the shade shipped — a beauty brand's most damaging error is a swatch that lies. Slightly warm white balance. Never heavy filters. |
| Crop | Tight on texture; wide on context. Avoid mid-distance, which reads as catalogue stock. |
| Retouching | Remove dust and packaging defects. **Never** smooth skin texture, alter lip shape, or change shade. |

**Swatch photography** — every shade photographed on at least three skin tones spanning the actual range of Indian complexions, in identical lighting, same arm position, same crop. This is a formulation claim the brand makes ("shades that complement a wide range of skin tones") and the photography must substantiate it.

**Reject:** stock imagery of non-Indian models, "clean beauty" clichés (eucalyptus sprigs, marble slabs, water droplets on leaves), heavy skin retouching, product floating in gradient voids, lifestyle imagery unrelated to the product.

---

## 9. Brand voice

**Position:** Conversational tone, Companion relationship. Warm Conversational cadence inside a Luxe Considered structure.

### Attributes

1. **Warm, not gushing** — like a knowledgeable friend, not a brand having feelings at you.
2. **Precise** — specific ingredients, specific claims. Finance-trained rigour shows up as unwillingness to overstate.
3. **Unhurried** — complete sentences. No urgency manufacturing.
4. **Honest about limits** — "paraben conscious" and "dermatologically considered" are the real claims; do not inflate them to "dermatologist tested" or "100% natural."
5. **Quietly proud of its origin** — Indian heritage is stated plainly, not exoticised.

### Tone shifts by context

| Context | Tone |
|---|---|
| Homepage / story | Warmest. First person plural. The founder story lives here. |
| Product pages | Precise and factual. Warmth in the framing, rigour in the detail. |
| Ingredients | Most technical. Plain naming, honest function. No mysticism. |
| Errors / support | Plainest and most direct. Apologise once, then solve. |
| Legal / safety | Neutral and complete. Never softened for tone. |

### Vocabulary

**Use:** botanical, nourishing, comfortable, lightweight, pigment, formulated, considered, rooted, crafted, everyday, shade, texture.

**Avoid:** luxurious/exquisite/opulent *describing ourselves*, "game-changing," "must-have," "obsessed," "bestie," "girl," "flawless," "perfect," "anti-ageing," "chemical-free" (meaningless), "clean" without definition, "detox," "toxin."

**Never claim:** medical or therapeutic benefits, "chemical-free," "100% natural," "dermatologist tested" (unless a dermatologist actually tested it), or that a product treats any condition.

### Grammar and style

- First person plural ("we"), second person for the reader ("you"). Never third-person brand-speak ("Inoya Rouge believes...").
- Contractions are fine. Performed informality ("hey gorgeous!") is not.
- Sentence case for all headings. No Title Case, no ALL CAPS headings.
- Oxford comma. En-dashes for ranges. No exclamation marks in body copy.
- Indian English spelling: colour, flavour, moisturise, jewellery.
- Numerals for measurements (4.2 g, SPF 20+); words for counts under ten.

### Paired examples

These resolve the existing swing between "Swadeshi opulence" and "pigtails."

> **Don't:** "An exquisite tribute to Swadeshi opulence, delivering radiant colours that last for long graceful hours."
> **Do:** "Made with moringa and sunflower oils, so colour stays put and lips stay comfortable. Twelve hours, in our testing."

> **Don't:** "Beauty that's more than colour — it's confidence, creativity, and the art of self-expression!"
> **Do:** "Colour you can wear all day without thinking about it."

> **Don't:** "Our luxurious formula pampers your delicate lips with nature's finest botanical treasures."
> **Do:** "Castor oil and vitamin E, mostly. They keep lips from drying out."

> **Don't:** "Two childhood friends embarked on a magical journey to revolutionise Indian beauty."
> **Do:** "We met in school. We both ended up in finance. Neither of us stopped thinking about this."

> **Don't:** "Shop our stunning range now!"
> **Do:** "See the shades."

---

## 10. Packaging — documented as-is

Recorded as the state that exists. No changes proposed; all three are printed and in market.

| Line | Structure | Ground | Accent | Typography | Devices |
|---|---|---|---|---|---|
| **Velvet Lumière Lipstick** (4.2 g) | Tall rectangular carton | Lilac `#B6A4C4` | Deep plum `#3F3344` | Serif wordmark; humanist sans body | Botanical line-art; attribute roundels; QR |
| **Zyra Aura Matte Lipglow** (3 g) | Slim tall carton | Blush `#CAABA4` gradient to white | Rose `#AC3B46`; rose-gold foil | Serif wordmark; sans body | Butterfly + swirl foil motif; attribute roundels |
| **Nuage Tint** (4.2 g) | Tall rectangular carton | Sage `#99B48F` | Magenta `#9A254D`; yellow `#DAD016` | Script name; sans body | Lipstick illustration; floral and heart doodles |

**Shared elements:** the daisy + INOYA ROUGE lockup, the seven attribute roundels (cruelty-free, paraben-free, FDA, Vitamin E, vegan, Made in India, no animal testing), ingredient list, and statutory manufacturer/marketer panel.

**Consistency note (observation, not an action):** the three cartons share only the lockup and the roundels. Ground colour, accent, typography, and illustration style differ across all three; Nuage Tint additionally uses a script name and a different illustration register. The website compensates by isolating each line to its own pages (§5).

---

## 11. Applications & guidelines

**Website** — governed by §12.

**Social media** — avatar is the daisy on `paper` at ≥64px; never the full lockup (illegible at avatar size). Grid alternates product-on-paper, botanical line-art, and text-on-paper cards. One line's palette per post.

**Business cards / stationery** — `paper` stock, `ink` type, full lockup, IR monogram blind-embossed or foiled on the reverse.

**Email** — `paper` background, `ink` text, single `cta` button. Logo at 160px. Body 16px minimum.

### Dos and don'ts

**Do**
- Let the layout breathe — whitespace is the archetype
- Lead with one strong photograph
- Name specific ingredients and their function
- Use the IR monogram wherever the daisy would fall below 64px
- Check contrast before shipping any new colour pairing
- Keep one product line's palette per page

**Don't**
- Use `rouge` `#E53059` for body text or as a white-text button — it fails AA
- Render the full-colour daisy below 64px
- Mix two product-line palettes on one page
- Use pure white as the dominant page background
- Add urgency mechanics — countdowns, spin-to-win, "only 2 left!"
- Claim medical benefits or "chemical-free"
- Set body copy in Cormorant below 20px

---

## 12. Web token layer

### CSS custom properties

```css
:root {
  /* Neutrals — ~80% of surface area */
  --color-paper:        #FCF2EE;
  --color-paper-cool:   #F6F6F3;
  --color-white:        #FFFFFF;
  --color-line:         #E8DDD8;

  /* Ink */
  --color-ink:          #3F3344;  /* 10.79:1 on paper — body text */
  --color-ink-soft:     #613E43;  /*  8.37:1 on paper — secondary */
  --color-ink-deep:     #251218;  /* 16.19:1 on paper — max contrast */

  /* Brand & action */
  --color-rouge:        #E53059;  /* ACCENT ONLY — 4.29:1, fails AA for text */
  --color-cta:          #9A254D;  /* 7.65:1 with white text — buttons/links */
  --color-cta-hover:    #7D1D3E;
  --color-leaf:         #358646;  /* 4.52:1 — botanical accent, success */

  /* Semantic */
  --color-success:      #358646;
  --color-error:        #AC3B46;
  --color-focus:        #9A254D;

  /* Product lines — scoped to their own pages */
  --vl-primary: #8E7698;  --vl-tint: #B6A4C4;  --vl-deep: #3F3344;
  --za-primary: #CAABA4;  --za-metal: #B98874; --za-deep: #AC3B46;
  --nt-primary: #99B48F;  --nt-accent: #DAD016; --nt-deep: #9A254D;

  /* Type */
  --font-display: 'Cormorant', 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Montserrat', 'Segoe UI', system-ui, sans-serif;
  --font-deva:    'Eczar', 'Noto Serif Devanagari', serif;

  --text-display: 3.5rem;   /* 56 */
  --text-h1:      2.75rem;  /* 44 */
  --text-h2:      2rem;     /* 32 */
  --text-h3:      1.5rem;   /* 24 */
  --text-body-lg: 1.25rem;  /* 20 */
  --text-body:    1.0625rem;/* 17 */
  --text-small:   0.875rem; /* 14 */
  --text-micro:   0.75rem;  /* 12 — floor */

  /* Spacing — 8px base */
  --space-1: 0.5rem;  --space-2: 1rem;   --space-3: 1.5rem;
  --space-4: 2rem;    --space-6: 3rem;   --space-8: 4rem;
  --space-12: 6rem;   --space-16: 8rem;  --space-18: 9rem;

  /* Structure */
  --measure: 42rem;          /* 680px reading width */
  --container: 75rem;        /* 1200px */
  --radius: 2px;
  --border: 1px solid var(--color-line);

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 200ms; --dur-mid: 300ms; --dur-slow: 500ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Breakpoints: 375 / 768 / 1024 / 1440.

### Component direction

- **Buttons** — primary: `--color-cta` fill, white text, 2px radius, 14px/28px padding. Secondary: 1px `ink` border, transparent fill. Tertiary: text with 1px underline. No gradients, no shadows. Minimum touch target 44×44px.
- **Cards** — `white` on `paper`, 1px `line` border, no shadow, 2px radius.
- **Nav** — sticky, `paper` background, 1px bottom border on scroll. Lockup left at 140px. Mobile: wordmark only + hamburger.
- **Product card** — image on `paper-cool` (square), name in Cormorant 24px, shade swatches as 20px circles with accessible name labels beneath (never colour alone), price in Montserrat 17px.
- **Forms** — visible labels above inputs, never placeholder-only. Errors beside the field, not only at the top. 2px `cta` focus ring with 2px offset.
- **Footer** — `ink` background, `paper` text, botanical line-art watermark at 8% opacity.

### Sitemap

```
/                          Home — hero, story teaser, featured line, promise
/shop                      All products (master neutrals only)
  /shop/velvet-lumiere     Lipstick — VL sub-palette
  /shop/zyra-aura          Matte lipglow — ZA sub-palette
  /shop/nuage-tint         Lip tint — NT sub-palette
  /shop/[product]/[shade]  Shade detail — swatches on 3+ skin tones
/about                     Our story — the founder narrative, warmest voice
  /about/promise           Clean beauty promise
  /about/ingredients       Indian botanicals, plainly explained
/shades                    Shade finder across all lines
/journal                   Editorial content
/help                      FAQ, shipping, returns, contact
/legal/{privacy,terms,shipping,returns}
```

Nav: **Shop · Shades · About · Journal** with cart and search. Products live under one `/shop` parent so line palettes stay scoped and new lines slot in without restructuring.

---

# Appendix A — Future-state redesign

> ## ⛔ NOT ACTIONABLE
> **Nothing in this appendix may be implemented.** All packaging and logo artwork is printed and paid for, and is fixed. This section exists only as direction for a future reprint cycle, if one ever happens. Sections 1–12 are the operative document. **The website must be built against §1–12, not against this appendix.**

Recorded because the constraints found while writing §4 and §5 are worth having on file when the question next comes up.

### A1. What the logo would need

The daisy concept is sound — the silhouette test passed, which means the shape is distinctive and the IR reads in a single colour. The execution is what fails. A corrected version would:

1. **Be redrawn as vector (SVG).** The single highest-value fix. Resolution-independent, single-colour capable, tiny file.
2. **Reduce to 3–4 flat colours** from 4,206 — the favicon ceiling. Petals in two rouge tones rather than a five-colour gradient blend.
3. **Simplify petal count and increase stroke weight** so nothing falls below 2px at small sizes.
4. **Ship as a graded asset family:** full lockup → daisy alone → IR monogram → 16px favicon glyph, each drawn for its size rather than downscaled.
5. **Enlarge the IR monogram** relative to the flower head so it survives to ~32px.
6. **Document a construction grid** — petal angles, stroke weights, optical centre.

### A2. What the colour system would need

1. **Shift the rouge to pass AA.** `#E53059` at 4.29:1 must darken to carry text or act as a button. Holding the same hue (346°) and saturation, the computed options are **`#DE2F56` at 4.52:1** (the exact point it clears AA — too tight a margin to rely on) or **`#C5294D` at 5.53:1** (recommended; comfortable margin, still unmistakably the brand rouge). Both verified with the same WCAG calculation used throughout this document.
2. **Unify the three product grounds into one family.** Currently lilac, blush and sage share no common hue, value, or temperature. One ground (the `paper` cream) with lines differentiated by a single accent band would read as one brand on a shelf. Today they read as three brands.
3. **Standardise the wordmark treatment** — Nuage Tint's script name breaks a system the other two follow.
4. **Standardise the illustration register** — botanical line-art on one carton, butterflies on another, cartoon lipstick and heart doodles on the third.
5. **Commit to one archetype lane.** The packaging is Vibrant Saturated; the brand narrative is Luxe Considered. `brand-archetype-system` is explicit that doing two reads as confused.

### A3. Why it cannot happen now

Printed stock exists in market for all three lines. Repackaging means discarding paid inventory and re-running regulatory panels (M.L. number, manufacturer, marketer, batch fields). The website absorbs the inconsistency instead, via the neutral canvas and scoped sub-palettes in §5 — containment, not resolution. Real resolution requires a reprint.

---

## Provenance

Built with locally installed skills (see `.claude/skills/SKILLS-PROVENANCE.md`): `creative-direction`, `brand-archetype-system`, `brand-discovery`, `brand-ideation`, `logo-design`, `brand-identity`, `brand-voice`, `art-direction`, `design-standards`, `information-architecture`, `brand-style-guide`, `ui-ux-pro-max`.

Colour values measured from `references/` with ImageMagick. Contrast ratios computed per WCAG 2.1 relative-luminance. Logo small-size behaviour verified by rendering at 16px and 32px. Font script coverage verified against the Google Fonts dataset in `ui-ux-pro-max/data/