# SEO crawlability audit and fixes

## What I found

Your site is **not** an empty JavaScript shell. This project runs on TanStack Start with server-side rendering already enabled, and I verified the raw HTML that a crawler receives (no JavaScript executed):

- `/` returns ~61 KB of real HTML with the `<title>`, meta description, Open Graph tags, the `<h1>` ("Explosive Mexican flavor"), the info bar, the full menu, reviews, visit details, footer links, and Restaurant JSON-LD.
- `/menu` returns ~38 KB of real HTML with its own title, description, `<h1>`, gallery images and the full menu list.
- Deep URLs work directly — no need to visit the homepage first.

So the core requirement (server-rendered, crawlable HTML per route) is already met. What is genuinely missing is discovery and metadata hygiene.

## Real gaps to fix

1. **No `/robots.txt`** — returns 404 today.
2. **No `/sitemap.xml`** — returns 404 today, so nothing advertises the indexable URLs.
3. **Relative canonicals** — `/` and `/menu` use `href="/"` and `href="/menu"`. Absolute URLs are safer for crawlers and social platforms.
4. **No `og:url`** on either public page.
5. **Homepage has no `og:image` / `twitter:image`**, so shared links have no preview art (the menu page already sets one).
6. **Structured data can be richer** — add a BreadcrumbList on `/menu`, and add the menu URL plus image to the homepage Restaurant schema.
7. **Private routes**: `/checkout` and `/order/$code` already carry `robots: noindex` — correct, no change needed beyond confirming they stay out of the sitemap.

## What I will change

- **`public/robots.txt`** (new): allow all crawlers, disallow `/checkout` and `/order/`, plus a `Sitemap:` line.
- **`src/routes/sitemap[.]xml.ts`** (new): a server route emitting XML for the two indexable URLs (`/`, `/menu`) with `changefreq`/`priority`, no fabricated `lastmod` values.
- **`src/routes/index.tsx`**: absolute canonical, add `og:url`, `og:image` + `twitter:image` using the hero image, extend the Restaurant JSON-LD with `url`, `image`, and `hasMenu`.
- **`src/routes/menu.tsx`**: absolute canonical, add `og:url`, `twitter:image`, and a BreadcrumbList JSON-LD.

No rendering-strategy rewrite, no new dependencies, no duplicate/hidden content — the app already server-renders and I will not touch component logic or the order flow.

## Verification

I will re-request each route with plain `curl` (no JavaScript) and confirm in the raw bytes: title, meta description, absolute canonical, `og:*`/`twitter:*`, `<h1>`, body copy, internal links, and JSON-LD; plus `200` responses with correct content types for `/robots.txt` and `/sitemap.xml`, and `noindex` present on `/checkout` and `/order/TEST`.

## Report

I will finish with a short report covering why the "empty shell" diagnosis did not apply here, the rendering strategy in use (SSR via TanStack Start on the Cloudflare Worker runtime), which routes are crawlable, the raw-HTML evidence, and remaining limits (the order confirmation page stays client-fetched by design — it is token-gated and intentionally noindexed).
