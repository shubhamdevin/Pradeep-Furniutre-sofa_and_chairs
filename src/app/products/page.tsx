import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductCatalogueClient from '@/components/furniture/ProductCatalogueClient';

export const revalidate = 30;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const initialSearch = typeof searchParams.search === 'string' ? searchParams.search : '';
  const initialCategory = typeof searchParams.category === 'string' ? searchParams.category : '';
  const initialType = typeof searchParams.type === 'string' ? searchParams.type : '';
  const initialCollection = typeof searchParams.collection === 'string' ? searchParams.collection : '';

  // Fetch all products, categories, collections, and materials
  const [products, categories, collections, fabrics] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        images: true,
        category: true,
        collection: true,
        specifications: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.collection.findMany({
      where: { isPublished: true, products: { some: { isAvailable: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.fabricSwatch.findMany({
      take: 8,
    }),
  ]);

  return (
    <div className="min-h-screen bg-platinum py-12 md:py-20 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 text-slate-muted mb-2">
            <span className="w-6 h-px bg-slate-border" />
            <span className="text-xs uppercase font-bold tracking-widest">Atelier Catalogue</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-graphite font-medium">
            Furniture Designs &amp; Silhouettes
          </h1>
          <p className="text-sm text-slate-dark mt-2 max-w-2xl leading-relaxed">
            Explore our curated catalogue of bespoke sofas, sectional loungers, and statement fancy chairs. Every piece can be customized to your room measurements, fabric tier, and hardwood preferences.
          </p>
        </div>

        {/* Client Interactive Filter & Listing Engine */}
        <ProductCatalogueClient
          products={products}
          categories={categories}
          collections={collections}
          initialSearch={initialSearch}
          initialCategory={initialCategory}
          initialType={initialType}
          initialCollection={initialCollection}
        />
      </div>
    </div>
  );
}
