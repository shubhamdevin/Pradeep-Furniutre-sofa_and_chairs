import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Sparkles, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isPublished: true },
    include: {
      products: {
        where: { isAvailable: true },
        include: {
          images: true,
          category: true,
          threeDAsset: true,
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Atelier Design Directions</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal">
            Signature Furniture Collections
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            Each collection represents a curated design language—from the architectural curved bouclés of Milan to the deep-buttoned heritage Chesterfields of Britain.
          </p>
        </div>

        {/* Collections Editorial List */}
        <div className="space-y-28">
          {collections.map((col) => (
            <div key={col.id} id={col.slug} className="space-y-8 scroll-mt-24">
              {/* Collection Header Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-charcoal aspect-[21/9] min-h-[300px] border border-ivory-300 shadow-luxury">
                <img
                  src={col.heroImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80'}
                  alt={col.name}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal/40 to-transparent p-8 sm:p-12 flex flex-col justify-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold mb-1">{col.tagline}</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-2">{col.name}</h2>
                  <p className="text-xs sm:text-sm text-ivory-200 max-w-2xl leading-relaxed">{col.description}</p>
                </div>
              </div>

              {/* Products in Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {col.products.map((prod) => {
                  const primaryImg = prod.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between group p-5 space-y-3"
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-ivory-100 relative">
                        <img src={primaryImg} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {prod.threeDAsset && (
                          <span className="absolute bottom-2 right-2 px-2.5 py-0.5 bg-charcoal text-gold text-[10px] font-semibold rounded-full flex items-center space-x-1">
                            <Sparkles className="w-3 h-3" />
                            <span>3D</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-gold">{prod.category?.name}</span>
                        <h3 className="font-serif text-lg font-medium text-charcoal">{prod.name}</h3>
                        <p className="text-xs text-charcoal/70 line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                      </div>

                      <div className="pt-2 border-t border-ivory-200 flex items-center justify-between">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="text-xs font-semibold text-charcoal hover:text-gold transition-colors flex items-center space-x-1"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/custom-design?product=${prod.id}`}
                          className="px-3 py-1.5 rounded-lg bg-charcoal text-white text-[11px] font-semibold uppercase tracking-wider"
                        >
                          Quote
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
