import { useMemo, useState } from "react";
import { Search, Flame, X, Plus } from "lucide-react";
import { menu, MENU_CATEGORIES, type MenuCategory, type MenuItem } from "./data";
import ItemCustomizer from "./ItemCustomizer";


type Tab = "All" | MenuCategory;
const TABS: Tab[] = ["All", ...MENU_CATEGORIES];

export default function Menu() {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter((item) => {
      if (tab !== "All" && item.category !== tab) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [tab, query]);

  return (
    <section id="menu" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
          <Flame className="h-3.5 w-3.5" /> Full Menu
        </div>
        <h2 className="text-4xl md:text-5xl font-normal tracking-wide text-gradient-flame">
          Find Your Bomba
        </h2>
      </div>

      {/* Search */}
      <div className="mx-auto mb-6 flex max-w-xl items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2.5 focus-within:border-[color:var(--ember)]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tacos, burritos, sides…"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search menu"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {TABS.map((t) => {
          const active = tab === t;
          const count =
            t === "All" ? menu.length : menu.filter((i) => i.category === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition " +
                (active
                  ? "btn-blaze hover:btn-blaze-hover"
                  : "border border-border/70 bg-card/60 text-foreground/80 hover:bg-card hover:text-foreground")
              }
            >
              {t}
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[10px] font-bold " +
                  (active ? "bg-white/25 text-white" : "bg-muted text-muted-foreground")
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 py-16 text-center">
          <p className="text-lg text-foreground">No items match "{query}"</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <article
              key={`${item.category}-${item.name}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:border-[color:var(--ember)]/60"
            >
              {item.image && (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {item.price && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
                      {item.price}
                    </div>
                  )}
                </div>
              )}
              <div className="relative flex flex-1 flex-col p-6">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[color:var(--ember)]/10 blur-2xl transition group-hover:bg-[color:var(--ember)]/25" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                      {item.category}
                    </div>
                    <h3 className="mt-1 text-2xl font-normal tracking-wide text-foreground">
                      {item.name}
                    </h3>
                  </div>
                  {item.price && !item.image && (
                    <div className="shrink-0 text-xl font-normal tracking-wide text-gradient-flame">
                      {item.price}
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
                {item.badge && (
                  <div className="relative mt-3">
                    <span className="rounded-full bg-[color:var(--accent)]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--accent)]">
                      {item.badge}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setCustomizing(item)}
                  className="btn-blaze relative mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider hover:btn-blaze-hover"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to order
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {customizing && (
        <ItemCustomizer item={customizing} onClose={() => setCustomizing(null)} />
      )}
    </section>
  );
}

