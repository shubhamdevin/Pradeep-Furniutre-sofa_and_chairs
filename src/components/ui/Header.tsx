'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Phone, 
  ArrowRight,
  Sliders,
  Layers,
  FileText
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(null);
  }, [pathname]);

  const sofaCategories = [
    { name: '2-Seater Sofas', slug: '2-seater-sofas', desc: 'Compact luxury for intimate spaces' },
    { name: '3-Seater Sofas', slug: '3-seater-sofas', desc: 'Living room centerpiece seating' },
    { name: 'L-Shaped Sofas', slug: 'l-shaped-sofas', desc: 'Panoramic corner loungers' },
    { name: 'U-Shaped Sofas', slug: 'u-shaped-sofas', desc: 'Grand conversational suites' },
    { name: 'Sectional Sofas', slug: 'sectional-sofas', desc: 'Modular architectural layouts' },
    { name: 'Chesterfield Sofas', slug: 'chesterfield-sofas', desc: 'Hand-tufted heritage classics' },
    { name: 'Curved Sofas', slug: 'curved-sofas', desc: 'Organic sculpted Milanese forms' },
    { name: 'Luxury Sofas', slug: 'luxury-sofas', desc: 'Bespoke hand-tailored studio creations' },
  ];

  const chairCategories = [
    { name: 'Fancy Chairs', slug: 'fancy-chairs', desc: 'Artisanal sculptural statements' },
    { name: 'Accent Chairs', slug: 'accent-chairs', desc: 'Architectural focal points' },
    { name: 'Lounge Chairs', slug: 'lounge-chairs', desc: 'Deep ergonomic relaxation' },
    { name: 'Wingback Chairs', slug: 'wingback-chairs', desc: 'Regal acoustic shelter silhouettes' },
    { name: 'Tub Chairs', slug: 'tub-chairs', desc: 'Enveloping barrel curved comfort' },
    { name: 'Royal Chairs', slug: 'royal-chairs', desc: 'Hand-carved teak palatial heirlooms' },
  ];

  const signatureCollections = [
    { name: 'Milano Opulence', slug: 'milano-opulence', tagline: 'Italian Haute Couture Living' },
    { name: 'Royal Heritage', slug: 'royal-heritage', tagline: 'Chesterfield Tufting & Teak' },
    { name: 'Scandinavian Serenity', slug: 'scandinavian-serenity', tagline: 'Organic Curves & Oak' },
    { name: 'Art Deco Atelier', slug: 'art-deco-atelier', tagline: 'Geometric Precision & Brass' },
  ];

  return (
    <>
      {/* Top Architectural Notice Bar */}
      <div className="bg-graphite-deep text-platinum-soft text-xs py-2 px-4 border-b border-graphite-border">
        <div className="max-w-site mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-platinum">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-muted" />
              <span className="font-medium tracking-wide">Bespoke Manufacturing Atelier • Bodla &amp; Civil Lines, Agra</span>
            </span>
            <span className="hidden md:inline text-slate-silver">|</span>
            <span className="hidden md:inline text-slate-silver">10-Year Solid Hardwood Structural Guarantee</span>
          </div>
          <div className="flex items-center space-x-5">
            <Link href="/consultation" className="hover:text-platinum transition-colors text-[11px] font-medium">
              Book Private Consultation
            </Link>
            <Link href="/admin" className="hover:text-platinum transition-colors text-[11px] opacity-75 hover:opacity-100">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Architectural Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur shadow-subtle py-3 border-b border-platinum-border'
            : 'bg-white py-4 border-b border-platinum-border'
        }`}
      >
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-graphite flex items-center justify-center text-platinum font-serif font-bold text-lg group-hover:bg-graphite-hover transition-colors">
              P
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-graphite leading-none">
                PRADEEP
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-slate-dark uppercase font-semibold mt-0.5">
                Furniture Atelier
              </span>
            </div>
          </Link>

          {/* Centre: Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-medium text-graphite">
            <Link 
              href="/" 
              className={`hover:text-graphite-hover transition-colors ${pathname === '/' ? 'font-semibold text-graphite' : 'text-slate-dark'}`}
            >
              Home
            </Link>

            {/* Sofas Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('sofas')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button 
                className="flex items-center space-x-1 hover:text-graphite transition-colors py-2 text-slate-dark hover:text-graphite"
              >
                <span>Sofas</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-dark" />
              </button>

              {megaMenuOpen === 'sofas' && (
                <div className="absolute top-full -left-8 w-[520px] bg-white rounded-lg shadow-elevated border border-platinum-border p-6 grid grid-cols-2 gap-3 z-50 animate-in fade-in duration-150">
                  <div className="col-span-2 pb-2 border-b border-platinum-border flex justify-between items-center">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-dark">Sofa Architecture</span>
                    <Link href="/products?type=SOFA" className="text-xs text-graphite hover:underline font-semibold flex items-center space-x-1">
                      <span>View All Sofas</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {sofaCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="p-2.5 rounded-md hover:bg-platinum-soft transition-colors block border border-transparent hover:border-platinum-border"
                    >
                      <span className="font-sans font-semibold text-graphite text-xs block">{c.name}</span>
                      <span className="text-[11px] text-slate-muted block mt-0.5">{c.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Chairs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('chairs')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="flex items-center space-x-1 hover:text-graphite transition-colors py-2 text-slate-dark hover:text-graphite">
                <span>Fancy Chairs</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-dark" />
              </button>

              {megaMenuOpen === 'chairs' && (
                <div className="absolute top-full -left-8 w-[480px] bg-white rounded-lg shadow-elevated border border-platinum-border p-6 grid grid-cols-2 gap-3 z-50 animate-in fade-in duration-150">
                  <div className="col-span-2 pb-2 border-b border-platinum-border flex justify-between items-center">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-dark">Designer Chairs</span>
                    <Link href="/products?type=CHAIR" className="text-xs text-graphite hover:underline font-semibold flex items-center space-x-1">
                      <span>View All Chairs</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {chairCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="p-2.5 rounded-md hover:bg-platinum-soft transition-colors block border border-transparent hover:border-platinum-border"
                    >
                      <span className="font-sans font-semibold text-graphite text-xs block">{c.name}</span>
                      <span className="text-[11px] text-slate-muted block mt-0.5">{c.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('collections')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="flex items-center space-x-1 hover:text-graphite transition-colors py-2 text-slate-dark hover:text-graphite">
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-dark" />
              </button>

              {megaMenuOpen === 'collections' && (
                <div className="absolute top-full -left-4 w-[340px] bg-white rounded-lg shadow-elevated border border-platinum-border p-5 space-y-2.5 z-50 animate-in fade-in duration-150">
                  <div className="pb-2 border-b border-platinum-border">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-dark">Signature Lines</span>
                  </div>
                  {signatureCollections.map((col) => (
                    <Link
                      key={col.slug}
                      href={`/collections#${col.slug}`}
                      className="p-2 rounded-md hover:bg-platinum-soft transition-colors block"
                    >
                      <span className="font-sans font-semibold text-graphite text-xs block">{col.name}</span>
                      <span className="text-[11px] text-slate-muted block mt-0.5">{col.tagline}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/studio" className="hover:text-graphite transition-colors text-slate-dark hover:text-graphite">
              Customize Furniture
            </Link>

            <Link href="/manufacturing" className="hover:text-graphite transition-colors text-slate-dark hover:text-graphite">
              Manufacturing
            </Link>

            <Link href="/projects" className="hover:text-graphite transition-colors text-slate-dark hover:text-graphite">
              Our Projects
            </Link>

            <Link href="/about" className="hover:text-graphite transition-colors text-slate-dark hover:text-graphite">
              About
            </Link>

            <Link href="/contact" className="hover:text-graphite transition-colors text-slate-dark hover:text-graphite">
              Contact
            </Link>
          </nav>

          {/* Right: Search, Contact & Request Quote CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-dark hover:text-graphite transition-colors rounded-md hover:bg-platinum-soft"
              title="Search catalogue"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/custom-design"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs uppercase tracking-wider font-semibold transition-all shadow-subtle border border-graphite"
            >
              <span>Request Quote</span>
            </Link>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-graphite rounded-md hover:bg-platinum-soft"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-graphite rounded-md hover:bg-platinum-soft"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-platinum-border px-6 py-6 space-y-4 max-h-[82vh] overflow-y-auto">
            <Link href="/" className="block py-2 font-medium text-graphite hover:text-graphite-hover">
              Home
            </Link>

            <div className="border-t border-platinum-border pt-3">
              <span className="text-[11px] uppercase font-bold text-slate-dark tracking-wider block mb-2">Sofas</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sofaCategories.map((c) => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`} className="py-1 text-slate-dark hover:text-graphite">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-platinum-border pt-3">
              <span className="text-[11px] uppercase font-bold text-slate-dark tracking-wider block mb-2">Fancy Chairs</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {chairCategories.map((c) => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`} className="py-1 text-slate-dark hover:text-graphite">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-platinum-border pt-3 space-y-2 text-sm font-medium">
              <Link href="/collections" className="block text-graphite py-1">Collections</Link>
              <Link href="/studio" className="block text-graphite py-1">Customize Furniture (3D Studio)</Link>
              <Link href="/manufacturing" className="block text-graphite py-1">Our Manufacturing</Link>
              <Link href="/projects" className="block text-graphite py-1">Our Projects</Link>
              <Link href="/about" className="block text-graphite py-1">About Us</Link>
              <Link href="/contact" className="block text-graphite py-1">Contact</Link>
            </div>

            <div className="pt-4 border-t border-platinum-border">
              <Link
                href="/custom-design"
                className="w-full block py-3 text-center rounded-md bg-graphite text-white text-xs uppercase tracking-widest font-semibold"
              >
                Request Quotation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Architectural Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-lg max-w-xl w-full p-6 shadow-elevated border border-platinum-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-platinum-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark">
                Architectural Search
              </span>
              <button onClick={() => setSearchOpen(false)} className="text-slate-dark hover:text-graphite">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search sofas, fancy chairs, materials, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-platinum-soft border border-platinum-border text-xs text-graphite focus:outline-none focus:border-graphite"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-dark absolute left-3.5 top-3.5" />
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-muted">
              <span>Press <strong className="text-graphite">Enter</strong> to view matching catalogue items</span>
              <Link
                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchOpen(false)}
                className="font-semibold text-graphite hover:underline"
              >
                Explore All →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
