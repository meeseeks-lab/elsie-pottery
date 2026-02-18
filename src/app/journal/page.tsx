export default function Journal() {
  return (
    <div className="pt-24 lg:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">Process</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light mb-6">Journal</h1>
          <p className="text-warm-gray font-light text-lg max-w-xl">
            The messy middle. Kiln fails, glaze experiments, and the occasional happy accident.
          </p>
        </div>

        {/* Journal entries */}
        <div className="space-y-16">
          <article className="border-l-2 border-terracotta/30 pl-8">
            <time className="text-warm-gray text-xs tracking-[0.2em] uppercase">November 2025</time>
            <h2 className="font-serif text-3xl mt-3 mb-4">The Lavender Vase</h2>
            <div className="text-warm-gray font-light leading-relaxed space-y-4">
              <p>
                Sometimes the best things happen when you stop trying so hard. I&apos;d been 
                struggling with coil-building for weeks — everything kept collapsing or 
                looking forced. Then one Saturday morning, I just... started. No plan, no 
                reference image. Just clay and music.
              </p>
              <p>
                The shape came out slightly asymmetric, which I would have &ldquo;fixed&rdquo; a 
                year ago. But I left it. The speckled glaze was a happy accident — two 
                test batches that I thought were ruined. Turns out they were waiting for 
                each other.
              </p>
              <p>
                I picked up dried lavender from the Boqueria market and placed it in the 
                vase without thinking. It just fit. Some things you can&apos;t plan.
              </p>
            </div>
          </article>

          {/* Placeholder for future entries */}
          <div className="text-center py-16">
            <div className="w-12 h-px bg-terracotta/30 mx-auto mb-8" />
            <p className="font-serif text-2xl text-warm-gray/50 italic">
              More stories from the studio coming soon...
            </p>
            <p className="text-warm-gray/40 text-sm mt-3">
              The clay needs time to dry, and so do the words.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
