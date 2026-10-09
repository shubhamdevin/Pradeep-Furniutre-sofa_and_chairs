import React from 'react';
import { prisma } from '@/lib/prisma';
import SmartStudioClient from '@/components/furniture/SmartStudioClient';

export const revalidate = 60;

export default async function StudioPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const baseProductId = typeof searchParams.baseProduct === 'string' ? searchParams.baseProduct : undefined;

  const [products, swatches, assets] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        images: true,
        category: true,
        threeDAsset: true,
      },
      orderBy: { isFeatured: 'desc' },
    }),
    prisma.fabricSwatch.findMany({
      include: {
        material: true,
      },
    }),
    prisma.threeDAsset.findMany({
      where: { isEnabled: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-ivory-100 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Section 9 Guided Customization</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-medium">
            Smart Customization Studio
          </h1>
          <p className="text-sm text-charcoal/70 max-w-2xl mx-auto">
            Configure architectural silhouettes, seating layouts, cushion firmness, and premium Belgian fabrics with real-time manufacturer compatibility verification.
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
