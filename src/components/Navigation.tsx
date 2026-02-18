"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/logbook", label: "Logbook" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-clay-light/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="font-serif text-2xl lg:text-3xl font-light text-charcoal tracking-wide hover:text-terracotta transition-colors">
            Elsie Leung
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-[0.2em] uppercase font-light transition-colors ${
                  pathname === link.href
                    ? "text-terracotta"
                    : "text-warm-gray hover:text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-charcoal"
            aria-label="Menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-px bg-charcoal transition-all ${isOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`h-px bg-charcoal transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-px bg-charcoal transition-all ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-sm tracking-[0.2em] uppercase font-light ${
                  pathname === link.href ? "text-terracotta" : "text-warm-gray"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
