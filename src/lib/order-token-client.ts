import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Creates a Supabase client that carries an order's secret token on every request.
 * The database read rules only return the order (and its items) whose
 * secret_token matches this header — nothing else is visible.
 */
export function createOrderClient(secretToken: string) {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        headers.set("x-order-token", secretToken);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const orderTokenKey = (code: string) => `labomba.order.token.${code}`;
