import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Sparkles, MapPin, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await prisma.projectPortfolio.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Verified Atelier Portfolio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal">
            Completed Projects &amp; Case Studies
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            Inspect our completed bespoke seating installations in luxury private penthouses, boutique heritage suites, and modernist architectural estates across Northern India.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-16">
          {projects.map((p, idx) => (
            <div
              key={p.id}
              id={p.slug}
              className={`bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-6 h-full min-h-[380px] relative bg-ivory-100">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 p-8 sm:p-10 space-y-5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-walnut uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span>{p.clientType}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{p.location}</span>
                </div>

                <h2 className="font-serif text-3xl font-medium text-charcoal">
                  {p.title}
                </h2>

                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  {p.description}
                </p>

                <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 space-y-2 text-xs">
                  <div>
                    <strong className="text-walnut block">Architectural Challenge:</strong>
                    <span className="text-charcoal/80 leading-relaxed">{p.challengeAndWork}</span>
                  </div>
                  <div className="pt-2 border-t border-ivory-200">
                    <strong className="text-walnut block">Custom Furniture Supplied:</strong>
                    <span className="text-charcoal font-semibold">{p.furnitureSupplied}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/custom-design?type=${encodeURIComponent(p.title)}`}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-charcoal text-white hover:bg-charcoal-light text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>Commission Similar Installation</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
