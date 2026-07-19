# La Bomba LLC — Landing Page + Redesigned Logo

Bold, appetite-forward single-page site for La Bomba LLC — former food truck, now brick-and-mortar in El Paso, TX serving birria, asada, pastor, and carnitas. Visual direction pulled from your logo: charcoal bomb, fiery red/orange blast, golden-yellow glow, teal drip accent, graffiti-style wordmark — refined and web-legible.

## Redesigned logo
- Same concept: cartoon bomb + lit fuse blast + "LA BOMBA" wordmark.
- Same palette (charcoal, red/orange, yellow halo, teal drip).
- Cleaner linework, tighter shading, more legible graffiti wordmark, transparent background.
- Generated as PNG, wired in as the site logo and favicon (default `public/favicon.ico` deleted).
- Plus one wide, on-brand hero background image (smoky/spicy street-food vibe).

## Page sections (single route `/`)
1. **Hero** — Logo, tagline: "Bomb birria, asada, pastor & carnitas — El Paso, TX 💣🔥", 4.8★ (500+ ratings) badge, DashPass chip, CTAs: Call, Order on DoorDash, Directions.
2. **Quick info bar** — Food Truck → Brick & Mortar · Mexican · $$ · Open 11:00 AM – 9:55 PM · 1793 N Zaragoza Rd, El Paso, TX 79936 · (915) 308-2878.
3. **About** — "Former food truck now brick and mortar restaurant serving bomb birria, asada, pastor and carnitas in EP, TX."
4. **Most Ordered** — Grid of signature items (name + description; prices only where you provided them):
   - Taco Sampler
   - Taco Order (4)
   - Taco Plate (3) — 3 tacos + rice & beans, with cilantro/onion/radish/lime/salsa
   - Mulitas (2) — stacked corn tortillas with cheese + protein
   - Quesadillas — 12" flour, cut into 3
   - Burrito Supreme — 12" flour w/ beans, cheese, rice, meat, pico, jalapeño, sour cream
   - Loaded Nachos — tostadas + in-house nacho cheese, beans, meat, pico, jalapeño, sour cream
   - Loaded Fries — waffle fries + nacho cheese, meat, pico, jalapeño, sour cream
   - Tortas — Mexican torta bread + meat (loaded upgrade available)
   - Grilled Cheese — Texas toast + American cheese + protein
   - Birria Ramen
5. **Menu categories** — Compact section listing: Dessert · Drinks (Agua Fresca) · Kids Meal.
6. **Extras & Sides** (with prices) —
   - Beans — $4.00
   - Guacamole (1.5 oz cup) — $1.00 · 100% (9)
   - Corn Tortillas (2) — $2.00
   - 8 oz Consomé — $4.00 · 81% (11)
   - Condiments (lime, salsa, onion, cilantro, radishes) — $1.00 · 95% (23) · #2 Most Liked
7. **Reviews** — 4.8/5 badge, "500+ ratings · 50+ public reviews", 5 real review cards (Elaine G, Leticia G, Andrew S, Cole F, Nicole B) with date and DoorDash source. Andrew's long review truncated with "Read more".
8. **Visit us** — Address, phone (tel: link), hours 11:00 AM – 9:55 PM, embedded Google Maps iframe, Order-on-DoorDash CTA.
9. **Footer** — Business name, "Former food truck, now brick & mortar," copyright, small nav.

## Design system
- Update `src/styles.css` semantic tokens to a warm dark theme: charcoal background, cream foreground, fiery red primary, golden-yellow accent, teal highlight. All colors in `oklch` via semantic tokens — no hardcoded hex/utility colors in components.
- Typography: bold display font for headings (e.g. Bebas Neue / Archivo Black — graffiti-adjacent but readable), clean sans for body (Work Sans / Inter). Loaded via `<link>` in `__root.tsx` head.
- Subtle grain + spark texture accents, glowing button hover states. No purple/indigo AI defaults.

## SEO / head
- `__root.tsx`: title "La Bomba LLC — Birria, Asada, Pastor & Carnitas · El Paso, TX", matching meta description, og/twitter tags.
- Restaurant JSON-LD: name, address, phone, hours, priceRange `$$`, servesCuisine `Mexican`, aggregateRating 4.8 / 500+.
- Replace favicon with new logo mark; delete default `public/favicon.ico`.

## Technical notes
- Rewrite `src/routes/index.tsx` (replaces the placeholder — this IS the index page).
- New components under `src/components/labomba/`: `Hero`, `InfoBar`, `About`, `MostOrdered`, `ExtrasSides`, `Reviews`, `Visit`, `Footer`.
- Menu items + reviews + sides live in a typed data file (`src/components/labomba/data.ts`) so cards render from one source.
- Logo + hero image via imagegen, stored under `src/assets/`.
- No backend needed — static content; `tel:`, DoorDash link, and Google Maps link handle actions.

## What I will NOT do without confirmation
- Add ordering/reservations directly on the site (DoorDash link only).
- Invent prices for items you didn't provide prices for — those show name + description only.
- Add reviews beyond the 5 you shared.
