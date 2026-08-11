import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Flame, Loader2 } from "lucide-react";
import { createOrderClient, orderTokenKey } from "@/lib/order-token-client";
import { formatCents, useOrder } from "@/lib/order-context";
import { BUSINESS } from "@/components/labomba/data";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Submit Your Order — La Bomba LLC" },
      {
        name: "description",
        content:
          "Review your La Bomba order and submit it for pickup or delivery. Pay in person or by phone when you arrive.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Submit Your Order — La Bomba LLC" },
      {
        property: "og:description",
        content: "Review and submit your La Bomba pickup or delivery order.",
      },
    ],
  }),
  component: CheckoutPage,
});

const checkoutSchema = z
  .object({
    customer_name: z.string().trim().min(2, "Please enter your name").max(80),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone")
      .max(30)
      .regex(/^[+()\-.\s\d]+$/, "Digits and () - . + only"),
    email: z
      .string()
      .trim()
      .max(200)
      .email("Enter a valid email")
      .optional()
      .or(z.literal("")),
    order_type: z.enum(["pickup", "delivery"]),
    delivery_address: z.string().trim().max(300).optional().or(z.literal("")),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine(
    (v) => v.order_type !== "delivery" || (v.delivery_address && v.delivery_address.length > 5),
    { message: "Delivery address is required", path: ["delivery_address"] },
  );

function generateOrderCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `LB-${s}`;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotalCents, itemCount, hasUnpricedItems, clear } = useOrder();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("SUBMIT_FIRED2");
    e.preventDefault();
    setFormError(null);
    setErrors({});
    let form: FormData;
    try { form = new FormData(e.currentTarget); console.log("FD_OK"); } catch (err) { console.log("FD_ERR", String(err)); return; }
    const parsed = checkoutSchema.safeParse({
      customer_name: form.get("customer_name"),
      phone: form.get("phone"),
      email: form.get("email"),
      order_type: form.get("order_type"),
      delivery_address: form.get("delivery_address"),
      notes: form.get("notes"),
    });
    console.log("PARSED", parsed.success, lines.length, JSON.stringify(parsed.success ? {} : parsed.error.issues));
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    if (lines.length === 0) {
      setFormError("Your order is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const order_code = generateOrderCode();
      const secret_token = crypto.randomUUID();
      console.log("CLIENT_START");
      const supabase = createOrderClient(secret_token);
      console.log("CLIENT_OK");
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          order_code,
          secret_token,
          customer_name: parsed.data.customer_name,
          phone: parsed.data.phone,
          email: parsed.data.email || null,
          order_type: parsed.data.order_type,
          delivery_address:
            parsed.data.order_type === "delivery"
              ? parsed.data.delivery_address || null
              : null,
          notes: parsed.data.notes || null,
          subtotal_cents: subtotalCents,
          item_count: itemCount,
        })
        .select("id, order_code, secret_token")
        .single();
      console.log("INSERT_DONE", JSON.stringify(orderErr), JSON.stringify(order));
      if (orderErr || !order) throw orderErr ?? new Error("Failed to submit order");

      // Insert main lines, then addOns with parent_item_id
      for (const l of lines) {
        const { data: parent, error: itemErr } = await supabase
          .from("order_items")
          .insert({
            order_id: order.id,
            menu_item_id: l.itemId,
            name: l.name,
            category: l.category,
            quantity: l.quantity,
            unit_price_cents: l.unitPriceCents,
            note: l.note ?? null,
          })
          .select("id")
          .single();
        if (itemErr || !parent) throw itemErr ?? new Error("Failed to save item");

        if (l.addOns.length > 0) {
          const addonRows = l.addOns.map((a) => ({
            order_id: order.id,
            parent_item_id: parent.id,
            menu_item_id: a.id,
            name: a.name,
            category: a.category,
            quantity: a.quantity,
            unit_price_cents: a.unitPriceCents,
          }));
          const { error: addErr } = await supabase.from("order_items").insert(addonRows);
          if (addErr) throw addErr;
        }
      }

      // Stash confirmation details for the confirmation page.
      try {
        sessionStorage.setItem(orderTokenKey(order.order_code), order.secret_token);
        sessionStorage.setItem(
          `labomba.order.${order.order_code}`,
          JSON.stringify({
            order_code: order.order_code,
            customer_name: parsed.data.customer_name,
            order_type: parsed.data.order_type,
            phone: parsed.data.phone,
            subtotal_cents: subtotalCents,
            item_count: itemCount,
            has_unpriced: hasUnpricedItems,
            submitted_at: new Date().toISOString(),
          }),
        );
      } catch {
        /* ignore */
      }

      clear();
      navigate({ to: "/order/$code", params: { code: order.order_code } });
    } catch (err) {
      console.error(err);
      setFormError("We couldn't submit your order. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
          <Flame className="h-3.5 w-3.5" /> Checkout
        </div>
        <h1 className="text-4xl font-normal tracking-wide text-gradient-flame">
          Your order is empty
        </h1>
        <p className="mt-3 text-muted-foreground">
          Add something delicious from the menu, then come back to submit your order.
        </p>
        <Link
          to="/menu"
          className="btn-blaze mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
        >
          <Flame className="h-4 w-4" /> Browse menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground hover:text-[color:var(--ember)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to home
      </Link>

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
          <Flame className="h-3.5 w-3.5" /> Submit your order
        </div>
        <h1 className="text-4xl md:text-5xl font-normal tracking-wide text-gradient-flame">
          Almost there
        </h1>
        <p className="mt-2 text-muted-foreground">
          Send your order to the kitchen. Pay in person or over the phone when we confirm.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="customer_name" required error={errors.customer_name} />
            <Field label="Phone" name="phone" type="tel" required error={errors.phone} />
          </div>
          <Field label="Email (optional)" name="email" type="email" error={errors.email} />

          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              How would you like it?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["pickup", "delivery"] as const).map((t) => (
                <label
                  key={t}
                  className={
                    "cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-wider transition " +
                    (orderType === t
                      ? "border-[color:var(--ember)] bg-[color:var(--ember)]/10 text-foreground"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:border-[color:var(--ember)]/50")
                  }
                >
                  <input
                    type="radio"
                    name="order_type"
                    value={t}
                    checked={orderType === t}
                    onChange={() => setOrderType(t)}
                    className="sr-only"
                  />
                  {t === "pickup" ? "Pickup" : "Delivery"}
                </label>
              ))}
            </div>
          </fieldset>

          {orderType === "delivery" && (
            <Field
              label="Delivery address"
              name="delivery_address"
              required
              error={errors.delivery_address}
              placeholder="Street, city, apt #"
            />
          )}

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notes for the kitchen (optional)
            </span>
            <textarea
              name="notes"
              rows={3}
              maxLength={500}
              className="mt-2 w-full resize-none rounded-xl border border-border/70 bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--ember)] focus:outline-none"
              placeholder="Allergies, arrival time, cutlery, etc."
            />
          </label>

          {formError && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-blaze inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Flame className="h-4 w-4" /> Submit order
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            No online payment — you'll pay {BUSINESS.name} directly at pickup or when we deliver.
          </p>
        </form>

        <aside className="h-fit rounded-3xl border border-border/60 bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--ember)]">
            Order summary
          </h2>
          <ul className="space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.lineId} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {l.quantity}× {l.name}
                  </span>
                  <span className="text-foreground">
                    {l.unitPriceCents != null
                      ? formatCents(l.unitPriceCents * l.quantity)
                      : "—"}
                  </span>
                </div>
                {l.note && <p className="mt-0.5 text-xs italic text-muted-foreground">"{l.note}"</p>}
                {l.addOns.map((a) => (
                  <div key={a.id} className="mt-0.5 flex justify-between text-xs text-muted-foreground">
                    <span>+ {a.quantity}× {a.name}</span>
                    <span>
                      {a.unitPriceCents != null ? formatCents(a.unitPriceCents * a.quantity) : "—"}
                    </span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCents(subtotalCents)}
            </span>
          </div>
          {hasUnpricedItems && (
            <p className="mt-3 text-xs text-muted-foreground">
              Some items don't have listed prices — final total is confirmed at pickup.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-[color:var(--ember)]"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={type === "email" ? 200 : 300}
        className="mt-2 w-full rounded-xl border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--ember)] focus:outline-none"
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
