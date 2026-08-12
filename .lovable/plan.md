# Harden order submission and access

Three warnings came out of the security scan. Two need real changes; one is informational and just needs to stay the way it is.

## 1. Prices are trusted from the browser (must fix)

Today the checkout page sends item names, quantities, and the subtotal straight into the database, so anyone could submit an order claiming a $0.01 total.

Fix: move order submission to the server.

- New server function `submitOrder` that takes only: customer details, order type, address/notes, and a list of `{ itemId, quantity, note, addOns: [{ id, quantity }] }`.
- The server looks every item up in the real menu list (the same `data.ts` the site renders from), rejects unknown ids, clamps quantity to 1-50, and computes each unit price and the subtotal itself. Anything the browser claims about price or totals is ignored.
- The server also generates the order code and the secret token, inserts the order and its items, and returns `{ order_code, secret_token }`.
- Checkout page keeps the same form and UX, just calls this function instead of writing to the database directly. The on-screen summary still uses local prices for display only.

Because writes now happen server-side, the guest insert rules on `orders` and `order_items` get removed in a migration — the browser can no longer insert orders at all.

## 2. Token-only order access (reduce exposure)

Keeping the token approach — there is no customer login on this site, and adding one is a bigger product change. What changes:

- The token is created server-side (never guessable from anything visible), stays out of the URL, and is only ever sent as a request header over HTTPS.
- Add `<meta name="referrer" content="strict-origin-when-cross-origin">` so the confirmation page never leaks anything through referrer headers.
- Read access stays exactly as it is: header token must match the order's own token.

If you would rather customers sign in to see their orders, say so and I'll plan that instead.

## 3. No update/delete rules (no change needed)

This one is a note, not a hole: nobody can edit or delete orders from the browser, which is the correct state. Any future staff/status tooling should go through server-side code, not client rules. Nothing to change now.

## Technical notes

- `src/lib/orders.functions.ts`: `createServerFn({ method: 'POST' })` with a Zod validator; imports the menu from `@/components/labomba/data` for pricing, loads `@/integrations/supabase/client.server` inside the handler for the privileged insert.
- Migration: drop `Submit an order with its secret token` and `Add items to own order via secret token` INSERT policies; SELECT policies and `current_order_token()` untouched.
- `src/routes/checkout.tsx`: replace the direct inserts with `useServerFn(submitOrder)`; keep `sessionStorage` token storage and navigation to `/order/$code`.
- `src/lib/order-token-client.ts` stays for reads only.
- Afterwards, mark `order_price_tamper` fixed and record the token-access rationale in security memory.
