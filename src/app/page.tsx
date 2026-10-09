import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import AssetLicenceRegistry from '@/components/three-d/AssetLicenceRegistry';
import Home3DShowcase from '@/components/furniture/Home3DShowcase';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Wrench, 
  CheckCircle2, 
  FileText, 
  Eye, 
  Sliders, 
  ChevronRight,
  Building2,
  Calendar,
  Star,
  Quote
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

  // Format 3D assets for interactive showcase
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
    <div className="space-y-24 md:space-y-32 pb-20">
      {/* =========================================================================
          SECTION 4.2: CINEMATIC HERO SECTION
         ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-ivory-50 overflow-hidden border-b border-ivory-300">
        {/* Ambient Showroom Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cream/60 via-ivory-100/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-ivory-300 shadow-sm text-xs text-charcoal">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="font-semibold tracking-wide uppercase text-[11px] text-walnut">
                  Luxury Sofa &amp; Fancy Chairs Manufacturer
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-charcoal leading-[1.12]">
                Furniture Beyond <br className="hidden sm:inline" />
                <span className="italic font-normal text-walnut">Ordinary.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal/80 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Bespoke Sofas. Statement Chairs. Handcrafted for Your Space. We manufacture one-of-a-kind seating utilizing kiln-dried timber frames, high-density comfort cores, and European upholstery fabrics.
              </p>

              {/* Action Buttons (NO CHECKOUT/CART) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-charcoal text-ivory-100 hover:bg-charcoal-light hover:text-gold text-xs uppercase tracking-widest font-semibold transition-all shadow-luxury border border-charcoal flex items-center justify-center space-x-2 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/custom-design"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-charcoal hover:bg-ivory-100 text-xs uppercase tracking-widest font-semibold transition-all shadow-sm border border-ivory-300 flex items-center justify-center space-x-2"
                >
                  <Sliders className="w-4 h-4 text-walnut" />
                  <span>Design Your Furniture</span>
                </Link>

                <Link
                  href="/consultation"
                  className="w-full sm:w-auto text-xs font-semibold tracking-wider text-walnut hover:text-charcoal uppercase py-2 underline underline-offset-8"
                >
                  Request Consultation
                </Link>
              </div>

              {/* Atelier Key Stats */}
              <div className="pt-8 border-t border-ivory-300 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block font-serif text-2xl font-bold text-charcoal">10-Yr</span>
                  <span className="block text-[11px] text-charcoal/70 uppercase tracking-wider mt-0.5">Solid Frame Guarantee</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-charcoal">100%</span>
                  <span className="block text-[11px] text-charcoal/70 uppercase tracking-wider mt-0.5">Custom Dimensions</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-charcoal">360°</span>
                  <span className="block text-[11px] text-charcoal/70 uppercase tracking-wider mt-0.5">Interactive 3D Preview</span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Hero Visualizer Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* 3D Canvas Box */}
                <InteractiveFurnitureViewer
                  asset={formatted3DAssets[0]}
                  productTitle="The Aurelia Italian Curved Sectional"
                  initialHeight="h-[440px] sm:h-[500px] lg:h-[540px]"
                />

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-luxury border border-ivory-300 max-w-xs hidden sm:block">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-charcoal">Real 3D Geometry</h4>
                      <p className="text-[11px] text-charcoal/70 mt-0.5">Drag to rotate 360° or zoom contours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.3: FURNITURE CATEGORIES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-gold mb-2">
              <span className="w-6 h-px bg-gold" />
              <span className="text-xs uppercase font-bold tracking-widest">Our Specialties</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Furniture Categories
            </h2>
            <p className="text-sm text-charcoal/70 mt-2 max-w-xl">
              From monumental curved architectural sectionals to royal teak hand-carved armchairs, explore our atelier manufacturing disciplines.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-gold transition-colors"
          >
            <span>Explore All 15 Categories</span>
            <ChevronRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        {/* 15 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm hover:shadow-luxury hover:border-gold/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-walnut group-hover:bg-charcoal group-hover:text-gold transition-colors mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-medium text-charcoal group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal/60 mt-1.5 line-clamp-2">
                  {cat.description || 'Bespoke custom upholstered manufacturing.'}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-ivory-200 flex items-center justify-between text-[11px] font-semibold text-walnut">
                <span>View Designs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gold" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.4: FEATURED FURNITURE DESIGNS (NO CHECKOUT/CART)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-gold mb-2">
              <span className="w-6 h-px bg-gold" />
              <span className="text-xs uppercase font-bold tracking-widest">Masterpiece Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Featured Designs
            </h2>
            <p className="text-sm text-charcoal/70 mt-2 max-w-xl">
              Each piece represents an uncompromising dialogue between seasoned hardwood frames, multi-density foams, and architectural silhouettes.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-gold transition-colors"
          >
            <span>View Full Catalogue</span>
            <ChevronRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        {/* Product Cards Grid with 1:1 Matching 3D Model Inspection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((prod) => (
            <LuxuryProductCard
              key={prod.id}
              product={prod}
              showQuickActions={false}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.5: CUSTOM FURNITURE FEATURE BANNER
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-charcoal text-ivory-100 overflow-hidden border border-charcoal-light shadow-2xl p-8 sm:p-12 lg:p-16">
          {/* Subtle Atelier Background Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#b99a68_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-light border border-gold/40 text-gold text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Engineering Studio</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
              Love a Furniture Design? <br />
              <span className="italic text-gold font-normal">We Can Customize It.</span>
            </h2>

            <p className="text-sm sm:text-base text-ivory-300 leading-relaxed max-w-2xl">
              Saw an inspirational luxury sofa or fancy accent chair on Pinterest, Instagram, or an architectural magazine? Upload your reference photograph, specify your dimensions, and our master craftsmen will manufacture it with precision.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/custom-design"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-charcoal-deep font-semibold text-xs uppercase tracking-widest transition-all shadow-luxury-gold flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Upload Your Design</span>
              </Link>

              <Link
                href="/studio"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-widest border border-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-gold" />
                <span>Customize Our Furniture</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.6: SIGNATURE COLLECTIONS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 text-gold mb-2">
            <span className="w-6 h-px bg-gold" />
            <span className="text-xs uppercase font-bold tracking-widest">Haute Couture Seating</span>
            <span className="w-6 h-px bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
            Signature Collections
          </h2>
          <p className="text-sm text-charcoal/70 mt-2">
            Distinct design narratives spanning Milanese curves, British Chesterfield tufting, Scandinavian warmth, and Art Deco fluting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group relative rounded-3xl overflow-hidden bg-charcoal aspect-[16/10] shadow-luxury border border-ivory-300"
            >
              <img
                src={col.heroImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'}
                alt={col.name}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal/40 to-transparent p-8 sm:p-10 flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-widest text-gold mb-1">
                  {col.tagline}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
                  {col.name}
                </h3>
                <p className="text-xs sm:text-sm text-ivory-200 max-w-md line-clamp-2 mb-4 leading-relaxed">
                  {col.description}
                </p>
                <div>
                  <Link
                    href={`/products?collection=${col.slug}`}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-charcoal hover:bg-gold hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
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
          SECTION 4.7: 3D FURNITURE SHOWCASE (REAL THIRD-PARTY 3D MODELS)
         ========================================================================= */}
      <section className="bg-ivory-50 border-y border-ivory-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cream border border-gold/30 text-walnut text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Section 7 Compliant 3D Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Real Interactive 3D Furniture Models
            </h2>
            <p className="text-sm text-charcoal/70 mt-2">
              Experience genuine 3D geometry in your browser. Rotate 360°, inspect structural depths, examine seating contours, and view full licensing attribution.
            </p>
          </div>

          {/* Interactive Multi-Model Switcher Showcase */}
          <Home3DShowcase assets={formatted3DAssets} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.8: OUR MANUFACTURING & CRAFTSMANSHIP
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2 text-gold">
              <span className="w-6 h-px bg-gold" />
              <span className="text-xs uppercase font-bold tracking-widest">Workshop Capabilities</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium leading-tight">
              Anatomy of Uncompromising <br />
              <span className="italic text-walnut font-normal">Handcrafted Quality.</span>
            </h2>

            <p className="text-sm text-charcoal/80 leading-relaxed">
              Unlike mass factory lines that rely on particleboard and staple guns, our Bodla atelier employs generational carpenters and master upholsterers. Every piece is built to become a cherished heirloom.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-walnut shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-charcoal">Kiln-Dried Hardwood Skeletons</h4>
                  <p className="text-xs text-charcoal/70 mt-0.5">Seasoned Salwood and Teak timbers dried below 10% moisture content to prevent warping or creaking.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-walnut shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-charcoal">Multi-Density High Resilience Foams</h4>
                  <p className="text-xs text-charcoal/70 mt-0.5">45D &amp; 50D sag-resistant cores crowned with microfiber feather duvets for lasting posture support.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-walnut shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-charcoal">Hand-Pleated Diamond Tufting</h4>
                  <p className="text-xs text-charcoal/70 mt-0.5">Master artisans hand-fold each diamond crease without fabric slitting, securing each button by hand.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/manufacturing"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-gold transition-colors"
              >
                <span>Read Full Factory &amp; Process Story</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                  alt="Timber Carpentry"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 rounded-2xl bg-white border border-ivory-300 shadow-sm">
                <span className="font-serif text-2xl font-bold text-charcoal block">180+</span>
                <span className="text-xs text-charcoal/70 mt-1 block">Artisan hours per bespoke curved sectional</span>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 pt-8">
              <div className="p-5 rounded-2xl bg-charcoal text-ivory-100 shadow-luxury">
                <span className="font-serif text-2xl font-bold text-gold block">65,000</span>
                <span className="text-xs text-ivory-300 mt-1 block">Martindale rubs on atelier Belgian velvets</span>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                  alt="Bespoke Upholstery"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.9: COMPLETED PROJECTS & CASE STUDIES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-gold mb-2">
              <span className="w-6 h-px bg-gold" />
              <span className="text-xs uppercase font-bold tracking-widest">Installation Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Completed Projects
            </h2>
            <p className="text-sm text-charcoal/70 mt-2 max-w-xl">
              Inspect bespoke installations crafted for luxury penthouses, boutique heritage suites, and modernist architectural villas.
            </p>
          </div>
          <Link
            href="/projects"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-gold transition-colors"
          >
            <span>View All Installations</span>
            <ChevronRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-luxury-hover transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-ivory-100">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-walnut font-medium">
                    <span>{proj.clientType}</span>
                    <span className="text-charcoal/50">• {proj.location}</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-charcoal group-hover:text-gold transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="pt-3 border-t border-ivory-200 text-xs text-charcoal/80">
                    <strong className="text-walnut block mb-0.5">Custom Seating Supplied:</strong>
                    <span>{proj.furnitureSupplied}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/projects#${proj.slug}`}
                  className="w-full block py-2.5 text-center rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  View Case Study
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.10: ARCHITECTS & BULK ENQUIRIES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-cream/70 border border-gold/30 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-gold/40 text-walnut text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-gold" />
              <span>For Architects &amp; Interior Designers</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Contract Manufacturing &amp; Bulk Projects
            </h2>

            <p className="text-sm text-charcoal/80 leading-relaxed">
              We collaborate directly with architectural studios, hospitality developers, and interior designers. We translate your CAD elevations into precision prototypes, provide contract-grade Martindale fabric certifications, and execute bulk sofa/chair manufacturing.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-walnut">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Custom CAD Drafting &amp; Spec Sheets</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>B2B Contract Pricing Schedules</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>On-Site White-Glove Installation</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <Link
              href="/architects"
              className="px-8 py-4 rounded-full bg-charcoal text-ivory-100 hover:bg-charcoal-light hover:text-gold text-xs font-semibold uppercase tracking-widest text-center shadow-luxury transition-all"
            >
              Architect Collaboration
            </Link>
            <Link
              href="/custom-design?type=B2B"
              className="px-8 py-4 rounded-full bg-white text-charcoal hover:bg-ivory-100 text-xs font-semibold uppercase tracking-widest text-center border border-ivory-300 transition-all"
            >
              Submit Bulk RFQ
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4.11: REVIEWS AND TRUST
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 text-gold mb-2">
            <span className="w-6 h-px bg-gold" />
            <span className="text-xs uppercase font-bold tracking-widest">Verified Client Testimonials</span>
            <span className="w-6 h-px bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
            Voices of Connoisseurs
          </h2>
          <p className="text-sm text-charcoal/70 mt-2">
            Read verified feedback from private estate homeowners and prominent architecture studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-8 border border-ivory-300 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center space-x-1 text-gold mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-gold/20 mb-2" />

                <p className="text-xs sm:text-sm text-charcoal/80 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-ivory-200">
                <span className="font-serif font-semibold text-charcoal text-sm block">
                  {t.clientName}
                </span>
                <span className="text-xs text-walnut block mt-0.5">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AssetLicenceRegistry assets={formatted3DAssets} />
      </section>

      {/* =========================================================================
          SECTION 4.12: CONSULTATION & APPOINTMENT CTA
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-charcoal text-ivory-100 p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-2xl border border-charcoal-light">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              Private Atelier Experience
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Schedule a Design Meeting or Workshop Tour
            </h2>

            <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed">
              Visit our Civil Lines showroom gallery to touch raw fabric swatches, or tour our Bodla manufacturing compound to inspect seasoned teak frames in production.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/consultation"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-charcoal-deep font-semibold text-xs uppercase tracking-widest transition-all shadow-luxury-gold flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Atelier Appointment</span>
              </Link>

              <a
                href="https://wa.me/919897023456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-widest border border-white/20 transition-all"
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
