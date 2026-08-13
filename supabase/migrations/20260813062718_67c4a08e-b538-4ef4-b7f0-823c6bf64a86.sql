DROP POLICY IF EXISTS "Read own order via secret token" ON public.orders;
DROP POLICY IF EXISTS "Read own order items via secret token" ON public.order_items;
DROP FUNCTION IF EXISTS public.order_matches_token(uuid);
DROP FUNCTION IF EXISTS public.current_order_token();
REVOKE ALL ON public.orders FROM anon, authenticated;
REVOKE ALL ON public.order_items FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;