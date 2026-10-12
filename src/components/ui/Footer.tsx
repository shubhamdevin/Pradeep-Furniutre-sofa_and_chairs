import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Box, 
  ArrowUpRight 
} from 'lucide-react';
import LocationIcon from '@/components/ui/LocationIcon';

export default function Footer() {
  return (
    <footer className="atelier-footer bg-[#0f1311] text-[#e2e8f0] border-t-2 border-[#a7864e]/60 relative pb-24 lg:pb-10">
      {/* Upper Atelier Assurance Banner */}
      <div className="border-b border-[#222a24] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#131915]/60">
        <div className="max-w-site mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 10-Year Guarantee */}
          <div className="bg-[#171e19] border border-[#263229] p-4 rounded-xl flex items-center space-x-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#202923] flex items-center justify-center text-[#e2cfb0] border border-[#2e3c31] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#e2cfb0]" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white">10-Year Guarantee</h4>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">Kiln-dried hardwood structural warranty</p>
            </div>
          </div>

          {/* Bespoke Customization */}
          <div className="bg-[#171e19] border border-[#263229] p-4 rounded-xl flex items-center space-x-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#202923] flex items-center justify-center text-[#e2cfb0] border border-[#2e3c31] flex-shrink-0">
              <Compass className="w-5 h-5 text-[#e2cfb0]" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Bespoke Customization</h4>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">Millimeter-accurate architectural CAD</p>
            </div>
          </div>

          {/* Agra Atelier Workshop */}
          <div className="bg-[#171e19] border border-[#263229] p-4 rounded-xl flex items-center space-x-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#202923] flex items-center justify-center text-[#e2cfb0] border border-[#2e3c31] flex-shrink-0">
              <Box className="w-5 h-5 text-[#e2cfb0]" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Agra Atelier Workshop</h4>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">Direct factory production &amp; joinery</p>
            </div>
          </div>

          {/* Non-E-Commerce Studio */}
          <div className="bg-[#171e19] border border-[#263229] p-4 rounded-xl flex items-center space-x-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#202923] flex items-center justify-center text-[#e2cfb0] border border-[#2e3c31] flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#e2cfb0]" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Direct Atelier Studio</h4>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">Personalized offline consultations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info & Highlighted Contact Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Pradeep Furniture Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-lg object-contain border border-[#a7864e]/50 shadow-md bg-[#19221b]"
              />
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  PRADEEP
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-[#e2cfb0] uppercase font-bold mt-1">
                  Furniture Atelier
                </span>
              </div>
            </div>

            <p className="text-xs text-[#cbd5e1] leading-relaxed max-w-sm">
              Custom manufacturers of architectural sofas, statement fancy chairs, and bespoke upholstered seating. Operating direct workshops with seasoned kiln-dried timber frames, high resilience comfort cores, and European contract-grade textiles.
            </p>

            {/* Highlighted Atelier Contact Box */}
            <div className="bg-[#151c17] border border-[#263229] rounded-xl p-4 space-y-2.5 text-xs text-[#cbd5e1] shadow-inner">
              <div className="flex items-start space-x-2.5">
                <LocationIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Atelier Workshop &amp; Gallery:</strong>{' '}
                  <span className="text-[#e2e8f0]">Nagla Latoori Singh, Deori Road, Agra, UP</span>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-[#e2cfb0] flex-shrink-0" />
                <a href="tel:+918445553853" className="text-white font-semibold hover:text-[#e2cfb0] transition-colors">
                  +91 8445553853
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-[#e2cfb0] flex-shrink-0" />
                <a href="mailto:pradeepfurniture2@gmail.com" className="text-[#cbd5e1] hover:text-[#e2cfb0] transition-colors">
                  pradeepfurniture2@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2.5 text-[11px] text-[#94a3b8] pt-1 border-t border-[#222c24]">
                <Clock className="w-3 h-3 text-[#e2cfb0] flex-shrink-0" />
                <span>Monday – Saturday: 10:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Sofas Links */}
          <div className="space-y-3">
            <div>
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Sofa Collections</h5>
              <div className="w-6 h-0.5 bg-[#e2cfb0] mt-1.5" />
            </div>
            <ul className="space-y-2.5 text-xs text-[#cbd5e1]">
              <li><Link href="/products?category=2-seater-sofas" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">2-Seater Sofas</Link></li>
              <li><Link href="/products?category=3-seater-sofas" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">3-Seater Sofas</Link></li>
              <li><Link href="/products?category=l-shaped-sofas" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">L-Shaped Sectionals</Link></li>
              <li><Link href="/products?category=u-shaped-sofas" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">U-Shaped Modulars</Link></li>
              <li><Link href="/products?category=chesterfield-sofas" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Chesterfield Suites</Link></li>
              <li><Link href="/products?category=curved-sofas" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Curved Architectural Sofas</Link></li>
            </ul>
          </div>

          {/* Chairs Links */}
          <div className="space-y-3">
            <div>
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Fancy Chairs</h5>
              <div className="w-6 h-0.5 bg-[#e2cfb0] mt-1.5" />
            </div>
            <ul className="space-y-2.5 text-xs text-[#cbd5e1]">
              <li><Link href="/products?category=fancy-chairs" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Fancy Chairs</Link></li>
              <li><Link href="/products?category=accent-chairs" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Accent Chairs</Link></li>
              <li><Link href="/products?category=lounge-chairs" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Lounge Chairs</Link></li>
              <li><Link href="/products?category=wingback-chairs" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Wingback Chairs</Link></li>
              <li><Link href="/products?category=tub-chairs" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Tub &amp; Barrel Chairs</Link></li>
              <li><Link href="/products?category=royal-chairs" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Royal Teak Carved Chairs</Link></li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="space-y-3">
            <div>
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-white">Studio &amp; Services</h5>
              <div className="w-6 h-0.5 bg-[#e2cfb0] mt-1.5" />
            </div>
            <ul className="space-y-2.5 text-xs text-[#cbd5e1]">
              <li><Link href="/custom-design" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Custom Furniture Studio</Link></li>
              <li><Link href="/custom-design" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Upload Reference Design</Link></li>
              <li><Link href="/manufacturing" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Workshop Craftsmanship</Link></li>
              <li><Link href="/projects" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">Completed Projects</Link></li>
              <li><Link href="/about" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform">About Our Atelier</Link></li>
              <li><Link href="/terms" className="hover:text-[#e2cfb0] hover:translate-x-1 inline-block transition-transform font-medium">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Lower Legal & Non-E-Commerce Policy Statement */}
        <div className="mt-10 pt-6 border-t border-[#232b25] flex flex-col md:flex-row items-center justify-between text-xs text-[#94a3b8] gap-4">
          <div>
            <span className="text-[#cbd5e1]">© {new Date().getFullYear()} Pradeep Furniture Atelier. All rights reserved. GSTIN: 09AABCP1234F1Z9.</span>
            <span className="block text-[11px] text-[#94a3b8] mt-0.5">
              Strict Non-E-Commerce Studio: All orders &amp; bespoke specifications are finalized directly via formal atelier contracts.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/terms" className="text-[#e2cfb0] underline hover:text-white transition-colors font-medium">
              Terms &amp; Conditions
            </Link>
            <Link href="/consultation" className="hover:text-white transition-colors">
              Book Appointment
            </Link>
            <Link href="/custom-design" className="hover:text-white transition-colors">
              Request Quotation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
