import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Atelier Commission & Commercial Policy | Pradeep Furniture',
  description: 'Official terms, bespoke manufacturing policies, warranty schedules, and offline transaction protocols for Pradeep Furniture Atelier.',
};

export default function TermsPage() {
  const termsList = [
    {
      title: '1. Strict Offline Commercial Protocol (Non-E-Commerce Policy)',
      points: [
        'Pradeep Furniture operates as a dedicated manufacturing atelier and bespoke design studio. This platform does not support online checkouts, shopping carts, or digital gateway transactions.',
        'All prices generated or discussed via online enquiry forms or the Smart Studio are preliminary estimates subject to technical validation.',
        'A commission is confirmed only upon the mutual execution of an official offline quotation contract, technical blueprint approval, and payment via direct RTGS/NEFT/IMPS bank transfer or official atelier cash receipt.',
      ],
    },
    {
      title: '2. Handcrafted Artisanal Tolerance & Natural Material Variance',
      points: [
        'Every sofa and accent chair is individually handcrafted by master carpenters and upholsterers in our Agra workshop, not mass-produced on robotic assembly lines.',
        'An industry-standard dimensional variance of ±0.5 inches (±12 mm) is considered normal and acceptable across custom upholstered furniture.',
        'Natural wood grains, character knots in solid CP teakwood/hardwoods, and dye-lot variations in genuine leather or Belgian contract textiles are authentic hallmarks of artisanal production.',
      ],
    },
    {
      title: '3. Production Lead Times & Fabrication Schedule',
      points: [
        'Standard fabrication lead time is 3 to 5 weeks for custom residential pieces, and 4 to 8 weeks for commercial volume commissions.',
        'Production timelines commence strictly after: (a) CAD / dimensions blueprint freeze by the client, (b) Fabric swatch selection confirmation, and (c) Mobilization deposit receipt.',
      ],
    },
    {
      title: '4. Spatial Access, Site Verification & Elevator Clearances',
      points: [
        'The customer is responsible for ensuring that the commissioned furniture dimensions can be transported through building entry gates, staircases, residential lifts, corridors, and doorways.',
        'Our atelier provides complimentary laser measurement consultation within Agra and Delhi NCR upon request prior to frame assembly.',
      ],
    },
    {
      title: '5. 10-Year Structural Frame Warranty & Foam Core Guarantee',
      points: [
        'Frames: Covered by a 10-year manufacturer warranty against joint failure, mortise-and-tenon structural defect, and termite infestion in seasoned kiln-dried hardwood.',
        'Foam Cores: Covered by a 5-year anti-sagging guarantee on 45D / 50D High-Resilience polyurethane foam and down-blend sandwich toppers.',
        'Warranty excludes normal surface wear, pet clawing, unauthorized fabric treatment, or commercial misuse.',
      ],
    },
    {
      title: '6. Bespoke Commission Cancellation & Revision Policy',
      points: [
        'Since bespoke furniture is manufactured exclusively to custom architectural specifications and chosen fabrics, orders cannot be cancelled or refunded once timber milling or fabric cutting has commenced.',
        'Any revision to dimensions or design elements after blueprint sign-off must be submitted in writing and may incur revised material charges and timeline adjustments.',
      ],
    },
    {
      title: '7. Multi-Layer Protective Packaging, Transit & Delivery Inspection',
      points: [
        'All pieces are dispatched with 5-layer heavy protective wrapping including corrugated edge protectors, bubble wrap, foam sheeting, and weather-resistant shrink wrap.',
        'Upon delivery, the client or designated site architect must inspect external upholstery before signing the Goods Delivery Receipt (POD).',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-platinum py-14 sm:py-20 text-graphite font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-dark hover:text-graphite font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Atelier Home</span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-platinum-soft border border-platinum-border text-xs font-semibold tracking-wider uppercase text-slate-dark">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a7864e]" />
              <span>Official Atelier Governance</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-graphite tracking-tight">
              Terms of Commission &amp; Commercial Conditions
            </h1>
            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed max-w-2xl">
              Pradeep Furniture Atelier operates with generational integrity, uncompromising craftsmanship, and transparent offline contractual protocols. Review our manufacturing guarantees and commercial terms below.
            </p>
          </div>
        </div>

        {/* Terms Accordion/List */}
        <div className="space-y-6">
          {termsList.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 sm:p-7 border border-platinum-border shadow-sm space-y-3"
            >
              <h2 className="font-serif text-lg sm:text-xl font-bold text-graphite flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#a7864e] shrink-0 mt-0.5" />
                <span>{t.title}</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-dark leading-relaxed pl-7 list-disc">
                {t.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Official Atelier Contact & Declarations */}
        <div className="bg-[#111417] text-white rounded-2xl p-6 sm:p-8 space-y-4 border border-[#303831] shadow-xl">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e2cfb0]" />
            <h3 className="font-serif text-lg font-bold tracking-wide text-white">
              Official Workshop &amp; Atelier Inquiries
            </h3>
          </div>
          <p className="text-xs text-[#cfc8bd] leading-relaxed">
            For specific contract clarifications, architectural project tenders, or customized legal annexures for commercial projects, contact our principal atelier desk directly:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-[#e8dfd2] border-t border-white/10">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#e2cfb0] shrink-0 mt-0.5" />
              <span>Nagla Latoori Singh, Deori Road, Agra, UP</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#e2cfb0] shrink-0" />
              <a href="tel:+918445553853" className="hover:text-white underline">
                +91 8445553853
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#e2cfb0] shrink-0" />
              <a href="mailto:pradeepfurniture2@gmail.com" className="hover:text-white underline">
                pradeepfurniture2@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
