import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { menu } from "@/components/labomba/data";
import { getMenuItemId, priceToCents } from "@/lib/order-context";

const addOnSchema = z.object({
  id: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(50),
});

const lineSchema = z.object({
  itemId: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(50),
  note: z.string().trim().max(200).optional(),
  addOns: z.array(addOnSchema).max(20).default([]),
});

const submitOrderSchema = z
  .object({
    customer_name: z.string().trim().min(2).max(80),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(30)
      .regex(/^[+()\-.\s\d]+$/),
    email: z.string().trim().max(200).email().optional().or(z.literal("")),
    order_type: z.enum(["pickup", "delivery"]),
    delivery_address: z.string().trim().max(300).optional().or(z.literal("")),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
    lines: z.array(lineSchema).min(1).max(50),
  })
  .refine(
    (v) => v.order_type !== "delivery" || (v.delivery_address && v.delivery_address.length > 5),
    { message: "Delivery address is required", path: ["delivery_address"] },
  );

export type SubmitOrderInput = z.input<typeof submitOrderSchema>;

function generateOrderCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += chars[b % chars.length];
  return `LB-${s}`;
}

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitOrderSchema.parse(input))
  .handler(async ({ data }) => {
    // Prices are resolved server-side from the real menu — anything the
    // browser claims about price or totals is ignored.
    const byId = new Map(menu.map((m) => [getMenuItemId(m), m]));

    const resolvedLines = data.lines.map((line) => {
      const item = byId.get(line.itemId);
      if (!item) throw new Error(`Unknown menu item: ${line.itemId}`);
      const addOns = line.addOns.map((a) => {
        const extra = byId.get(a.id);
        if (!extra || extra.category !== "Extras & Sides") {
          throw new Error(`Unknown add-on: ${a.id}`);
        }
        return {
          id: a.id,
          name: extra.name,
          category: extra.category,
          quantity: a.quantity,
          unit_price_cents: priceToCents(extra.price),
        };
      });
      return {
        itemId: line.itemId,
        name: item.name,
        category: item.category,
        quantity: line.quantity,
        note: line.note?.trim() || null,
        unit_price_cents: priceToCents(item.price),
        addOns,
      };
    });

    let subtotal_cents = 0;
    let item_count = 0;
    for (const l of resolvedLines) {
      item_count += l.quantity;
      if (l.unit_price_cents != null) subtotal_cents += l.unit_price_cents * l.quantity;
      for (const a of l.addOns) {
        if (a.unit_price_cents != null) subtotal_cents += a.unit_price_cents * a.quantity;
      }
    }

    const order_code = generateOrderCode();
    const secret_token = crypto.randomUUID();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_code,
        secret_token,
        customer_name: data.customer_name,
        phone: data.phone,
        email: data.email || null,
        order_type: data.order_type,
        delivery_address:
          data.order_type === "delivery" ? data.delivery_address || null : null,
        notes: data.notes || null,
        subtotal_cents,
        item_count,
      })
      .select("id, order_code, secret_token")
      .single();
    if (orderErr || !order) throw orderErr ?? new Error("Failed to submit order");

    for (const l of resolvedLines) {
      const { data: parent, error: itemErr } = await supabaseAdmin
        .from("order_items")
        .insert({
          order_id: order.id,
          menu_item_id: l.itemId,
          name: l.name,
          category: l.category,
          quantity: l.quantity,
          unit_price_cents: l.unit_price_cents,
          note: l.note,
        })
        .select("id")
        .single();
      if (itemErr || !parent) throw itemErr ?? new Error("Failed to save item");

      if (l.addOns.length > 0) {
        const { error: addErr } = await supabaseAdmin.from("order_items").insert(
          l.addOns.map((a) => ({
            order_id: order.id,
            parent_item_id: parent.id,
            menu_item_id: a.id,
            name: a.name,
            category: a.category,
            quantity: a.quantity,
            unit_price_cents: a.unit_price_cents,
          })),
        );
        if (addErr) throw addErr;
      }
    }

    return { order_code: order.order_code, secret_token: order.secret_token };
  });
