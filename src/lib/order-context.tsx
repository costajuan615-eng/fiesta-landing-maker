import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "@/components/labomba/data";

export type CartAddOn = {
  id: string;
  name: string;
  category: string;
  unitPriceCents: number | null;
  quantity: number;
};

export type CartLine = {
  lineId: string;
  itemId: string;
  name: string;
  category: string;
  unitPriceCents: number | null;
  image?: string;
  quantity: number;
  note?: string;
  addOns: CartAddOn[];
};

type OrderContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  hasUnpricedItems: boolean;
  addLine: (line: Omit<CartLine, "lineId">) => void;
  updateLine: (lineId: string, patch: Partial<Pick<CartLine, "quantity" | "note">>) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = "labomba.cart.v1";

export function getMenuItemId(item: Pick<MenuItem, "name" | "category">) {
  return `${item.category}::${item.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function priceToCents(price?: string): number | null {
  if (!price) return null;
  const m = price.replace(/[^0-9.]/g, "");
  if (!m) return null;
  const n = Number(m);
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const value = useMemo<OrderContextValue>(() => {
    const itemCount = lines.reduce(
      (acc, l) => acc + l.quantity + l.addOns.reduce((a, x) => a + x.quantity, 0),
      0,
    );
    let subtotalCents = 0;
    let hasUnpricedItems = false;
    for (const l of lines) {
      if (l.unitPriceCents != null) subtotalCents += l.unitPriceCents * l.quantity;
      else hasUnpricedItems = true;
      for (const a of l.addOns) {
        if (a.unitPriceCents != null) subtotalCents += a.unitPriceCents * a.quantity;
      }
    }
    return {
      lines,
      itemCount,
      subtotalCents,
      hasUnpricedItems,
      addLine: (line) =>
        setLines((prev) => [
          ...prev,
          { ...line, lineId: `${line.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ]),
      updateLine: (lineId, patch) =>
        setLines((prev) =>
          prev
            .map((l) => (l.lineId === lineId ? { ...l, ...patch } : l))
            .filter((l) => l.quantity > 0),
        ),
      removeLine: (lineId) => setLines((prev) => prev.filter((l) => l.lineId !== lineId)),
      clear: () => setLines([]),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, drawerOpen]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
