"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="container mx-auto px-8 md:px-16 lg:px-20">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`font-serif text-sm tracking-[0.2em] transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}>
              SLOW MOROCCO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/journeys"
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              Journeys
            </Link>
            <Link
              href="/epic"
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              Epic
            </Link>
            <Link
              href="/stories"
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              Stories
            </Link>
            <Link
              href="/places"
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              Places
            </Link>
            <Link
              href="/about"
              className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              About
            </Link>

            {/* Plan Your Trip button */}
            <Link
              href="/plan-your-trip"
              className={`text-[11px] tracking-[0.15em] uppercase border px-6 py-3 transition-colors ${
                scrolled 
                  ? "border-foreground hover:bg-foreground hover:text-background" 
                  : "border-white text-white hover:bg-white hover:text-foreground"
              }`}
            >
              Plan Your Trip
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 tap-target"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-8 space-y-1 border-t border-border bg-background">
            <Link
              href="/journeys"
              className="block text-sm tracking-[0.15em] uppercase py-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Journeys
            </Link>
            <Link
              href="/epic"
              className="block text-sm tracking-[0.15em] uppercase py-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Epic
            </Link>
            <Link
              href="/stories"
              className="block text-sm tracking-[0.15em] uppercase py-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stories
            </Link>
            <Link
              href="/places"
              className="block text-sm tracking-[0.15em] uppercase py-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Places
            </Link>
            <Link
              href="/about"
              className="block text-sm tracking-[0.15em] uppercase py-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-6">
              <Link
                href="/plan-your-trip"
                className="inline-block text-sm tracking-[0.15em] uppercase border border-foreground px-8 py-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Plan Your Trip
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
