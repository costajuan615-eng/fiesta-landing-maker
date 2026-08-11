DROP POLICY IF EXISTS "Read own order items via secret token" ON public.order_items;
CREATE POLICY "Read own order items via secret token"
ON public.order_items FOR SELECT TO anon, authenticated
USING (
  public.current_order_token() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.secret_token = public.current_order_token()
  )
);

DROP POLICY IF EXISTS "Anyone can submit an order" ON public.orders;
CREATE POLICY "Submit an order with its secret token"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  public.current_order_token() IS NOT NULL
  AND secret_token = public.current_order_token()
);

DROP POLICY IF EXISTS "Anyone can add items to an order" ON public.order_items;
CREATE POLICY "Add items to own order via secret token"
ON public.order_items FOR INSERT TO anon, authenticated
WITH CHECK (
  public.current_order_token() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.secret_token = public.current_order_token()
  )
);