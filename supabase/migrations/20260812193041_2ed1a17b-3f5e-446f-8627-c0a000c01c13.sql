DROP POLICY IF EXISTS "Submit an order with its secret token" ON public.orders;
DROP POLICY IF EXISTS "Add items to own order via secret token" ON public.order_items;
REVOKE INSERT ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.order_items FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;