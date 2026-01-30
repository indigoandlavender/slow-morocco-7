import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Morocco Art Archive",
  description: "A comprehensive archive of Moroccan visual art - painting and photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FAF9F6] text-[#1C1917]">
        {/* Fixed Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
          <div className="flex justify-between items-center px-6 md:px-12 py-6">
            {/* Logo */}
            <Link href="/" className="text-white">
              <span className="text-[11px] tracking-[0.4em] uppercase font-medium">
                Morocco Art Archive
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-12">
              {[
                { href: '/artists', label: 'Artists' },
                { href: '/works', label: 'Works' },
                { href: '/movements', label: 'Movements' },
                { href: '/cities', label: 'Cities' },
                { href: '/themes', label: 'Themes' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <Link 
              href="/search" 
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#0A0A0A] text-white">
          <div className="px-6 md:px-12 py-24">
            <div className="grid md:grid-cols-12 gap-12 md:gap-8">
              {/* Brand */}
              <div className="md:col-span-4">
                <span className="text-[11px] tracking-[0.4em] uppercase font-medium block mb-6">
                  Morocco Art Archive
                </span>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                  A living record of Moroccan visual art from the 20th century to today.
                  Painting and photography.
                </p>
              </div>

              {/* Navigation */}
              <div className="md:col-span-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                  Explore
                </span>
                <div className="flex flex-col gap-3">
                  {['Artists', 'Works', 'Movements', 'Cities', 'Themes'].map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Medium */}
              <div className="md:col-span-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                  Medium
                </span>
                <div className="flex flex-col gap-3">
                  <Link href="/painting" className="text-sm text-white/60 hover:text-white transition-colors">
                    Painting
                  </Link>
                  <Link href="/photography" className="text-sm text-white/60 hover:text-white transition-colors">
                    Photography
                  </Link>
                </div>
              </div>

              {/* API */}
              <div className="md:col-span-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                  Data
                </span>
                <div className="flex flex-col gap-3">
                  <Link href="/api/v1/artists" className="text-sm text-white/60 hover:text-white transition-colors">
                    API
                  </Link>
                  <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
                    Search
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="md:col-span-2">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 block mb-6">
                  Info
                </span>
                <div className="flex flex-col gap-3">
                  <span className="text-sm text-white/60">
                    Dancing with Lions
                  </span>
                  <span className="text-sm text-white/60">
                    Casablanca, Morocco
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
                © 2026 Morocco Art Archive
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
                Data as Art · Art as Data
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
