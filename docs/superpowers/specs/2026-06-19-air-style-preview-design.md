# The Nail — Air-Style Preview Design

## Objective

Create a standalone test page that closely reproduces the layout language,
interaction rhythm, responsive behavior, and atmospheric visual treatment of
the current `air.inc` homepage, while replacing its product content with the
approved The Nail brand content.

The preview must not modify or replace the production `index.html`.

## Deliverable

- New standalone file: `air-style-preview.html`
- Vanilla HTML, CSS, and JavaScript in one file
- Existing `index.html` and production behavior remain untouched
- Existing The Nail image URLs, business details, prices, slogans, and contact
  links are reused
- No build step, framework, analytics, cookie banner, or data storage

## Reference Hierarchy

1. `https://air.inc/` is the visual and interaction reference.
2. The Refero Air style page supplies implementation tokens and design rules.
3. The Nail project files are authoritative for business content and imagery.

The implementation will recreate the reference experience without copying
Air's source code, logo, product UI, or proprietary media. Atmospheric cloud
and translucent-glass visuals will be recreated with original CSS, SVG,
canvas, gradients, or newly produced local assets.

## Visual System

### Color and surfaces

- Sky-canvas blue is the dominant full-page atmosphere.
- White and translucent frosted-glass surfaces provide content contrast.
- A single vivid blue is reserved for interactive outlines and active states.
- Shadows remain minimal; blur, borders, opacity, and surface color establish
  depth.

### Typography

- Functional text uses a clean grotesk/sans-serif substitute.
- Hero display text uses an extremely large compressed face.
- Select editorial phrases use an expressive cursive face.
- Type scales fluidly with `clamp()` and preserves the oversized Air-like
  composition without causing horizontal overflow.

### Shape and spacing

- Rounded image and feature surfaces use approximately 11–14px radii.
- Buttons use compact outlined treatments and 8px or pill radii.
- Sections are full-bleed with large breathing room and controlled inner grids.

## Page Architecture

### 1. Persistent navigation

An Air-like transparent/frosted navigation sits over the opening scene.

- Logo: The Nail
- Links: Mẫu nail, Dịch vụ, Bảng giá, Về tiệm
- Utility action: Instagram
- Primary action: Đặt lịch
- Mobile: compact logo, booking action, and menu drawer

### 2. Full-screen atmospheric hero

The opening composition stays deliberately close to Air:

- Blue sky and large soft clouds
- Translucent tubular/glass forms moving through the scene
- Oversized `THE NAIL` display treatment
- Brand line: `your concept, my creation`
- Vietnamese slogan: `Ý tưởng bạn trao — Nghệ thuật tôi tạo`
- Outlined actions for booking and viewing nail work

The hero uses layered depth, slow autonomous movement, pointer parallax on
capable desktop devices, and a lighter static composition on mobile.

### 3. Organize / Approve / Multiply-style selector

Air's three-state product selector is adapted to The Nail:

- Khám phá
- Chọn mẫu
- Đặt lịch

Each state updates the accompanying image composition and short explanatory
copy. This creates an Air-like interaction while describing the actual salon
journey.

### 4. Creative gallery narrative

The product-feature storytelling becomes a nail-art gallery:

- Large editorial heading
- Filterable price tiers already used by The Nail
- Clean nail images with no text or price overlay
- Alternating large imagery and frosted information surfaces
- Air-like reveal, scale, and crossfade transitions
- Lightbox remains image-only

### 5. Service intelligence section

Air's feature tabs and product panels become service categories:

- Chăm sóc nền móng
- Gel & hiệu ứng
- Vẽ design thủ công
- Nối và tạo phom

Each category contains real The Nail service descriptions and price ranges.
Panels animate on selection with restrained blur, opacity, and vertical motion.

### 6. Brand values and salon story

Air's large feature blocks are mapped to the fixed brand values:

- Cá nhân hoá
- Sáng tạo
- Tỉ mỉ

The section retains large alternating typography, expansive sky surfaces, and
scroll-linked image movement.

### 7. Price overview

The current service prices are preserved and presented in an Air-like modular
grid. Pricing will not be invented or changed. The section directs uncertain
customers to send a reference image through Zalo.

### 8. Booking conversion section

Air's final lead form becomes a booking inquiry:

- Customer name
- Phone number
- Preferred date/time
- Service or price tier
- Optional request

Submitting does not store information. It composes the current message and
opens the existing Zalo contact.

### 9. Contact and footer

- Correct address, phone number, opening hours, and social links
- Large Air-like closing statement
- Compact footer navigation
- Mobile sticky booking action

## Motion System

- Native scrolling only; no scroll hijacking
- `requestAnimationFrame` for scroll-linked transforms
- Intersection Observer for section and text reveals
- Layered hero parallax and gentle glass-object drift
- Tab content crossfades
- Gallery cards reveal through clipping and scale
- Navigation changes surface treatment after leaving the hero
- Buttons use subtle magnetic or pointer-follow behavior on fine pointers only
- `prefers-reduced-motion: reduce` disables autonomous and scroll-linked motion
- Touch devices receive reduced effects and no cursor-dependent interactions

Motion should feel soft and spatial. It must not reproduce animations by
extracting Air's code; timing and easing will be recreated from observation.

## Responsive Behavior

- Mobile-first content and booking flow
- Hero remains visually complete on a small phone without hiding the CTA
- Oversized display text scales down safely
- Heavy atmospheric layers are simplified below 700px
- Gallery: two columns on common phones, one column only when necessary
- Service panels and pricing stack vertically
- Tap targets are at least 44px
- No hover-only access to content

## Content Rules

- Preserve the approved slogans and three brand values verbatim.
- Preserve the current address, phone, hours, social handles, and price ranges.
- Preserve the rule that nail images contain no text or price overlays.
- Do not add fabricated reviews, offers, discounts, or business claims.
- Vietnamese is the primary language; existing short English brand phrases may
  remain where already approved.

## Technical Boundaries

- Single standalone HTML file with inline CSS and JavaScript
- Reuse the current public Google image URLs
- Local SVG/CSS/canvas may be used for original atmospheric graphics
- External font requests are allowed only where already consistent with this
  static project; robust fallback fonts are required
- No GSAP, Lenis, React, Vue, Tailwind, npm, or build tooling
- No changes to production files during preview implementation

## Verification

The preview will be checked at:

- Desktop: 1440×900 and 1280×720
- Tablet: 768×1024
- Mobile: 390×844 and 375×667

Acceptance checks:

- No console errors
- All navigation, tabs, gallery filters, lightbox, menu, and booking actions work
- Zalo and social links use the existing destinations
- No horizontal overflow
- Reduced-motion mode remains usable
- Images lazy-load below the fold
- Existing production `index.html` is unchanged
- The page communicates The Nail content while visibly matching Air's overall
  layout, atmosphere, component language, and motion character

## Out of Scope

- Replacing the production homepage
- Deploying or pushing the preview
- Copying Air source code or proprietary assets
- Backend booking storage
- New pricing, reviews, promotions, or business claims
- Additional pages or a framework migration
