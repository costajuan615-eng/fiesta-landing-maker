# Short-lived, signed order access

Today an order is readable by anyone holding its `secret_token`, forever: the browser sends the raw token as a request header and the database returns the order. A leaked token (logs, shared device, screenshot) never expires.

## Goal

Replace the permanent raw token with a short-lived signed pass that the server issues and verifies, so a leaked value stops working quickly and the database is never reachable with it directly.

## How it works

```text
checkout  -> server creates order, returns a signed pass (order code + expiry + signature)
browser   -> stores the pass, asks the server for the order
server    -> checks signature + expiry, reads the order, returns it
```

- The pass is signed with a server-only signing key, carries the order code and an expiry (60 minutes), and cannot be forged or edited.
- Every read goes through the server. The browser no longer talks to the database about orders at all.
- While a pass is still valid, each successful read returns a freshly extended pass (sliding window), so a customer keeping the page open stays in. Once it expires, the page shows "this link has expired" with the order code and the phone number to call.
- The stored `secret_token` stays in the database as the order's internal identity, but is never sent to the browser again.

## Changes

Database (one migration):
- Drop the token-header read rules on `orders` and `order_items` and the `current_order_token()` / `order_matches_token()` helpers.
- Revoke read access for the anonymous and signed-in roles on both tables; only the server role can read them.

Secret:
- Generate a signing key (`ORDER_ACCESS_SIGNING_KEY`) stored server-side; never revealed to the browser.

App:
- `src/lib/order-access.server.ts`: HMAC-SHA256 sign/verify of `orderCode.expiry`, base64url, constant-time compare, 60-minute TTL.
- `src/lib/orders.functions.ts`: `submitOrder` returns `{ order_code, access_pass }` instead of `secret_token`; new `getOrder` server function takes `{ order_code, access_pass }`, verifies it, reads order + items with the admin client inside the handler, and returns the order plus a refreshed pass.
- `src/routes/checkout.tsx`: store `access_pass` in `sessionStorage` (key `labomba.order.pass.<code>`) instead of the token.
- `src/routes/order.$code.tsx`: call `getOrder` instead of the direct Supabase client; save the refreshed pass; render an expired state when verification fails; keep the existing cached-snapshot fallback for the immediate post-checkout view.
- Delete `src/lib/order-token-client.ts` (no longer used).

## Out of scope

- No customer sign-in or accounts.
- No emailed re-access link for expired passes (can be added later).
