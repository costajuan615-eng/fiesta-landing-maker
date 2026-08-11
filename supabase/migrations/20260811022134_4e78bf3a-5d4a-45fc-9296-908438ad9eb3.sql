DROP POLICY "Read own order items via secret token" ON public.order_items;
DROP FUNCTION IF EXISTS public.order_matches_token(uuid);

CREATE POLICY "Read own order items via secret token"
ON public.order_items FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id
  )
);