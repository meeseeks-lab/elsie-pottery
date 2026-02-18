"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: { id: string; value: string }[]) => {
        const map: Record<string, string> = {};
        for (const item of data) map[item.id] = item.value;
        setContent(map);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-charcoal text-cream/60 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <p className="font-serif text-2xl text-cream/80 mb-4">
          {content.footer_name || "Elsie Leung"}
        </p>
        <p className="text-sm tracking-[0.15em] uppercase font-light">
          {content.footer_tagline || "Barcelona · Learning with clay since 2022"}
        </p>
        <div className="mt-8 w-12 h-px bg-terracotta/40 mx-auto" />
        <p className="mt-6 text-xs text-cream/30">
          {content.footer_quote || "Every piece is a lesson. Every glaze is a surprise."}
        </p>
      </div>
    </footer>
  );
}
