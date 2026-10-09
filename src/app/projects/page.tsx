import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await prisma.projectPortfolio.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Verified Atelier Portfolio
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            Completed Projects &amp; Case Studies
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            Inspect our completed bespoke seating installations in luxury private penthouses, boutique heritage suites, and modernist architectural estates across Northern India.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-16">
          {projects.map((p, idx) => (
            <div
              key={p.id}
              id={p.slug}
              className={`bg-white rounded-lg overflow-hidden border border-platinum-border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-6 h-full min-h-[380px] relative bg-platinum-soft">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 p-8 sm:p-10 space-y-5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-dark uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-graphite" />
                  <span>{p.clientType}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-graphite" />
                  <span>{p.location}</span>
                </div>

                <h2 className="font-serif text-3xl font-medium text-graphite">
                  {p.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                  {p.description}
                </p>

                <div className="bg-platinum-soft/50 p-4 rounded-md border border-platinum-border space-y-2 text-xs">
                  <div>
                    <strong className="text-slate-dark block">Architectural Challenge:</strong>
                    <span className="text-graphite/90 leading-relaxed">{p.challengeAndWork}</span>
                  </div>
                  <div className="pt-2 border-t border-platinum-border">
                    <strong className="text-slate-dark block">Custom Furniture Supplied:</strong>
                    <span className="text-graphite font-semibold">{p.furnitureSupplied}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/custom-design?type=${encodeURIComponent(p.title)}`}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs font-medium uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>Commission Similar Installation</span>
                    <ArrowRight className="w-4 h-4 text-slate-silver" />
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
