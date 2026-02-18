import Image from "next/image";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { getContent, c } from "@/lib/content";

interface Piece {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: string;
  date: string;
  featured?: boolean;
}

async function getPieces(): Promise<Piece[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "pieces.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function Home() {
  const [pieces, content] = await Promise.all([getPieces(), getContent()]);
  const featured = pieces.find((p) => p.featured) || pieces[0];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-clay-light/20 via-cream to-cream" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 animate-fade-up">
            <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-6">
              {c(content, "home_subtitle")}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-charcoal mb-8">
              {c(content, "home_hero_line1")}
              <br />
              <span className="italic text-terracotta">{c(content, "home_hero_line2")}</span>
              <br />
              {c(content, "home_hero_line3")}
            </h1>
            <p className="text-warm-gray font-light text-lg max-w-md leading-relaxed mb-10">
              {c(content, "home_intro")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-3 bg-charcoal text-cream px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors"
              >
                View Gallery
                <span className="text-lg">→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 border border-charcoal/20 text-charcoal px-8 py-4 text-sm tracking-[0.2em] uppercase hover:border-terracotta hover:text-terracotta transition-colors"
              >
                My Story
              </Link>
            </div>
          </div>

          {featured && (
            <div className="order-1 lg:order-2 animate-fade-in">
              <div className="relative aspect-[3/4] max-w-lg mx-auto">
                <div className="absolute -inset-4 bg-terracotta/10 rounded-sm -rotate-2" />
                <div className="relative rounded-sm overflow-hidden shadow-2xl shadow-charcoal/10">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-cream p-4 shadow-lg">
                  <p className="font-serif text-lg text-charcoal">{featured.title}</p>
                  <p className="text-warm-gray text-xs tracking-wider uppercase mt-1">Latest piece</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-warm-gray/50">
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-warm-gray/30 animate-pulse" />
        </div>
      </section>

      {/* Philosophy section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="w-12 h-px bg-terracotta mx-auto mb-12" />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-snug text-charcoal italic">
            &ldquo;{c(content, "home_quote")}&rdquo;
          </blockquote>
          <div className="w-12 h-px bg-terracotta mx-auto mt-12" />
        </div>
      </section>

      {/* Recent pieces teaser */}
      {pieces.length > 0 && (
        <section className="py-16 lg:py-24 bg-cream-dark/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">From the studio</p>
                <h2 className="font-serif text-4xl lg:text-5xl font-light">Recent Work</h2>
              </div>
              <Link
                href="/gallery"
                className="hidden sm:inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-terracotta hover:text-terracotta-dark transition-colors"
              >
                See all <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pieces.slice(0, 3).map((piece) => (
                <Link key={piece.id} href="/gallery" className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream-dark">
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-serif text-xl mt-4 group-hover:text-terracotta transition-colors">
                    {piece.title}
                  </h3>
                  <p className="text-warm-gray text-xs tracking-wider uppercase mt-1">
                    {piece.category}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-light mb-6">{c(content, "home_cta_title")}</h2>
          <p className="text-warm-gray font-light text-lg mb-10 max-w-xl mx-auto">
            {c(content, "home_cta_text")}
          </p>
          <Link
            href="/journal"
            className="inline-flex items-center gap-3 bg-terracotta text-cream px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors"
          >
            Read the Journal
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
