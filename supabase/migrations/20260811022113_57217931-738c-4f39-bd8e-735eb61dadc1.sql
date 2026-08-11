-- Helper: read the order token supplied on the request
CREATE OR REPLACE FUNCTION public.current_order_token()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT NULLIF(
    current_setting('request.headers', true)::json ->> 'x-order-token',
    ''
  )::uuid
$$;

-- Helper: does this order id belong to the token on the request?
CREATE OR REPLACE FUNCTION public.order_matches_token(_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = _order_id
      AND public.current_order_token() IS NOT NULL
      AND o.secret_token = public.current_order_token()
  )
$$;

GRANT SELECT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.order_items TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;

CREATE POLICY "Read own order via secret token"
ON public.orders FOR SELECT
TO anon, authenticated
USING (
  public.current_order_token() IS NOT NULL
  AND secret_token = public.current_order_token()
);

CREATE POLICY "Read own order items via secret token"
ON public.order_items FOR SELECT
TO anon, authenticated
USING (public.order_matches_token(order_id));