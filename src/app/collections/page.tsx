import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Box, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Atelier Design Directions
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            Signature Collections
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            Each collection represents a curated architectural design language—from the sculptural curved silhouettes of Milan to the deep-buttoned heritage Chesterfields of Britain.
          </p>
        </div>

        {/* Collections Editorial List */}
        <div className="space-y-24">
          {collections.map((col) => (
            <div key={col.id} id={col.slug} className="space-y-8 scroll-mt-24">
              {/* Collection Header Banner */}
              <div className="relative rounded-lg overflow-hidden bg-graphite-deep aspect-[21/9] min-h-[300px] border border-slate-border shadow-sm">
                <img
                  src={col.heroImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80'}
                  alt={col.name}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-deep via-graphite-deep/40 to-transparent p-8 sm:p-12 flex flex-col justify-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-silver mb-1">{col.tagline}</span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-2">{col.name}</h2>
                  <p className="text-xs sm:text-sm text-platinum-soft max-w-2xl leading-relaxed">{col.description}</p>
                </div>
              </div>

              {/* Products in Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {col.products.map((prod) => {
                  const primaryImg = prod.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-lg overflow-hidden border border-platinum-border shadow-sm hover:border-graphite transition-colors flex flex-col justify-between group p-5 space-y-3"
                    >
                      <div className="aspect-[4/3] rounded overflow-hidden bg-platinum-soft relative">
                        <img src={primaryImg} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {prod.threeDAsset && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-graphite text-white text-[10px] font-medium rounded flex items-center space-x-1 shadow-sm">
                            <Box className="w-3 h-3 text-slate-silver" />
                            <span>3D</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-muted">{prod.category?.name}</span>
                        <h3 className="font-serif text-xl font-medium text-graphite">{prod.name}</h3>
                        <p className="text-xs text-slate-dark line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                      </div>

                      <div className="pt-2 border-t border-platinum-border flex items-center justify-between">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="text-xs font-medium text-graphite hover:underline flex items-center space-x-1"
                        >
                          <span>Inspect Specimen</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-muted" />
                        </Link>
                        <Link
                          href={`/custom-design?product=${prod.id}`}
                          className="px-3.5 py-1.5 rounded-md bg-graphite hover:bg-graphite-hover text-white text-[11px] font-medium uppercase tracking-wider transition-colors"
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
