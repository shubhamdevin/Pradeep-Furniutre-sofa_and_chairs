'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown,
  ChevronRight,
  ArrowRight,
  House,
  Layers,
  Sparkles,
  Heart,
  MapPin,
} from 'lucide-react';
import LocationIcon from '@/components/ui/LocationIcon';
import { useWishlist } from '@/components/furniture/WishlistProvider';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { productIds } = useWishlist();

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let frame = 0;
    setIsHidden(false);
    setIsScrolled(previousY > 20);
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        // Clamp overscroll so a bounce at either edge cannot reverse direction.
        const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const currentY = Math.max(0, Math.min(window.scrollY, maxY));
        const delta = currentY - previousY;
        setIsScrolled(currentY > 20);
        if (currentY <= 20 || mobileMenuOpen || headerRef.current?.querySelector(':focus-visible')) {
          setIsHidden(false);
        } else if (delta < 0) {
          setIsHidden(false);
        } else if (delta > 0 && currentY > (headerRef.current?.offsetHeight ?? 80)) {
          setIsHidden(true);
          setMegaMenuOpen(null);
        }
        previousY = currentY;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [mobileMenuOpen, pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(null);
  }, [pathname]);

  const sofaCategories = [
    { name: '2-Seater Sofas', slug: '2-seater-sofas' },
    { name: '3-Seater Sofas', slug: '3-seater-sofas' },
    { name: 'L-Shaped Sofas', slug: 'l-shaped-sofas' },
    { name: 'U-Shaped Sofas', slug: 'u-shaped-sofas' },
    { name: 'Sectional Sofas', slug: 'sectional-sofas' },
    { name: 'Chesterfield Sofas', slug: 'chesterfield-sofas' },
    { name: 'Curved Sofas', slug: 'curved-sofas' },
    { name: 'Luxury Sofas', slug: 'luxury-sofas' },
  ];

  const chairCategories = [
    { name: 'Fancy Chairs', slug: 'fancy-chairs' },
    { name: 'Accent Chairs', slug: 'accent-chairs' },
    { name: 'Lounge Chairs', slug: 'lounge-chairs' },
    { name: 'Wingback Chairs', slug: 'wingback-chairs' },
    { name: 'Tub Chairs', slug: 'tub-chairs' },
    { name: 'Royal Chairs', slug: 'royal-chairs' },
  ];

  return (
    <>
      {/* Top Announcement Bar matching mockup */}
      <div className="bg-[#121417] text-[#D1D5DB] text-[11px] py-1.5 px-4 font-sans">
        <div className="max-w-site mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white tracking-wide">
              Bespoke Sofas &amp; Designer Chairs
            </span>
            <span className="text-[#6B7280] hidden sm:inline">|</span>
            <span className="text-[#9CA3AF] hidden sm:inline">Manufacturer Since 1999</span>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] text-[#9CA3AF]">
            <Link href="/consultation" className="hidden sm:inline hover:text-white transition-colors">
              Showroom
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/manufacturing" className="hidden sm:inline hover:text-white transition-colors">
              Factory Tour
            </Link>
            <span className="hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1.5 text-white font-medium">
              <LocationIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Agra, India</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Navbar matching mockup */}
      <header
        ref={headerRef}
        onFocusCapture={() => setIsHidden(false)}
        className={`site-scroll-header sticky top-0 z-50 ${isHidden ? "is-scroll-hidden" : ""} ${
          isScrolled
            ? 'bg-white shadow-sm py-3'
            : 'bg-white py-3'
        }`}
      >
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Brand Logo matching Velora style in mockup */}
          <Link href="/" className="group flex items-center space-x-2.5">
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-[#111417] leading-none">
                PRADEEP
              </span>
              <span className="block text-[8px] tracking-[0.25em] text-slate-500 uppercase font-bold mt-0.5">
                FURNITURE MANUFACTURER
              </span>
            </div>
          </Link>

          {/* Centre Navigation Links matching mockup */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-medium text-[#111417]">
            <Link 
              href="/" 
              className={`hover:text-black transition-colors ${pathname === '/' ? 'font-bold text-black border-b-2 border-black pb-0.5' : 'text-slate-700'}`}
            >
              Home
            </Link>

            {/* Sofas Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('sofas')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="flex items-center space-x-1 text-slate-700 hover:text-black transition-colors py-1">
                <span>Sofas</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {megaMenuOpen === 'sofas' && (
                <div className="absolute top-full -left-4 w-60 bg-white rounded-lg shadow-xl border border-slate-200 p-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in duration-150">
                  {sofaCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="p-2 rounded-md hover:bg-slate-100 text-xs font-medium text-slate-800 transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Fancy Chairs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('chairs')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button className="flex items-center space-x-1 text-slate-700 hover:text-black transition-colors py-1">
                <span>Fancy Chairs</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {megaMenuOpen === 'chairs' && (
                <div className="absolute top-full -left-4 w-60 bg-white rounded-lg shadow-xl border border-slate-200 p-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in duration-150">
                  {chairCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="p-2 rounded-md hover:bg-slate-100 text-xs font-medium text-slate-800 transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/collections" className="text-slate-700 hover:text-black transition-colors">
              Collections
            </Link>

            <Link href="/custom-design" className="text-slate-700 hover:text-black transition-colors">
              Customize
            </Link>

            <Link href="/manufacturing" className="text-slate-700 hover:text-black transition-colors">
              Manufacturing
            </Link>

            <Link href="/projects" className="text-slate-700 hover:text-black transition-colors">
              Projects
            </Link>

            <Link href="/about" className="text-slate-700 hover:text-black transition-colors">
              About
            </Link>

            <Link href="/contact" className="text-slate-700 hover:text-black transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="header-wishlist-link"
              aria-label={`Saved designs${productIds.length ? `, ${productIds.length} saved` : ''}`}
              title="Saved designs"
            >
              <Heart size={18} />
              {productIds.length > 0 && <span>{productIds.length > 99 ? '99+' : productIds.length}</span>}
            </Link>
            <Link
              href="/products"
              className="p-2 text-slate-700 hover:text-black transition-colors rounded-full hover:bg-slate-100"
              title="Search Catalogue"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href="/custom-design"
              className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#111417] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`mobile-hamburger lg:hidden ${mobileMenuOpen ? 'is-open' : ''}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            >
              <span className="mobile-hamburger__line" />
              <span className="mobile-hamburger__line" />
              <span className="mobile-hamburger__line" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer with Smooth Expand & Staggered Animation */}
        <div className={`mobile-drawer-wrapper lg:hidden ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="mobile-drawer-inner px-4 pt-3 pb-6 space-y-2.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/products?type=SOFA"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Sofas</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/products?category=fancy-chairs"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Fancy Chairs</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Collections</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/custom-design"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Customize Furniture</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/manufacturing"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Manufacturing</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Projects</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>About Us</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-item flex items-center justify-between py-2.5 text-sm font-semibold text-slate-900 border-b border-slate-100 hover:text-black hover:pl-1 transition-all"
            >
              <span>Contact</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <div className="mobile-drawer-item pt-2">
              <Link
                href="/custom-design"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-3 rounded-lg bg-[#111417] text-white hover:bg-black text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                Request a Quote →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <nav className="mobile-app-nav" aria-label="Mobile primary navigation">
        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className={`mobile-app-nav__link${pathname === '/' ? ' is-active' : ''}`}>
          <House aria-hidden="true" />
          <span>Home</span>
        </Link>
        <Link href="/products" aria-current={pathname.startsWith('/products') ? 'page' : undefined} className={`mobile-app-nav__link${pathname.startsWith('/products') ? ' is-active' : ''}`}>
          <Search aria-hidden="true" />
          <span>Explore</span>
        </Link>
        <Link href="/collections" aria-current={pathname.startsWith('/collections') ? 'page' : undefined} className={`mobile-app-nav__link${pathname.startsWith('/collections') ? ' is-active' : ''}`}>
          <Layers aria-hidden="true" />
          <span>Collections</span>
        </Link>
        <Link href="/wishlist" aria-current={pathname.startsWith('/wishlist') ? 'page' : undefined} className={`mobile-app-nav__link${pathname.startsWith('/wishlist') ? ' is-active' : ''}`}>
          <span className="mobile-app-nav__icon-wrap"><Heart aria-hidden="true" />{productIds.length > 0 && <i>{productIds.length > 99 ? '99+' : productIds.length}</i>}</span>
          <span>Saved</span>
        </Link>
        <Link href="/custom-design" aria-current={pathname.startsWith('/custom-design') || pathname.startsWith('/studio') ? 'page' : undefined} className={`mobile-app-nav__link${pathname.startsWith('/custom-design') || pathname.startsWith('/studio') ? ' is-active' : ''}`}>
          <Sparkles aria-hidden="true" />
          <span>Design</span>
        </Link>
      </nav>
    </>
  );
}
