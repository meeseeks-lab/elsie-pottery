import Image from "next/image";
import { getContent, c } from "@/lib/content";

export const revalidate = 60;

export default async function About() {
  const content = await getContent();
  const bioParagraphs = c(content, "about_bio").split("\n\n").filter(Boolean);

  return (
    <div className="pt-24 lg:pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">About</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light mb-8">
            {c(content, "about_heading")}
            <br />
            <span className="italic text-terracotta">{c(content, "about_heading_accent")}</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-dark">
              <Image
                src={c(content, "about_photo")}
                alt="Elsie's pottery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6 text-warm-gray font-light text-lg leading-relaxed">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="w-12 h-px bg-terracotta" />

            <div className="space-y-4">
              <h3 className="font-serif text-2xl">The studio</h3>
              <p className="text-warm-gray font-light leading-relaxed">
                {c(content, "about_studio")}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl">What I&apos;m learning</h3>
              <ul className="space-y-2 text-warm-gray font-light">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1.5">·</span>
                  <span>Wheel throwing — still fighting the wobble</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1.5">·</span>
                  <span>Hand-building — coils, slabs, pinch pots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1.5">·</span>
                  <span>Glaze chemistry — mostly trial and error (heavy on the error)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1.5">·</span>
                  <span>Patience — the kiln teaches this one</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
