import { useState } from "react";
import { Phone, MapPin, Clock, Star, Flame, Utensils, DollarSign, Truck } from "lucide-react";
import logo from "@/assets/labomba-logo.png";
import hero from "@/assets/labomba-hero.jpg";
import { BUSINESS, reviews } from "./data";
import Menu from "./Menu";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-foreground/90 backdrop-blur">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
        <Flame className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="text-4xl md:text-5xl font-normal tracking-wide text-gradient-flame">
        {title}
      </h2>
    </div>
  );
}

function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt=""
          width={1920}
          height={1200}
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 pb-20 md:pt-14 md:pb-28 text-center">
        <img
          src={logo}
          alt="La Bomba logo — cartoon bomb with fiery blast and graffiti wordmark"
          width={520}
          height={520}
          className="w-64 md:w-80 drop-shadow-[0_20px_50px_rgba(255,120,40,0.35)]"
        />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Chip>
            <Star className="h-3.5 w-3.5 fill-[color:var(--accent)] text-[color:var(--accent)]" />
            <span className="font-semibold">{BUSINESS.rating}</span>
            <span className="text-muted-foreground">· {BUSINESS.ratingCount} ratings</span>
          </Chip>
          <Chip>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> DashPass
          </Chip>
          <Chip>
            <Truck className="h-3.5 w-3.5" /> Food Truck → Brick & Mortar
          </Chip>
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-normal tracking-wide">
          <span className="text-gradient-flame">Explosive</span>{" "}
          <span className="text-foreground">Mexican flavor</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
          {BUSINESS.tagline}. Open today {BUSINESS.hours}.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={BUSINESS.doorDashUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-blaze inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
          >
            <Flame className="h-4 w-4" /> Order on DoorDash
          </a>
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-card"
          >
            <Phone className="h-4 w-4" /> Call {BUSINESS.phone}
          </a>
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-card"
          >
            <MapPin className="h-4 w-4" /> Directions
          </a>
        </div>
      </div>
    </header>
  );
}

function InfoBar() {
  const items = [
    { icon: Utensils, label: BUSINESS.cuisine },
    { icon: DollarSign, label: BUSINESS.priceRange },
    { icon: Clock, label: `Open · ${BUSINESS.hours}` },
    { icon: MapPin, label: BUSINESS.address },
    { icon: Phone, label: BUSINESS.phone },
  ];
  return (
    <section className="border-y border-border/60 bg-card/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 text-sm text-muted-foreground">
        {items.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4 text-[color:var(--ember)]" />
            <span className="text-foreground/90">{label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
        <Flame className="h-3.5 w-3.5" /> About
      </div>
      <p className="text-2xl md:text-3xl font-light leading-snug text-foreground">
        Former food truck, now brick and mortar — serving{" "}
        <span className="text-gradient-flame font-semibold">bomb birria, asada, pastor and carnitas</span>{" "}
        in El Paso, TX. 💣🔥
      </p>
    </section>
  );
}


function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  const [open, setOpen] = useState(false);
  const long = review.text.length > 260;
  const shown = !long || open ? review.text : review.text.slice(0, 240).trimEnd() + "…";
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--ember)] to-[color:var(--blaze)] text-sm font-bold text-white">
          {review.initial}
        </div>
        <div>
          <div className="font-semibold text-foreground">{review.name}</div>
          <div className="text-xs text-muted-foreground">{review.contributions}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 font-semibold uppercase tracking-wider text-[color:var(--accent)]">
          {review.sentiment}
        </span>
        <span>{review.date}</span>
        <span>· DoorDash order</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/90">{shown}</p>
      {long && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-3 self-start text-xs font-semibold uppercase tracking-wider text-[color:var(--ember)] hover:text-[color:var(--blaze)]"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </article>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle eyebrow="Reviews" title="What Folks Are Saying" />
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-5 py-3">
          <Star className="h-5 w-5 fill-[color:var(--accent)] text-[color:var(--accent)]" />
          <span className="text-3xl font-normal tracking-wide text-foreground">
            {BUSINESS.rating}
          </span>
          <span className="text-sm text-muted-foreground">/ 5</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {BUSINESS.ratingCount} ratings · {BUSINESS.reviewCount} public reviews
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((r) => (
          <ReviewCard key={r.name} review={r} />
        ))}
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle eyebrow="Visit Us" title="Come Find La Bomba" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/60 bg-card p-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[color:var(--ember)]" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Address
                </div>
                <div className="mt-1 text-lg text-foreground">{BUSINESS.address}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-[color:var(--ember)]" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Hours
                </div>
                <div className="mt-1 text-lg text-foreground">{BUSINESS.hours}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-[color:var(--ember)]" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Phone
                </div>
                <a
                  href={BUSINESS.phoneHref}
                  className="mt-1 block text-lg text-foreground hover:text-[color:var(--ember)]"
                >
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={BUSINESS.doorDashUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-blaze inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
            >
              <Flame className="h-4 w-4" /> Order on DoorDash
            </a>
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-card"
            >
              <MapPin className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <iframe
            title="La Bomba on Google Maps"
            src={BUSINESS.mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ minHeight: 380, border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center">
        <img src={logo} alt="" width={120} height={120} className="w-24" loading="lazy" />
        <p className="text-sm text-muted-foreground">
          {BUSINESS.name} · Former food truck, now brick & mortar · El Paso, TX
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <a href="#menu" className="hover:text-foreground">Menu</a>
          <a href="#reviews" className="hover:text-foreground">Reviews</a>
          <a href="#visit" className="hover:text-foreground">Visit</a>
          <a href={BUSINESS.phoneHref} className="hover:text-foreground">{BUSINESS.phone}</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} La Bomba LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function LaBomba() {
  return (
    <main>
      <Hero />
      <InfoBar />
      <About />
      <MostOrdered />
      <ExtrasSides />
      <Reviews />
      <Visit />
      <Footer />
    </main>
  );
}
