import { getHeroConfig } from '@/lib/hero-store';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/home/HeroSection';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';

export const revalidate = 60;

const categories = [
  { title: '2 Seater Sofas', slug: '2-seater-sofas', image: '/images/catalogue-2026/florence-shell-sofa.webp' },
  { title: '3 Seater Sofas', slug: '3-seater-sofas', image: '/images/catalogue-2026/palazzo-tuxedo-sofa.webp' },
  { title: 'L-Shaped Sofas', slug: 'l-shaped-sofas', image: '/images/catalogue-2026/monaco-chaise-sofa.webp' },
  { title: 'Sectional Sofas', slug: 'sectional-sofas', image: '/images/catalogue-2026/celeste-cloud-sofa.webp' },
  { title: 'Chesterfield Sofas', slug: 'chesterfield-sofas', image: '/images/catalogue-2026/royale-chesterfield-sofa.webp' },
  { title: 'Fancy Chairs', slug: 'fancy-chairs', image: '/images/catalogue-2026/elara-petal-chair.webp' },
  { title: 'Accent Chairs', slug: 'accent-chairs', image: '/images/catalogue-2026/cairo-cane-chair.webp' },
  { title: 'Lounge Chairs', slug: 'lounge-chairs', image: '/images/catalogue-2026/atlas-sling-chair.webp' },
];

const craftSteps = [
  { n: '01', title: 'Premium Materials', image: '/images/atelier/ivory-curved-sofa.webp' },
  { n: '02', title: 'Expert Craftsmanship', image: '/images/atelier/atelier-craft.webp' },
  { n: '03', title: 'Precision Upholstery', image: '/images/atelier/atelier-craft.webp' },
  { n: '04', title: 'Quality Assurance', image: '/images/atelier/chesterfield-loveseat.webp' },
];

const projectTypes = [
  { title: 'Luxury Residences', image: '/images/atelier/residence-living.webp' },
  { title: 'Corporate Lounges', image: '/images/atelier/hero-living.webp' },
  { title: 'Hotels & Resorts', image: '/images/atelier/residence-living.webp' },
  { title: 'Restaurants & Cafés', image: '/images/atelier/atelier-craft.webp' },
];

function SectionHeading({ eyebrow, title, href, action = 'View all' }: { eyebrow: string; title: string; href?: string; action?: string }) {
  return (
    <div className="atelier-section-heading">
      <div><span className="atelier-eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      {href && <Link href={href} className="atelier-text-link">{action} <ArrowRight size={15} /></Link>}
    </div>
  );
}

