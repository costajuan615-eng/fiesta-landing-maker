import { X, Minus, Plus, Trash2, ShoppingBag, Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatCents, useOrder } from "@/lib/order-context";

export function CartFab() {
  const { itemCount, subtotalCents, openDrawer } = useOrder();
  if (itemCount === 0) return null;
  return (
    <button
      onClick={openDrawer}
      aria-label={`Open order (${itemCount} items)`}
      className="btn-blaze fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-wider shadow-2xl hover:btn-blaze-hover"
    >
      <ShoppingBag className="h-4 w-4" />
      <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
      {subtotalCents > 0 && <span className="opacity-80">· {formatCents(subtotalCents)}</span>}
    </button>
  );
}

export function CartDrawer() {
  const {
    drawerOpen,
    closeDrawer,
    lines,
    subtotalCents,
    itemCount,
    hasUnpricedItems,
    updateLine,
    removeLine,
    clear,
  } = useOrder();

  if (!drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-black/70 backdrop-blur-sm"
      onClick={closeDrawer}
      role="dialog"
      aria-modal="true"
      aria-label="Your order"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col border-l border-border/60 bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
              <Flame className="h-3.5 w-3.5" /> Your Order
            </div>
            <h2 className="mt-1 text-2xl font-normal tracking-wide text-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close"
            className="rounded-full border border-border/70 bg-background/40 p-2 hover:border-[color:var(--ember)]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-lg text-foreground">Your order is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap "Add to order" on any menu item to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => {
                const lineTotal =
                  (l.unitPriceCents != null ? l.unitPriceCents * l.quantity : 0) +
                  l.addOns.reduce(
                    (a, x) => a + (x.unitPriceCents != null ? x.unitPriceCents * x.quantity : 0),
                    0,
                  );
                return (
                  <li
                    key={l.lineId}
                    className="rounded-2xl border border-border/60 bg-background/40 p-3"
                  >
                    <div className="flex gap-3">
                      {l.image && (
                        <img
                          src={l.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-foreground">
                              {l.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {l.unitPriceCents != null
                                ? `${formatCents(l.unitPriceCents)} each`
                                : "Price at pickup"}
                            </div>
                          </div>
                          <button
                            onClick={() => removeLine(l.lineId)}
                            aria-label={`Remove ${l.name}`}
                            className="rounded-full p-1 text-muted-foreground hover:text-[color:var(--ember)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {l.note && (
                          <p className="mt-1 truncate text-xs italic text-muted-foreground">
                            "{l.note}"
                          </p>
                        )}
                        {l.addOns.length > 0 && (
                          <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                            {l.addOns.map((a) => (
                              <li key={a.id}>
                                + {a.quantity}× {a.name}
                                {a.unitPriceCents != null &&
                                  ` (${formatCents(a.unitPriceCents * a.quantity)})`}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateLine(l.lineId, { quantity: l.quantity - 1 })
                              }
                              aria-label="Decrease quantity"
                              className="rounded-full border border-border/70 bg-card p-1.5 hover:border-[color:var(--ember)]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-semibold">
                              {l.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateLine(l.lineId, { quantity: l.quantity + 1 })
                              }
                              aria-label="Increase quantity"
                              className="rounded-full border border-border/70 bg-card p-1.5 hover:border-[color:var(--ember)]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            {lineTotal > 0 ? formatCents(lineTotal) : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold text-foreground">
                {formatCents(subtotalCents)}
              </span>
            </div>
            {hasUnpricedItems && (
              <p className="mb-3 rounded-lg border border-[color:var(--ember)]/30 bg-[color:var(--ember)]/5 px-3 py-2 text-xs text-muted-foreground">
                Some items don't have listed prices — the final total is confirmed at pickup.
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="btn-blaze inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
              >
                <Flame className="h-4 w-4" /> Submit order
              </Link>
              <button
                onClick={clear}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-[color:var(--ember)]"
              >
                Clear order
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
