"use client";

import Image from "next/image";

interface Piece {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: string;
  date: string;
}

interface PieceCardProps {
  piece: Piece;
  onClick: () => void;
  index: number;
}

export default function PieceCard({ piece, onClick, index }: PieceCardProps) {
  return (
    <div
      className="masonry-item group cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-sm bg-cream-dark">
        <Image
          src={piece.image}
          alt={piece.title}
          width={600}
          height={800}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <h3 className="font-serif text-xl text-cream mb-1">{piece.title}</h3>
          <p className="text-cream/70 text-xs tracking-[0.15em] uppercase">
            {piece.category} · {piece.status === "process" ? "In progress" : "Finished piece"}
          </p>
        </div>
      </div>
      <div className="mt-3 mb-1">
        <h3 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors">
          {piece.title}
        </h3>
        <p className="text-warm-gray text-xs tracking-wider uppercase mt-1">
          {piece.category}
        </p>
      </div>
    </div>
  );
}
