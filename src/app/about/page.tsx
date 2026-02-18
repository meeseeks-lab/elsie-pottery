import Image from "next/image";

export default function About() {
  return (
    <div className="pt-24 lg:pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">About</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light mb-8">
            Not a potter.
            <br />
            <span className="italic text-terracotta">A student of clay.</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-dark">
              <Image
                src="/uploads/lavender-vase.jpg"
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
              <p>
                I moved to Barcelona in 2020, carrying a suitcase and an overwhelming need to make 
                something with my hands. For years I&apos;d worked in front of screens, and the city — 
                with its warmth, its light, its <em>slow mornings</em> — felt like permission to try 
                something different.
              </p>
              <p>
                I walked into a ceramics studio in El Born on a whim. The teacher placed a lump of 
                clay on the wheel and said, <em>&ldquo;Don&apos;t think about the bowl. Think about your 
                breathing.&rdquo;</em> I haven&apos;t stopped since.
              </p>
              <p>
                Three years in, I&apos;m still very much a beginner. My pieces are imperfect — 
                wobbly rims, unexpected glaze runs, the occasional crack that shows up after the 
                kiln cools. But that&apos;s the point, isn&apos;t it? The Japanese call it <em>wabi-sabi</em>: 
                beauty in imperfection, in the incomplete, in the impermanent.
              </p>
              <p>
                This isn&apos;t a shop. Nothing here is for sale. This is just a quiet corner of the 
                internet where I share what I&apos;m learning — the process, the failures, the 
                occasional piece that makes me smile.
              </p>
            </div>

            <div className="w-12 h-px bg-terracotta" />

            <div className="space-y-4">
              <h3 className="font-serif text-2xl">The studio</h3>
              <p className="text-warm-gray font-light leading-relaxed">
                I share a community studio in Poble Sec with a handful of other hobbyists. 
                We have two electric kilns, a few wheels, and a shelf of experimental glazes 
                that nobody takes credit for. On good days, the light comes through the window 
                and everything looks like it belongs in a still life.
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
