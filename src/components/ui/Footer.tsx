import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Box, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-graphite-deep text-platinum-soft border-t border-graphite-border relative">
      {/* Upper Atelier Assurance Banner */}
      <div className="border-b border-graphite-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-site mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded bg-graphite-elevated flex items-center justify-center text-platinum border border-graphite-border">
              <ShieldCheck className="w-4 h-4 text-slate-silver" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white">10-Year Guarantee</h4>
              <p className="text-[11px] text-slate-silver">Kiln-dried hardwood structural guarantee</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded bg-graphite-elevated flex items-center justify-center text-platinum border border-graphite-border">
              <Compass className="w-4 h-4 text-slate-silver" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white">Bespoke Customization</h4>
              <p className="text-[11px] text-slate-silver">Millimeter-accurate architectural CAD dimensions</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded bg-graphite-elevated flex items-center justify-center text-platinum border border-graphite-border">
              <Box className="w-4 h-4 text-slate-silver" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white">3D Showroom</h4>
              <p className="text-[11px] text-slate-silver">Inspect 360° geometry prior to woodworking</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="w-9 h-9 rounded bg-graphite-elevated flex items-center justify-center text-platinum border border-graphite-border">
              <CheckCircle2 className="w-4 h-4 text-slate-silver" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white">Non-E-Commerce Studio</h4>
              <p className="text-[11px] text-slate-silver">Personalized offline quotation &amp; consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-graphite flex items-center justify-center border border-graphite-border text-platinum font-serif font-bold text-lg">
                P
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  PRADEEP
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-slate-silver uppercase font-semibold mt-0.5">
                  Furniture Atelier
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-silver leading-relaxed max-w-sm">
              Custom manufacturers of architectural sofas, statement chairs, and bespoke upholstered seating. Operating direct workshops with seasoned kiln-dried timber frames, high resilience comfort cores, and European contract-grade textiles.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-silver">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-platinum shrink-0 mt-0.5" />
                <span>
                  <strong>Atelier Works:</strong> Plot 42-44, Bodla Industrial Zone, Agra, UP - 282007
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-platinum shrink-0 mt-0.5" />
                <span>
                  <strong>Design Gallery:</strong> 18 Civil Lines, Heritage Boulevard, Agra, UP - 282002
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-platinum shrink-0" />
                <span>+91 98970 23456 • Monday – Saturday: 10:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-platinum shrink-0" />
                <span>bespoke@pradeepfurniture.com</span>
              </div>
            </div>
          </div>

          {/* Sofas Links */}
          <div className="space-y-3">
            <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Sofa Collections</h5>
            <ul className="space-y-2 text-xs text-slate-silver">
              <li><Link href="/products?category=2-seater-sofas" className="hover:text-white transition-colors">2-Seater Sofas</Link></li>
              <li><Link href="/products?category=3-seater-sofas" className="hover:text-white transition-colors">3-Seater Sofas</Link></li>
              <li><Link href="/products?category=l-shaped-sofas" className="hover:text-white transition-colors">L-Shaped Sectionals</Link></li>
              <li><Link href="/products?category=u-shaped-sofas" className="hover:text-white transition-colors">U-Shaped Modulars</Link></li>
              <li><Link href="/products?category=chesterfield-sofas" className="hover:text-white transition-colors">Chesterfield Suites</Link></li>
              <li><Link href="/products?category=curved-sofas" className="hover:text-white transition-colors">Curved Architectural Sofas</Link></li>
            </ul>
          </div>

          {/* Chairs Links */}
          <div className="space-y-3">
            <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Fancy Chairs</h5>
            <ul className="space-y-2 text-xs text-slate-silver">
              <li><Link href="/products?category=fancy-chairs" className="hover:text-white transition-colors">Fancy Chairs</Link></li>
              <li><Link href="/products?category=accent-chairs" className="hover:text-white transition-colors">Accent Chairs</Link></li>
              <li><Link href="/products?category=lounge-chairs" className="hover:text-white transition-colors">Lounge Chairs</Link></li>
              <li><Link href="/products?category=wingback-chairs" className="hover:text-white transition-colors">Wingback Chairs</Link></li>
              <li><Link href="/products?category=tub-chairs" className="hover:text-white transition-colors">Tub &amp; Barrel Chairs</Link></li>
              <li><Link href="/products?category=royal-chairs" className="hover:text-white transition-colors">Royal Teak Carved Chairs</Link></li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="space-y-3">
            <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Studio &amp; B2B</h5>
            <ul className="space-y-2 text-xs text-slate-silver">
              <li><Link href="/studio" className="hover:text-white transition-colors">3D Customizer Studio</Link></li>
              <li><Link href="/custom-design" className="hover:text-white transition-colors">Upload Design Photo</Link></li>
              <li><Link href="/architects" className="hover:text-white transition-colors">Architects &amp; Interior Designers</Link></li>
              <li><Link href="/materials" className="hover:text-white transition-colors">Materials &amp; Foam Specs</Link></li>
              <li><Link href="/manufacturing" className="hover:text-white transition-colors">Workshop Craftsmanship</Link></li>
              <li><Link href="/licences" className="hover:text-white transition-colors">3D Asset Registry</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Factory Management Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Lower Legal & Non-E-Commerce Policy Statement */}
        <div className="mt-12 pt-8 border-t border-graphite-border flex flex-col md:flex-row items-center justify-between text-xs text-slate-silver gap-4">
          <div>
            <span>© {new Date().getFullYear()} Pradeep Furniture Atelier. All rights reserved. GSTIN: 09AABCP1234F1Z9.</span>
            <span className="block text-[11px] text-slate-silver/70 mt-0.5">
              Strict Non-E-Commerce Manufacturer: Orders and payments are finalized offline via formal atelier contracts.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/consultation" className="hover:text-white transition-colors">Book Private Appointment</Link>
            <Link href="/custom-design" className="hover:text-white transition-colors">Request Quotation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
