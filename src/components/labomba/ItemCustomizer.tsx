import { useMemo, useState } from "react";
import { X, Minus, Plus, Flame } from "lucide-react";
import { menu, type MenuItem } from "./data";
import { getMenuItemId, priceToCents, formatCents, useOrder, type CartAddOn } from "@/lib/order-context";

export default function ItemCustomizer({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const { addLine, openDrawer } = useOrder();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({});

  const extras = useMemo(
    () => menu.filter((m) => m.category === "Extras & Sides"),
    [],
  );

  const isExtra = item.category === "Extras & Sides";
  const unitPriceCents = priceToCents(item.price);

  const addOnTotalCents = useMemo(() => {
    let total = 0;
    for (const e of extras) {
      const id = getMenuItemId(e);
      const q = addOnQty[id] ?? 0;
      const p = priceToCents(e.price);
      if (q > 0 && p != null) total += p * q;
    }
    return total;
  }, [addOnQty, extras]);

  const baseTotalCents = unitPriceCents != null ? unitPriceCents * qty : 0;
  const totalCents = baseTotalCents + addOnTotalCents;

  function bumpAddOn(id: string, delta: number) {
    setAddOnQty((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) };
      return next;
    });
  }

  function handleAdd() {
    const addOns: CartAddOn[] = extras
      .filter((e) => (addOnQty[getMenuItemId(e)] ?? 0) > 0)
      .map((e) => ({
        id: getMenuItemId(e),
        name: e.name,
        category: e.category,
        unitPriceCents: priceToCents(e.price),
        quantity: addOnQty[getMenuItemId(e)] ?? 0,
      }));

    addLine({
      itemId: getMenuItemId(item),
      name: item.name,
      category: item.category,
      unitPriceCents,
      image: item.image,
      quantity: qty,
      note: note.trim() || undefined,
      addOns,
    });
    onClose();
    openDrawer();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${item.name}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border/60 bg-card shadow-2xl sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
        >
          <X className="h-4 w-4" />
        </button>

        {item.image && (
          <div className="relative h-44 w-full overflow-hidden bg-muted sm:h-52">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
            {item.category}
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-wide text-foreground">{item.name}</h3>
          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          )}
          <div className="mt-2 text-sm font-semibold text-foreground">
            {item.price ?? <span className="text-muted-foreground">Price set at pickup</span>}
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="rounded-full border border-border/70 bg-card p-2 hover:border-[color:var(--ember)]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-lg font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="rounded-full border border-border/70 bg-card p-2 hover:border-[color:var(--ember)]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Note */}
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Special instructions (optional)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              placeholder="e.g. no onions, extra salsa"
              rows={2}
              className="mt-2 w-full resize-none rounded-xl border border-border/70 bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--ember)] focus:outline-none"
            />
          </label>

          {/* Extras */}
          {!isExtra && (
            <div className="mt-6">
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ember)]">
                <Flame className="h-3.5 w-3.5" /> Add Extras & Sides
              </div>
              <div className="space-y-2">
                {extras.map((e) => {
                  const id = getMenuItemId(e);
                  const q = addOnQty[id] ?? 0;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">{e.name}</div>
                        {e.price && (
                          <div className="text-xs text-muted-foreground">{e.price} each</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => bumpAddOn(id, -1)}
                          disabled={q === 0}
                          aria-label={`Remove ${e.name}`}
                          className="rounded-full border border-border/70 bg-card p-1.5 disabled:opacity-40 hover:border-[color:var(--ember)]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{q}</span>
                        <button
                          onClick={() => bumpAddOn(id, 1)}
                          aria-label={`Add ${e.name}`}
                          className="rounded-full border border-border/70 bg-card p-1.5 hover:border-[color:var(--ember)]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border/60 bg-card p-4">
          <button
            onClick={handleAdd}
            className="btn-blaze flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
          >
            <span>Add to order</span>
            <span>·</span>
            <span>
              {totalCents > 0 ? formatCents(totalCents) : "Price at pickup"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
