"use client";

import { useState, useEffect } from "react";
import PieceCard from "@/components/PieceCard";
import Lightbox from "@/components/Lightbox";

interface Piece {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: string;
  date: string;
}

const categories = ["all", "vase", "bowl", "plate", "sculpture", "experiment"];

export default function Gallery() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Piece | null>(null);

  useEffect(() => {
    fetch("/data/pieces.json")
      .then((r) => r.json())
      .then(setPieces)
      .catch(() => setPieces([]));
  }, []);

  const filtered = filter === "all" ? pieces : pieces.filter((p) => p.category === filter);

  return (
    <div className="pt-24 lg:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">Collection</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light mb-6">Gallery</h1>
          <p className="text-warm-gray font-light text-lg max-w-xl">
            Each piece carries a story — of the clay, the glaze, and the moment it all came together (or didn&apos;t).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all ${
                filter === cat
                  ? "bg-charcoal text-cream"
                  : "bg-cream-dark text-warm-gray hover:text-charcoal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {filtered.length > 0 ? (
          <div className="masonry-grid">
            {filtered.map((piece, i) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                index={i}
                onClick={() => setSelected(piece)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-warm-gray italic">
              More pieces coming soon...
            </p>
            <p className="text-warm-gray/60 text-sm mt-3">
              The clay is still drying.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <Lightbox
          src={selected.image}
          alt={selected.title}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
