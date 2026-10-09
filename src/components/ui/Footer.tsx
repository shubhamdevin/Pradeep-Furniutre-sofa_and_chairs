import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Box, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-deep text-ivory-100 border-t border-charcoal-light relative">
      {/* Upper Atelier Assurance Banner */}
      <div className="border-b border-charcoal-light py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-gold border border-gold/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">10-Year Guarantee</h4>
              <p className="text-xs text-ivory-300">Kiln-dried hardwood frame guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-gold border border-gold/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Bespoke Customization</h4>
              <p className="text-xs text-ivory-300">Millimeter-accurate CAD dimensions</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-gold border border-gold/30">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Interactive 3D Visualizer</h4>
              <p className="text-xs text-ivory-300">Inspect 360° geometry prior to carving</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-gold border border-gold/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Non-E-Commerce Atelier</h4>
              <p className="text-xs text-ivory-300">Personalized offline quotation &amp; visits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center border border-gold/40 text-gold">
                <span className="font-serif font-bold text-lg">P</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  PRADEEP
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-gold uppercase font-medium mt-0.5">
                  Furniture Atelier
                </span>
              </div>
            </div>

            <p className="text-xs text-ivory-300 leading-relaxed max-w-sm">
              Custom manufacturers of luxury sofas, fancy statement chairs, and bespoke upholstered seating. Operating direct artisan workshops with seasoned kiln-dried timber frames, high resilience foams, and European luxury fabrics.
            </p>

            <div className="space-y-2 pt-2 text-xs text-ivory-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Atelier Works:</strong> Plot 42-44, Bodla Industrial Zone, Agra, UP - 282007
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Showroom Gallery:</strong> 18 Civil Lines, Heritage Boulevard, Agra, UP - 282002
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+91 98970 23456 / +91 98970 23457</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>bespoke@pradeepfurniture.com</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Mon - Sat: 10:00 AM - 8:00 PM | Sun: By Appointment</span>
              </div>
            </div>
          </div>

          {/* Quick Furniture Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider text-gold">
              Sofa Collections
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300">
              <li><Link href="/products?category=curved-sofas" className="hover:text-gold transition-colors">Curved Sofas</Link></li>
              <li><Link href="/products?category=chesterfield-sofas" className="hover:text-gold transition-colors">Chesterfield Sofas</Link></li>
              <li><Link href="/products?category=l-shaped-sofas" className="hover:text-gold transition-colors">L-Shaped Sectionals</Link></li>
              <li><Link href="/products?category=u-shaped-sofas" className="hover:text-gold transition-colors">U-Shaped Conversational</Link></li>
              <li><Link href="/products?category=3-seater-sofas" className="hover:text-gold transition-colors">3-Seater Classic Sofas</Link></li>
              <li><Link href="/products?category=2-seater-sofas" className="hover:text-gold transition-colors">2-Seater Love Seats</Link></li>
              <li><Link href="/products?category=luxury-sofas" className="hover:text-gold transition-colors">Italian Luxury Suites</Link></li>
            </ul>
          </div>

          {/* Fancy Chairs */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider text-gold">
              Fancy Chairs
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300">
              <li><Link href="/products?category=accent-chairs" className="hover:text-gold transition-colors">Accent Statement Chairs</Link></li>
              <li><Link href="/products?category=lounge-chairs" className="hover:text-gold transition-colors">Mid-Century Lounge Chairs</Link></li>
              <li><Link href="/products?category=wingback-chairs" className="hover:text-gold transition-colors">Sovereign Wingback Chairs</Link></li>
              <li><Link href="/products?category=tub-chairs" className="hover:text-gold transition-colors">Fluted Barrel Tub Chairs</Link></li>
              <li><Link href="/products?category=royal-chairs" className="hover:text-gold transition-colors">Hand-Carved Royal Armchairs</Link></li>
              <li><Link href="/products?category=custom-furniture" className="hover:text-gold transition-colors">Bespoke Commission Seating</Link></li>
            </ul>
          </div>

          {/* Bespoke Services & Operations */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider text-gold">
              Bespoke Atelier
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300">
              <li><Link href="/custom-design" className="hover:text-gold transition-colors flex items-center space-x-1"><span>Upload Custom Photo</span> <ArrowUpRight className="w-3 h-3 text-gold" /></Link></li>
              <li><Link href="/studio" className="hover:text-gold transition-colors">3D Custom Studio</Link></li>
              <li><Link href="/manufacturing" className="hover:text-gold transition-colors">Factory &amp; Woodcraft Process</Link></li>
              <li><Link href="/materials" className="hover:text-gold transition-colors">Fabrics &amp; Timber Swatches</Link></li>
              <li><Link href="/projects" className="hover:text-gold transition-colors">Completed Installations</Link></li>
              <li><Link href="/architects" className="hover:text-gold transition-colors">Architects &amp; Bulk Projects</Link></li>
              <li><Link href="/consultation" className="hover:text-gold transition-colors">Book Factory/Showroom Visit</Link></li>
              <li><Link href="/admin" className="hover:text-gold transition-colors text-ivory-400">Atelier Staff Management Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Absolute Business Compliance Notice */}
        <div className="mt-12 pt-8 border-t border-charcoal-light">
          <div className="bg-charcoal/60 rounded-xl p-4 border border-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-ivory-300">
              <strong className="text-gold font-semibold uppercase tracking-wider mr-2">Notice:</strong>
              This platform is a dedicated digital showcase and custom manufacturing atelier. We do not provide consumer e-commerce checkouts, carts, or online card processing. All furniture is custom-crafted to your space, with quotations finalized offline via verified consultation and bank transfers.
            </div>
            <div className="text-xs font-mono text-ivory-400 whitespace-nowrap">
              GSTIN: 09AABCP1234F1Z9
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-charcoal-light flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-400 gap-4">
          <p>© 2026 Pradeep Furniture Atelier. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center space-x-6">
            <Link href="/licences" className="hover:text-gold transition-colors">
              3D Asset Registry &amp; Licensing
            </Link>
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Manufacturing Terms &amp; Warranty
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