export default async function HomePage() {
  const heroConfig = await getHeroConfig();
  const [featuredProductsUnsorted, projects, testimonials] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: { images: true, category: true, collection: true },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    }),
    prisma.projectPortfolio.findMany({ where: { isPublished: true }, take: 4 }),
    prisma.testimonial.findMany({ where: { isPublished: true }, take: 3 }),
  ]);
  const featuredOrder = ['EDIT-SOF-001', 'EDIT-CHR-001', 'EDIT-SOF-004', 'EDIT-CHR-007'];
  const featuredProducts = featuredProductsUnsorted.sort((a, b) => featuredOrder.indexOf(a.sku) - featuredOrder.indexOf(b.sku));

  return (
    <div className="atelier-home">
      <HeroSection config={heroConfig} />

      <section className="atelier-section atelier-category-section">
        <SectionHeading eyebrow="EXPLORE BY CATEGORY" title="Our Furniture Collections" href="/products" action="View All Collections" />
        <p className="atelier-section-intro">Discover sofas and statement chairs shaped for the way you live.</p>
        <div className="atelier-category-grid">
          {categories.map((category) => (
            <Link href={`/products?category=${category.slug}`} key={category.slug} className="atelier-category-card">
              <div className="atelier-category-image"><img src={category.image} alt={category.title} loading="lazy" /></div>
              <span>{category.title}</span><span className="atelier-round-arrow"><ArrowRight size={13} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="atelier-section atelier-featured-section">
        <SectionHeading eyebrow="MADE TO BE LIVED IN" title="Featured Designs" href="/products" action="Browse the catalogue" />
        <div className="atelier-filter-pills"><span className="is-active">Sofas</span><span>Fancy Chairs</span><span>New Arrivals</span><span>Best Sellers</span></div>
        <div className="atelier-product-grid">
          {featuredProducts.map((product) => <LuxuryProductCard key={product.id} product={product} showQuickActions={false} />)}
        </div>
      </section>


      <section className="atelier-section atelier-custom-banner">
        <div className="atelier-custom-image"><img src="/images/atelier/atelier-craft.webp" alt="Artisan hand-finishing a curved upholstered sofa" loading="lazy" /></div>
        <div className="atelier-custom-copy"><span className="atelier-eyebrow">CUSTOM FURNITURE MANUFACTURING</span><h2>Have a design in mind?<br /><em>Let&apos;s craft it.</em></h2><p>Share a reference, sketch or room plan. Our team will shape it into a made-to-measure piece with you.</p><div className="atelier-inline-actions"><Link href="/custom-design" className="atelier-button atelier-button--dark">Explore Your Design <ArrowRight size={15} /></Link><Link href="/custom-design" className="atelier-button atelier-button--light">Customize Existing Design <ArrowRight size={15} /></Link></div></div>
      </section>

      <section className="atelier-section">
        <SectionHeading eyebrow="OUR MANUFACTURING" title="Craftsmanship in every detail" href="/manufacturing" action="Explore our workshop" />
        <div className="atelier-image-grid">
          {craftSteps.map((step) => <Link href="/manufacturing" className="atelier-image-card" key={step.n}><img src={step.image} alt={step.title} loading="lazy" /><span className="atelier-image-number">{step.n}</span><strong>{step.title}</strong><i><ArrowRight size={15} /></i></Link>)}
        </div>
      </section>

      <section className="atelier-section">
        <SectionHeading eyebrow="COMPLETED PROJECTS" title="Spaces we’ve furnished" href="/projects" action="View all projects" />
        <div className="atelier-image-grid">
          {projectTypes.map((project) => <Link href="/projects" className="atelier-image-card atelier-project-card" key={project.title}><img src={project.image} alt={project.title} loading="lazy" /><strong>{project.title}</strong><i><ArrowRight size={15} /></i></Link>)}
        </div>
        {projects.length > 0 && <div className="atelier-project-note">Made to measure for homes, hospitality and workspaces across India.</div>}
      </section>

      {testimonials.length > 0 && <section className="atelier-testimonials">
        <div className="atelier-section"><SectionHeading eyebrow="CLIENT FEEDBACK" title="Trusted by homeowners & businesses" />
          <div className="atelier-testimonial-grid">{testimonials.map((testimonial) => <article className="atelier-quote-card" key={testimonial.id}><div className="atelier-stars">{Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</div><p>“{testimonial.quote}”</p><strong>{testimonial.clientName}</strong><small>{testimonial.clientTitle}</small></article>)}</div>
        </div>
      </section>}

      <section className="atelier-consultation">
        <img src="/images/atelier/hero-living.webp" alt="Olive green sofa in a softly lit living room" loading="lazy" />
        <div className="atelier-consultation-card"><span className="atelier-eyebrow">LET&apos;S CREATE YOUR PERFECT SPACE</span><h2>Request a consultation</h2><p>Talk through your room, your ideas and the piece you want to bring to life.</p><div className="atelier-inline-actions"><Link href="/consultation" className="atelier-button atelier-button--light">Book a Consultation <ArrowRight size={15} /></Link><Link href="/contact" className="atelier-text-link">Or contact us <ChevronRight size={14} /></Link></div></div>
      </section>
    </div>
  );
}
