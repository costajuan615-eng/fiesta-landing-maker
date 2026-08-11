# Let customers view their own order (and nothing else)

Right now orders and order items can only be created — nothing can be read back. The confirmation page falls back to whatever was cached in the browser, and the insert already asks for the order code and secret token back, which read rules currently block.

## Goal

Allow reading exactly one order and its items when the request presents that order's secret token. All other orders stay invisible.

## How it works

Every order already gets a random `secret_token` when it is created. The customer's browser keeps that token and sends it along as a request header when it looks up the order. The database only returns rows whose token matches.

```text
browser  --(order code + secret token header)-->  database
database --(only the matching order + its items)--> browser
```

## Database changes (one migration)

- Read access for the anonymous and signed-in roles on `orders` and `order_items`.
- A read rule on `orders`: the row's `secret_token` must equal the token supplied in the request header.
- A small security-definer helper that checks whether a given order id belongs to the token in the request header, used by the read rule on `order_items` (avoids a recursive lookup).
- No change to the existing create rules.

Technical notes: policies read the token via `current_setting('request.headers', true)::json ->> 'x-order-token'`; `GRANT SELECT` is added for `anon`, `authenticated`, plus `ALL` for `service_role`.

## App changes

- Add a small helper that creates a Supabase client carrying the `x-order-token` header for a given token.
- Checkout: keep storing the returned `secret_token` (in `sessionStorage`, alongside the existing snapshot) after submitting.
- `/order/$code`: if a token is stored, fetch the live order plus its items with the token-bearing client and render real data; otherwise fall back to the cached snapshot exactly as today.

## Out of scope

- No staff/admin dashboard, no order editing, no auth.
