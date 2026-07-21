# Plan: Add to Order & In-App Checkout for La Bomba

## Goal
Let customers add menu items — including extras/sides as add-ons — to a cart, review it, and complete an in-app checkout. Items without prices still appear in the cart but are not charged online until prices are set.

## What you already answered
- **Checkout method:** In-app payment (Stripe).
- **Missing prices:** Show items without prices; do not block them.
- **Customization:** Extras and sides as add-ons.
- **Pickup/delivery:** Both options.

## Implementation plan

### 1. Backend setup: Lovable Cloud + Stripe
- Enable Lovable Cloud (Supabase) so orders can be persisted securely.
- Enable Lovable’s built-in Stripe payments for one-time checkout.

### 2. Data model
Create two tables:

```text
orders
  id uuid
  secret_token uuid (used for public order lookup)
  customer_name text
  phone text
  email text
  order_type text (pickup | delivery)
  delivery_address text
  status text (pending | paid | confirmed | cancelled)
  payment_status text (unpaid | paid | failed)
  total_cents integer
  stripe_session_id text
  created_at timestamp

order_items
  id uuid
  order_id uuid -> orders(id)
  menu_item_id text
  name text
  category text
  quantity integer
  unit_price_cents integer
  note text
  parent_item_id uuid -> order_items(id) (for extras/sides attached to a main item)
  created_at timestamp
```

- Add `GRANT` statements and `RLS` policies for each table.
- Orders are created by a server function using the service-role client, so anonymous/guest customers can place an order without signing in.

### 3. Cart state (client-side)
- Add a stable `id` to every menu item in `src/components/labomba/data.ts`.
- Create `OrderProvider` (React context) in the root layout so cart is available on `/` and `/menu`.
- Cart holds line items with `quantity`, optional `note`, and nested `addOns` (extras/sides).
- Persist cart to `localStorage` and rehydrate only after mount to avoid SSR mismatch.

### 4. Menu UI updates
- Add an **“Add to order”** button on every menu item card.
- Clicking opens a small modal/drawer where customers can:
  - Increase/decrease quantity.
  - Add a note.
  - Add extras/sides from the existing **Extras & Sides** category as add-ons.
- Add a floating cart button with item count and subtotal.
- The cart opens as a slide-out drawer:
  - Adjust quantities or remove items.
  - Edit notes.
  - Add more extras/sides to any line item.
  - Show the subtotal and a **Checkout** button.

### 5. Checkout flow
- Create a new route: `/checkout`.
- Form fields (validated with Zod):
  - Name, phone, email.
  - Order type: Pickup or Delivery.
  - Delivery address (required only when delivery is selected).
- Server function `createOrderAndCheckout`:
  - Validates the input.
  - Inserts the order and items into Supabase using the service-role client.
  - Creates a Stripe Checkout session with only priced items.
  - Stores the `stripe_session_id` on the order.
  - Returns the Stripe checkout URL.
- Client redirects the customer to Stripe.
- After payment, Stripe redirects to `/order/confirmed`.
- Create a public server route `/api/public/stripe-webhook` to listen for Stripe events and update the order status to `paid`.

### 6. Handling items without prices
- Items without a price are listed in the cart and order but show **“Price not set”**.
- They are excluded from the Stripe total and subtotal.
- If any item in the cart lacks a price, the checkout button is replaced by a **“Call to order”** summary that dials the restaurant and includes the full order text.
- Once prices are added to the data, those items become payable online automatically.

### 7. Security & validation
- Zod schemas on both client and server.
- Server-side order creation only; no Supabase service keys are sent to the browser.
- Stripe webhook signature verified with a secret stored in Lovable Cloud.
- Phone numbers and addresses are trimmed and length-limited.

### 8. UI polish
- Keep the existing dark, fiery La Bomba branding (ember/blaze accents, flame gradients, rounded cards).
- Empty-cart, error, and confirmation states.
- Fully responsive on mobile and desktop.

## Deliverables after approval
- Updated `src/components/labomba/data.ts` with stable IDs.
- New `src/lib/order-context.tsx` (cart provider).
- Updated `src/components/labomba/Menu.tsx` with add-to-order buttons and customizer.
- New cart drawer and floating cart button.
- New `/checkout` and `/order/confirmed` routes.
- New `src/lib/orders.functions.ts` server functions.
- New `src/routes/api/public/stripe-webhook.ts` server route.
- Supabase migration for `orders` and `order_items` tables.

Once you approve this plan, I’ll enable the backend and start implementing the cart first.