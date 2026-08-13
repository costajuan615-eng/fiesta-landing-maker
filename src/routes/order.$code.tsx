import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CheckCircle2, Phone, MapPin, Flame } from "lucide-react";
import { BUSINESS } from "@/components/labomba/data";
import { formatCents } from "@/lib/order-context";
import { orderPassKey } from "@/lib/order-pass";
import { getOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/order/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.code} — La Bomba LLC` },
      { name: "robots", content: "noindex" },
      { name: "description", content: `Order confirmation for ${params.code} from La Bomba LLC.` },
      { property: "og:title", content: `Order ${params.code} — La Bomba LLC` },
      { property: "og:description", content: "Your La Bomba order was received." },
    ],
  }),
  component: OrderConfirmationPage,
});

type OrderSnapshot = {
  order_code: string;
  customer_name: string;
  order_type: "pickup" | "delivery";
  phone: string;
  subtotal_cents: number;
  item_count: number;
  has_unpriced: boolean;
  submitted_at: string;
};

type OrderLine = { id: string; name: string; quantity: number; unit_price_cents: number | null };

function OrderConfirmationPage() {
  const { code } = Route.useParams();
  const fetchOrder = useServerFn(getOrder);
  const [snap, setSnap] = useState<OrderSnapshot | null>(null);
  const [items, setItems] = useState<OrderLine[] | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`labomba.order.${code}`);
      if (raw) setSnap(JSON.parse(raw));
    } catch {
      /* ignore */
    }

    let cancelled = false;
    (async () => {
      let pass: string | null = null;
      try {
        pass = sessionStorage.getItem(orderPassKey(code));
      } catch {
        /* ignore */
      }
      if (!pass) return;

      const result = await fetchOrder({ data: { order_code: code, access_pass: pass } });
      if (cancelled) return;

      if (!result.ok) {
        try {
          sessionStorage.removeItem(orderPassKey(code));
        } catch {
          /* ignore */
        }
        setExpired(true);
        return;
      }

      // Sliding window: refresh the short-lived pass on every successful read.
      try {
        sessionStorage.setItem(orderPassKey(code), result.access_pass);
      } catch {
        /* ignore */
      }

      const rows = result.items as OrderLine[];
      setItems(rows);
      setSnap({
        order_code: result.order.order_code,
        customer_name: result.order.customer_name,
        order_type: result.order.order_type === "delivery" ? "delivery" : "pickup",
        phone: result.order.phone,
        subtotal_cents: result.order.subtotal_cents,
        item_count: result.order.item_count,
        has_unpriced: rows.some((r) => r.unit_price_cents == null),
        submitted_at: result.order.created_at,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [code, fetchOrder]);



  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--ember)]/15 text-[color:var(--ember)]">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
        <Flame className="h-3.5 w-3.5" /> Order Received
      </div>
      <h1 className="text-4xl md:text-5xl font-normal tracking-wide text-gradient-flame">
        Thanks{snap ? `, ${snap.customer_name.split(" ")[0]}` : ""}!
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your order was sent to the kitchen. Please call to confirm and arrange payment.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-3xl border border-border/60 bg-card p-6 text-left">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Order code
        </div>
        <div className="mt-1 text-3xl font-normal tracking-wide text-foreground">{code}</div>

        {expired && (
          <p className="mt-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">
            This order link has expired for your security. Give us a call with the code above and
            we'll pull up your order.
          </p>
        )}



        {snap && (
          <dl className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
            <Row label="Type" value={snap.order_type === "delivery" ? "Delivery" : "Pickup"} />
            <Row label="Items" value={String(snap.item_count)} />
            <Row
              label="Subtotal"
              value={
                snap.subtotal_cents > 0
                  ? `${formatCents(snap.subtotal_cents)}${snap.has_unpriced ? " + items priced at pickup" : ""}`
                  : "Priced at pickup"
              }
            />
          </dl>
        )}

        {items && items.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {it.quantity}× {it.name}
                </span>
                <span className="font-semibold text-foreground">
                  {it.unit_price_cents != null
                    ? formatCents(it.unit_price_cents * it.quantity)
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href={BUSINESS.phoneHref}
          className="btn-blaze inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
        >
          <Phone className="h-4 w-4" /> Call {BUSINESS.phone}
        </a>
        <a
          href={BUSINESS.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-[color:var(--ember)]"
        >
          <MapPin className="h-4 w-4" /> {BUSINESS.address}
        </a>
        <Link
          to="/"
          className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground hover:text-[color:var(--ember)]"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}
