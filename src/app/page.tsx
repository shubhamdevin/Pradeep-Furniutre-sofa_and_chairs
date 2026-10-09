import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import AssetLicenceRegistry from '@/components/three-d/AssetLicenceRegistry';
import Home3DShowcase from '@/components/furniture/Home3DShowcase';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  ChevronRight,
  Building2,
  Calendar,
  Star,
  Quote,
  Box
} from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Fetch dynamic data from database
  const [categories, collections, featuredProducts, assetRecords, projects, testimonials, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      take: 15,
    }),
    prisma.collection.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: {
        images: true,
        category: true,
        collection: true,
        threeDAsset: true,
      },
      take: 8,
    }),
    prisma.threeDAsset.findMany({
      where: { isEnabled: true },
      include: {
        product: true,
      },
    }),
    prisma.projectPortfolio.findMany({
      where: { isPublished: true },
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      take: 3,
    }),
    prisma.businessSettings.findUnique({
      where: { id: 'singleton' },
    }),
  ]);

  // Transform 3D assets for viewers
  const formatted3DAssets = assetRecords.map((a) => ({
    id: a.id,
    name: a.name,
    provider: a.provider,
    embedMode: a.embedMode,
    modelUrl: a.modelUrl,
    sketchfabUid: a.sketchfabUid,
    author: a.author,
    licence: a.licence,
    attributionUrl: a.attributionUrl,
    posterImageUrl: a.posterImageUrl,
    fileFormat: a.fileFormat,
    loadingStatus: a.loadingStatus,
    isAccurateRep: a.isAccurateRep,
    disclaimer: a.disclaimer,
    initialCameraPos: a.initialCameraPos,
    isEnabled: a.isEnabled,
    productSlug: a.product?.slug,
    productTitle: a.product?.name,
  }));

  return (
    <div className="space-y-20 md:space-y-28 pb-20 bg-platinum">
      {/* =========================================================================
          SECTION 7: PREMIUM HERO SECTION (ARCHITECTURAL MINIMALISM)
         ========================================================================= */}
      <section className="relative min-h-[88vh] flex items-center justify-center bg-platinum overflow-hidden border-b border-platinum-border">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white border border-platinum-border shadow-subtle text-xs text-graphite">
                <span className="w-1.5 h-1.5 rounded-full bg-graphite" />
                <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-dark">
                  Bespoke Architectural Furniture Studio
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-graphite leading-[1.08]">
                Design Defines <br className="hidden sm:inline" />
                <span className="italic font-normal text-slate-dark">the Space.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-dark font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Exceptional sofas and statement chairs, thoughtfully manufactured for your space. We craft custom architectural seating with seasoned timber skeletons, multi-density comfort cores, and European contract-grade textiles.
              </p>

              {/* Action Buttons (Strictly Non-E-Commerce) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs uppercase tracking-wider font-semibold transition-all shadow-subtle border border-graphite flex items-center justify-center space-x-2"
                >
                  <span>Explore Our Collection</span>
                  <ArrowRight className="w-4 h-4 text-slate-silver" />
                </Link>

                <Link
                  href="/custom-design"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-transparent text-graphite hover:bg-platinum-soft text-xs uppercase tracking-wider font-semibold transition-all border border-graphite flex items-center justify-center space-x-2"
                >
                  <Sliders className="w-4 h-4 text-slate-dark" />
                  <span>Customize Your Furniture</span>
                </Link>

                <Link
                  href="/consultation"
                  className="w-full sm:w-auto text-xs font-semibold tracking-wider text-slate-dark hover:text-graphite uppercase py-2 underline underline-offset-4"
                >
                  Private Consultation
                </Link>
              </div>

              {/* Atelier Key Architectural Specs */}
              <div className="pt-8 border-t border-platinum-border grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block font-serif text-2xl font-bold text-graphite">10-Yr</span>
                  <span className="block text-[11px] text-slate-muted uppercase tracking-wider mt-0.5">Structural Warranty</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-graphite">100%</span>
                  <span className="block text-[11px] text-slate-muted uppercase tracking-wider mt-0.5">Bespoke CAD Scale</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-graphite">360°</span>
                  <span className="block text-[11px] text-slate-muted uppercase tracking-wider mt-0.5">Real 3D Verification</span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Hero Visualizer Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* 3D Canvas Box in Architectural Deep Graphite */}
                <InteractiveFurnitureViewer
                  asset={formatted3DAssets[0]}
                  productTitle="The Aurelia Italian Curved Sectional"
                  initialHeight="h-[440px] sm:h-[480px] lg:h-[520px]"
                />

                {/* Floating Architectural Badge */}
                <div className="absolute -bottom-4 -left-3 sm:left-4 bg-white p-3.5 rounded-lg shadow-elevated border border-platinum-border max-w-xs hidden sm:block">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded bg-platinum-soft flex items-center justify-center text-graphite">
                      <Box className="w-4 h-4 text-slate-dark" />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite">Real 3D Geometry</h4>
                      <p className="text-[11px] text-slate-dark mt-0.5">Drag to rotate 360° • 1:1 Workshop Spec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FURNITURE CATEGORIES (PLATINUM BACKGROUND)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-platinum-border pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-dark block mb-1">
              Atelier Disciplines
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
              Furniture Categories
            </h2>
            <p className="text-sm text-slate-dark mt-1.5 max-w-xl">
              From monumental curved architectural sectionals to sculpted lounge chairs, explore our specialized disciplines.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-graphite hover:text-slate-dark transition-colors"
          >
            <span>Explore All 15 Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 15 Categories Architectural Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-lg p-5 border border-platinum-border shadow-subtle hover:border-slate-silver hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded bg-platinum-soft flex items-center justify-center text-slate-dark group-hover:bg-graphite group-hover:text-white transition-colors mb-4">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-sans text-sm font-semibold text-graphite group-hover:text-graphite transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-dark mt-1 line-clamp-2">
                  {cat.description || 'Bespoke custom upholstered manufacturing.'}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-platinum-border flex items-center justify-between text-[11px] font-semibold text-slate-dark group-hover:text-graphite">
                <span>View Designs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FEATURED DESIGNS (WHITE BACKGROUND / ARCHITECTURAL CARDS)
         ========================================================================= */}
      <section className="bg-white py-16 border-y border-platinum-border">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-platinum-border pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-dark block mb-1">
                Curated Studio Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
                Featured Designs
              </h2>
              <p className="text-sm text-slate-dark mt-1.5 max-w-xl">
                Every design represents a dialogue between seasoned hardwood frames, multi-density foams, and architectural silhouettes.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-graphite hover:text-slate-dark transition-colors"
            >
              <span>View Full Catalogue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid with 1:1 Matching 3D Model Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <LuxuryProductCard
                key={prod.id}
                product={prod}
                showQuickActions={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CUSTOM DESIGN BANNER (DEEP GRAPHITE BACKGROUND #15191C)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-graphite-deep text-platinum overflow-hidden border border-graphite-border shadow-elevated p-8 sm:p-12 lg:p-14">
          <div className="relative z-10 max-w-3xl space-y-5">
            <span className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-graphite-elevated border border-graphite-border text-slate-silver text-xs font-semibold uppercase tracking-wider">
              <span>Bespoke Engineering Studio</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
              Love a Furniture Design? <br />
              <span className="italic text-slate-silver font-normal">We Can Customize It.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-silver leading-relaxed max-w-2xl font-light">
              Found an inspirational sofa or statement chair in an architectural publication, Pinterest, or luxury estate? Upload your reference photograph, specify desired modifications, and our master carpenters will manufacture it to exact millimeter tolerances.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/custom-design"
                className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-platinum text-graphite-deep hover:bg-white font-semibold text-xs uppercase tracking-wider transition-all shadow-subtle flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Upload Your Design</span>
              </Link>

              <Link
                href="/studio"
                className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-graphite-elevated hover:bg-graphite text-white font-semibold text-xs uppercase tracking-wider border border-graphite-border transition-all flex items-center justify-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-slate-silver" />
                <span>Customize Our Furniture</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SIGNATURE COLLECTIONS (WHITE EDITORIAL BACKGROUND)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-dark block mb-1">
            Curated Architectural Lines
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
            Signature Collections
          </h2>
          <p className="text-sm text-slate-dark mt-1.5">
            Distinct design narratives spanning Milanese curves, British Chesterfield tufting, Scandinavian warmth, and Art Deco geometry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group relative rounded-lg overflow-hidden bg-graphite-deep aspect-[16/10] shadow-card border border-platinum-border"
            >
              <img
                src={col.heroImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'}
                alt={col.name}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-deep via-graphite-deep/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-silver mb-1">
                  {col.tagline}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                  {col.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-silver max-w-md line-clamp-2 mb-4 leading-relaxed font-light">
                  {col.description}
                </p>
                <div>
                  <Link
                    href={`/products?collection=${col.slug}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-platinum text-graphite-deep hover:bg-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
                  >
                    <span>Explore {col.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: 3D FURNITURE SHOWROOM (DEEP GRAPHITE BACKGROUND #15191C)
         ========================================================================= */}
      <section className="bg-graphite-deep py-20 border-y border-graphite-border">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-graphite-elevated text-slate-silver text-xs font-semibold uppercase tracking-wider mb-2 border border-graphite-border">
              <Box className="w-3.5 h-3.5" />
              <span>Section 12 Architectural 3D Studio</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Real Interactive 3D Furniture Models
            </h2>
            <p className="text-sm text-slate-silver mt-2 font-light">
              Experience genuine 3D geometry in your browser. Rotate 360°, inspect structural depths, examine seating contours, and view legally verified licensing attribution.
            </p>
          </div>

          {/* Interactive Multi-Model Switcher Showcase in Deep Graphite */}
          <Home3DShowcase assets={formatted3DAssets} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OUR MANUFACTURING (ALTERNATING PLATINUM / GRAPHITE)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-dark block">
              Workshop Capabilities
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium leading-tight">
              Anatomy of Uncompromising <br />
              <span className="italic text-slate-dark font-normal">Handcrafted Quality.</span>
            </h2>

            <p className="text-sm text-slate-dark leading-relaxed">
              Unlike mass factory lines that rely on particleboard and staple guns, our Bodla atelier employs generational carpenters and master upholsterers. Every piece is built to become an architectural heirloom.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded bg-white border border-platinum-border flex items-center justify-center text-graphite shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-graphite" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-graphite">Kiln-Dried Hardwood Skeletons</h4>
                  <p className="text-xs text-slate-dark mt-0.5">Seasoned Salwood and Teak timbers dried below 10% moisture content to prevent warping or creaking.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded bg-white border border-platinum-border flex items-center justify-center text-graphite shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-graphite" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-graphite">Multi-Density High Resilience Foams</h4>
                  <p className="text-xs text-slate-dark mt-0.5">45D &amp; 50D sag-resistant cores crowned with microfiber feather duvets for lasting posture support.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-7 h-7 rounded bg-white border border-platinum-border flex items-center justify-center text-graphite shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-graphite" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-graphite">Hand-Pleated Diamond Tufting</h4>
                  <p className="text-xs text-slate-dark mt-0.5">Master artisans hand-fold each diamond crease without fabric slitting, securing each button by hand.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/manufacturing"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-graphite hover:underline"
              >
                <span>Read Full Factory &amp; Process Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aspect-[4/5] shadow-subtle border border-platinum-border">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                  alt="Timber Carpentry"
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-4 rounded-lg bg-white border border-platinum-border shadow-subtle">
                <span className="font-serif text-2xl font-bold text-graphite block">180+</span>
                <span className="text-xs text-slate-dark mt-0.5 block">Artisan hours per bespoke curved sectional</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-lg bg-graphite-deep text-platinum shadow-subtle border border-graphite-border">
                <span className="font-serif text-2xl font-bold text-white block">65,000</span>
                <span className="text-xs text-slate-silver mt-0.5 block">Martindale rubs on contract-grade textiles</span>
              </div>
              <div className="rounded-lg overflow-hidden aspect-[4/5] shadow-subtle border border-platinum-border">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                  alt="Bespoke Upholstery"
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: COMPLETED PROJECTS (PLATINUM BACKGROUND)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-platinum-border pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-dark block mb-1">
              Installation Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
              Completed Projects
            </h2>
            <p className="text-sm text-slate-dark mt-1.5 max-w-xl">
              Inspect bespoke installations crafted for luxury penthouses, boutique heritage suites, and modernist architectural villas.
            </p>
          </div>
          <Link
            href="/projects"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-graphite hover:text-slate-dark transition-colors"
          >
            <span>View All Installations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-lg overflow-hidden border border-platinum-border shadow-subtle hover:border-slate-silver hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-platinum-soft border-b border-platinum-border">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-dark font-medium">
                    <span>{proj.clientType}</span>
                    <span className="text-slate-muted">• {proj.location}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-graphite group-hover:text-graphite transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-dark line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="pt-2.5 border-t border-platinum-border text-xs text-slate-dark">
                    <strong className="text-graphite block mb-0.5">Seating Supplied:</strong>
                    <span>{proj.furnitureSupplied}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/projects#${proj.slug}`}
                  className="w-full block py-2 text-center rounded-md bg-platinum-soft hover:bg-platinum text-graphite text-xs font-semibold uppercase tracking-wider transition-colors border border-platinum-border"
                >
                  View Case Study
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ARCHITECTS & BULK ENQUIRIES (WHITE EDITORIAL BACKGROUND)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white border border-platinum-border p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-subtle">
          <div className="space-y-3.5 max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-platinum-soft border border-platinum-border text-slate-dark text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>For Architects &amp; Interior Designers</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
              Contract Manufacturing &amp; Bulk Projects
            </h2>

            <p className="text-sm text-slate-dark leading-relaxed font-light">
              We collaborate directly with architectural studios, hospitality developers, and interior designers. We translate your CAD elevations into precision prototypes, provide contract-grade Martindale fabric certifications, and execute bulk sofa/chair manufacturing.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-dark">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-graphite" />
                <span>Custom CAD Drafting &amp; Spec Sheets</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-graphite" />
                <span>B2B Contract Pricing Schedules</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-graphite" />
                <span>On-Site White-Glove Installation</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto">
            <Link
              href="/architects"
              className="px-6 py-3 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs font-semibold uppercase tracking-wider text-center shadow-subtle transition-all"
            >
              Architect Collaboration
            </Link>
            <Link
              href="/custom-design?type=B2B"
              className="px-6 py-3 rounded-md bg-transparent text-graphite hover:bg-platinum-soft text-xs font-semibold uppercase tracking-wider text-center border border-graphite transition-all"
            >
              Submit Bulk RFQ
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: REVIEWS AND TRUST
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 border-b border-platinum-border pb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-dark block mb-1">
            Verified Client Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
            Voices of Connoisseurs
          </h2>
          <p className="text-sm text-slate-dark mt-1">
            Verified feedback from private estate homeowners and prominent architecture studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg p-6 border border-platinum-border shadow-subtle flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center space-x-1 text-graphite mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-graphite text-graphite" />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-platinum-border mb-2" />

                <p className="text-xs sm:text-sm text-slate-dark italic leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-platinum-border">
                <span className="font-sans font-semibold text-graphite text-xs block">
                  {t.clientName}
                </span>
                <span className="text-[11px] text-slate-muted block mt-0.5">
                  {t.clientTitle} • {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7.5: 3D ASSET LICENCE REGISTRY SECTION
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <AssetLicenceRegistry assets={formatted3DAssets} />
      </section>

      {/* =========================================================================
          SECTION 3: CONSULTATION & APPOINTMENT CTA (GRAPHITE BACKGROUND #22272B)
         ========================================================================= */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-graphite text-platinum p-8 sm:p-12 lg:p-14 text-center relative overflow-hidden shadow-elevated border border-graphite-border">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-silver">
              Private Atelier Experience
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Schedule a Design Meeting or Workshop Tour
            </h2>

            <p className="text-xs sm:text-sm text-slate-silver leading-relaxed font-light">
              Visit our Civil Lines gallery to touch raw fabric swatches, or tour our Bodla manufacturing compound to inspect seasoned teak frames in production.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/consultation"
                className="w-full sm:w-auto px-6 py-3 rounded-md bg-platinum text-graphite-deep hover:bg-white font-semibold text-xs uppercase tracking-wider transition-all shadow-subtle flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Atelier Appointment</span>
              </Link>

              <a
                href="https://wa.me/919897023456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-md bg-graphite-elevated hover:bg-graphite text-white font-semibold text-xs uppercase tracking-wider border border-graphite-border transition-all"
              >
                Direct WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
