import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, ArrowLeft } from "lucide-react";
import Menu from "@/components/labomba/Menu";
import { BUSINESS } from "@/components/labomba/data";

import img1 from "@/assets/gallery/1.jpg.asset.json";
import img2 from "@/assets/gallery/2.jpg.asset.json";
import img3jpeg from "@/assets/gallery/3.jpeg.asset.json";
import img3 from "@/assets/gallery/3.jpg.asset.json";
import img5 from "@/assets/gallery/5.jpg.asset.json";
import img6 from "@/assets/gallery/6.jpg.asset.json";
import img8 from "@/assets/gallery/8.jpg.asset.json";
import img10 from "@/assets/gallery/10.jpg.asset.json";
import img11 from "@/assets/gallery/11.jpg.asset.json";
import img12 from "@/assets/gallery/12.jpg.asset.json";

const gallery = [
  { src: img6.url, alt: "Bomba quesatacos with guacamole and consomé", span: "md:col-span-2 md:row-span-2" },
  { src: img1.url, alt: "Birria quesatacos plate with consomé and lime" },
  { src: img3.url, alt: "Birria quesatacos stacked with melted cheese" },
  { src: img2.url, alt: "Birria ramen bowl with radish and cilantro" },
  { src: img3jpeg.url, alt: "Loaded birria consomé cup" },
  { src: img5.url, alt: "La Bomba quesabirria on checker paper" },
  { src: img12.url, alt: "Quesabirria basket with consomé dip" },
  { src: img8.url, alt: "Taco plate with rice, beans and salsas" },
  { src: img11.url, alt: "House pickled onions and cilantro" },
  { src: img10.url, alt: "La Bomba menu highlights collage" },
];

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Full Menu & Gallery — La Bomba LLC · El Paso, TX" },
      {
        name: "description",
        content:
          "Browse the full La Bomba menu — birria quesatacos, ramen, burritos, loaded fries, tortas, aguas frescas and more. See real photos of our food in El Paso, TX.",
      },
      { property: "og:title", content: "Full Menu & Gallery — La Bomba LLC" },
      {
        property: "og:description",
        content:
          "Real photos + the full menu of birria, asada, pastor and carnitas from La Bomba in El Paso, TX.",
      },
      { property: "og:image", content: img6.url },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <main>
      <header className="border-b border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-14 text-center">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground hover:text-[color:var(--ember)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
            <Flame className="h-3.5 w-3.5" /> Menu & Gallery
          </div>
          <h1 className="text-5xl md:text-6xl font-normal tracking-wide">
            <span className="text-gradient-flame">The full</span>{" "}
            <span className="text-foreground">La Bomba lineup</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            Every dish we sling — birria, asada, pastor, carnitas — plus real photos straight from the kitchen.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={BUSINESS.doorDashUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-blaze inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider hover:btn-blaze-hover"
            >
              <Flame className="h-4 w-4" /> Order on DoorDash
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
            <Flame className="h-3.5 w-3.5" /> Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-normal tracking-wide text-gradient-flame">
            Straight From The Kitchen
          </h2>
        </div>
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
          {gallery.map((g) => (
            <figure
              key={g.src}
              className={
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-card " +
                (g.span ?? "")
              }
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </section>

      <Menu />

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
          <p>{BUSINESS.name} · {BUSINESS.address}</p>
          <a href={BUSINESS.phoneHref} className="hover:text-foreground">{BUSINESS.phone}</a>
          <Link to="/" className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--ember)]">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}
