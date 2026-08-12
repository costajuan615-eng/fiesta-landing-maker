# Move order submission to the server

Today the checkout page sends item names, quantities, and the subtotal straight into the database, so anyone could submit an order with fabricated totals. Submission moves to the server, which recomputes everything from the real menu.

## How it works

- New server function `submitOrder` accepts only: customer name, phone, email, order type, delivery address, notes, and a list of `{ itemId, quantity, note, addOns: [{ id, quantity }] }`.
- The server looks up every id in the real menu list (the same `data.ts` the site renders from), rejects unknown ids, clamps each quantity to 1-50, and computes unit prices, line totals, and the subtotal itself. Prices and totals claimed by the browser are ignored entirely.
- The server generates the order code and the secret token, inserts the order and its line items (add-ons linked to their parent line), and returns `{ order_code, secret_token }`.
- Checkout keeps the exact same form and UX — it just calls this function instead of writing to the database. The on-screen summary keeps using local prices for display only.
- Because the browser no longer writes orders, the guest insert rules on `orders` and `order_items` are removed in a migration. Read access via the secret-token header is unchanged, so the confirmation page keeps working.

## Technical notes

- `src/lib/orders.functions.ts`: `createServerFn({ method: 'POST' })` with a Zod validator; imports the menu from `@/components/labomba/data` plus `getMenuItemId`/`priceToCents` from `@/lib/order-context` for pricing; loads `@/integrations/supabase/client.server` inside the handler for the privileged insert.
- Migration: drop the `Submit an order with its secret token` and `Add items to own order via secret token` INSERT policies. SELECT policies and `current_order_token()` untouched.
- `src/routes/checkout.tsx`: replace the direct Supabase inserts with `useServerFn(submitOrder)`; keep `sessionStorage` token storage and navigation to `/order/$code`.
- `src/lib/order-token-client.ts` stays, now used for reads only.
- Afterwards, mark the `order_price_tamper` finding as fixed.
