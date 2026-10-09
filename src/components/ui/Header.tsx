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
  Compass, 
  Sparkles, 
  FileText,
  Sliders,
  Layers,
  ArrowRight
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
      setIsScrolled(window.scrollY > 30);
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
    { name: 'Luxury Sofas', slug: 'luxury-sofas', desc: 'Bespoke hand-gilded atelier creations' },
  ];

  const chairCategories = [
    { name: 'Fancy Chairs', slug: 'fancy-chairs', desc: 'Artisanal sculptural statements' },
    { name: 'Accent Chairs', slug: 'accent-chairs', desc: 'Design focal points for any room' },
    { name: 'Lounge Chairs', slug: 'lounge-chairs', desc: 'Deep ergonomic relaxation' },
    { name: 'Wingback Chairs', slug: 'wingback-chairs', desc: 'Regal acoustic shelter silhouettes' },
    { name: 'Tub Chairs', slug: 'tub-chairs', desc: 'Enveloping barrel curved comfort' },
    { name: 'Royal Chairs', slug: 'royal-chairs', desc: 'Hand-carved teak palatial heirlooms' },
  ];

  const signatureCollections = [
    { name: 'Milano Opulence', slug: 'milano-opulence', tagline: 'Italian Haute Couture Living' },
    { name: 'Royal Heritage', slug: 'royal-heritage', tagline: 'Chesterfield Tufting & Teak' },
    { name: 'Scandinavian Serenity', slug: 'scandinavian-serenity', tagline: 'Organic Curves & Oak' },
    { name: 'Art Deco Atelier', slug: 'art-deco-atelier', tagline: 'Geometric Glamour & Brass' },
  ];

  return (
    <>
      {/* Top Atelier Bar */}
      <div className="bg-charcoal text-ivory-200 text-xs py-2 px-4 border-b border-charcoal-light">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">Bespoke Manufacturing Atelier • Bodla &amp; Civil Lines, Agra</span>
            </span>
            <span className="hidden md:inline text-ivory-300">|</span>
            <span className="hidden md:inline text-ivory-300">10-Year Hardwood Frame Structural Guarantee</span>
          </div>
          <div className="flex items-center space-x-5">
            <Link href="/consultation" className="hover:text-gold transition-colors flex items-center space-x-1">
              <span>Book Atelier Visit</span>
            </Link>
            <Link href="/admin" className="hover:text-gold transition-colors text-[11px] opacity-80 hover:opacity-100">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-luxury py-3 border-b border-ivory-200'
            : 'bg-white py-4 border-b border-ivory-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center border border-gold/40 text-gold group-hover:scale-105 transition-transform shadow-sm">
              <span className="font-serif font-bold text-lg">P</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal leading-none">
                PRADEEP
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-walnut uppercase font-medium mt-0.5">
                Furniture Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-charcoal">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>

            {/* Sofas Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('sofas')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="flex items-center space-x-1 hover:text-gold transition-colors py-2">
                <span>Sofa Collection</span>
                <ChevronDown className="w-4 h-4 text-walnut" />
              </button>

              {megaMenuOpen === 'sofas' && (
                <div className="absolute top-full -left-12 w-[540px] bg-white rounded-2xl shadow-luxury-hover border border-ivory-300 p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="col-span-2 pb-2 border-b border-ivory-200 flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-wider text-gold">Sofa Silhouettes</span>
                    <Link href="/products?type=SOFA" className="text-xs text-walnut hover:text-charcoal font-medium flex items-center space-x-1">
                      <span>View All Sofas</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {sofaCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="p-2 rounded-xl hover:bg-ivory-100 transition-colors block"
                    >
                      <span className="font-serif font-medium text-charcoal text-sm block">{c.name}</span>
                      <span className="text-xs text-charcoal/60 block mt-0.5">{c.desc}</span>
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
              <button className="flex items-center space-x-1 hover:text-gold transition-colors py-2">
                <span>Fancy Chairs</span>
                <ChevronDown className="w-4 h-4 text-walnut" />
              </button>

              {megaMenuOpen === 'chairs' && (
                <div className="absolute top-full -left-12 w-[480px] bg-white rounded-2xl shadow-luxury-hover border border-ivory-300 p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="col-span-2 pb-2 border-b border-ivory-200 flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-wider text-gold">Designer Chairs</span>
                    <Link href="/products?type=CHAIR" className="text-xs text-walnut hover:text-charcoal font-medium flex items-center space-x-1">
                      <span>View All Chairs</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {chairCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="p-2 rounded-xl hover:bg-ivory-100 transition-colors block"
                    >
                      <span className="font-serif font-medium text-charcoal text-sm block">{c.name}</span>
                      <span className="text-xs text-charcoal/60 block mt-0.5">{c.desc}</span>
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
              <button className="flex items-center space-x-1 hover:text-gold transition-colors py-2">
                <span>Collections</span>
                <ChevronDown className="w-4 h-4 text-walnut" />
              </button>

              {megaMenuOpen === 'collections' && (
                <div className="absolute top-full -left-6 w-[360px] bg-white rounded-2xl shadow-luxury-hover border border-ivory-300 p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="pb-2 border-b border-ivory-200">
                    <span className="text-xs uppercase font-bold tracking-wider text-gold">Signature Ateliers</span>
                  </div>
                  {signatureCollections.map((col) => (
                    <Link
                      key={col.slug}
                      href={`/collections#${col.slug}`}
                      className="p-2 rounded-xl hover:bg-ivory-100 transition-colors block"
                    >
                      <span className="font-serif font-medium text-charcoal text-sm block">{col.name}</span>
                      <span className="text-xs text-walnut block mt-0.5">{col.tagline}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Studio */}
            <Link href="/studio" className="hover:text-gold transition-colors flex items-center space-x-1 text-gold font-semibold">
              <Sliders className="w-4 h-4" />
              <span>3D Studio</span>
            </Link>

            <Link href="/custom-design" className="hover:text-gold transition-colors">
              Custom Order
            </Link>

            <Link href="/manufacturing" className="hover:text-gold transition-colors">
              Manufacturing
            </Link>

            <Link href="/projects" className="hover:text-gold transition-colors">
              Projects
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-charcoal hover:text-gold transition-colors rounded-full hover:bg-ivory-100"
              title="Search furniture models"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/custom-design"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-charcoal text-ivory-100 hover:bg-charcoal-light hover:text-gold text-xs uppercase tracking-widest font-semibold transition-all shadow-md border border-charcoal hover:border-gold/50"
            >
              <FileText className="w-3.5 h-3.5 text-gold" />
              <span>Request Quotation</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-charcoal rounded-full hover:bg-ivory-100"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal rounded-lg hover:bg-ivory-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-ivory-300 px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <Link href="/" className="block py-2 font-medium text-charcoal hover:text-gold">
              Home
            </Link>

            <div className="border-t border-ivory-200 pt-3">
              <span className="text-xs uppercase font-bold text-gold tracking-wider block mb-2">Sofas</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sofaCategories.slice(0, 6).map((c) => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`} className="py-1.5 text-charcoal/80">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-ivory-200 pt-3">
              <span className="text-xs uppercase font-bold text-gold tracking-wider block mb-2">Chairs</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {chairCategories.map((c) => (
                  <Link key={c.slug} href={`/products?category=${c.slug}`} className="py-1.5 text-charcoal/80">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-ivory-200 pt-3 space-y-2">
              <Link href="/studio" className="block py-1 text-gold font-semibold">
                Interactive 3D Studio
              </Link>
              <Link href="/custom-design" className="block py-1 text-charcoal">
                Upload Custom Design
              </Link>
              <Link href="/manufacturing" className="block py-1 text-charcoal">
                Our Manufacturing &amp; Factory
              </Link>
              <Link href="/materials" className="block py-1 text-charcoal">
                Materials &amp; Fabrics
              </Link>
              <Link href="/projects" className="block py-1 text-charcoal">
                Completed Projects
              </Link>
              <Link href="/architects" className="block py-1 text-charcoal">
                Architects &amp; Bulk Enquiries
              </Link>
              <Link href="/about" className="block py-1 text-charcoal">
                About Atelier
              </Link>
              <Link href="/contact" className="block py-1 text-charcoal">
                Contact &amp; Showroom
              </Link>
            </div>

            <div className="pt-4 border-t border-ivory-200">
              <Link
                href="/custom-design"
                className="w-full text-center block py-3 rounded-xl bg-charcoal text-ivory-100 font-semibold text-xs uppercase tracking-widest"
              >
                Request Quotation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm p-4 flex items-start justify-center pt-24 animate-in fade-in duration-150">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-ivory-300 p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <span className="font-serif text-lg text-charcoal font-semibold">Search Furniture Atelier</span>
              <button onClick={() => setSearchOpen(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="mt-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search curved sofas, velvet loungers, wingback chairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold text-sm text-charcoal"
                />
                <Search className="w-5 h-5 text-walnut absolute left-3.5 top-3.5" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="text-walnut font-medium">Quick searches:</span>
                {['Curved Sectional', 'Mid-Century Chair', 'Chesterfield', 'Emerald Velvet', 'Wingback'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      window.location.href = `/products?search=${encodeURIComponent(tag)}`;
                    }}
                    className="px-2.5 py-1 bg-ivory-100 hover:bg-gold/20 text-charcoal rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
