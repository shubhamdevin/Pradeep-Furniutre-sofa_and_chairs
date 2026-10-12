import React from 'react';
import { prisma } from '@/lib/prisma';
import SmartStudioClient from '@/components/furniture/SmartStudioClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudioPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const baseProductId = typeof searchParams.baseProduct === 'string' ? searchParams.baseProduct : undefined;

  const [products, swatches] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        images: true,
        category: true,
      },
      orderBy: { isFeatured: 'desc' },
    }),
    prisma.fabricSwatch.findMany({
      include: {
        material: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-platinum py-12 md:py-20 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Personal Furniture Design Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-graphite">
            Smart Customization Studio
          </h1>
          <p className="text-sm text-slate-dark max-w-2xl mx-auto leading-relaxed">
            Configure architectural silhouettes, modular seating layouts, cushion firmness, and premium upholstery fabrics with real-time manufacturer compatibility verification.
          </p>
        </div>

        <SmartStudioClient
          products={products}
          fabricSwatches={swatches}
          initialProductId={baseProductId}
        />
      </div>
    </div>
  );
}
