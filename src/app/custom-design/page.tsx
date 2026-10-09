import React from 'react';
import { prisma } from '@/lib/prisma';
import CustomDesignWizard from '@/components/forms/CustomDesignWizard';

export const revalidate = 60;

export default async function CustomDesignPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const selectedProductId = typeof searchParams.product === 'string' ? searchParams.product : undefined;

  // Fetch product if pre-selected
  let preselectedProduct = null;
  if (selectedProductId) {
    preselectedProduct = await prisma.product.findUnique({
      where: { id: selectedProductId },
      include: {
        images: true,
        category: true,
      },
    });
  }

  // Fetch available products for dropdown
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      furnitureType: true,
      dimensionsSummary: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Bespoke Commission Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-medium">
            Have a Design in Mind? <br />
            <span className="italic text-walnut font-normal">Let&apos;s Craft It.</span>
          </h1>
          <p className="text-sm text-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Upload your Pinterest, Instagram, or architectural reference photos. Specify your space dimensions and fabric choices, and our master carpenters will manufacture it to perfection.
          </p>
        </div>

        {/* Wizard Form Component */}
        <CustomDesignWizard
          preselectedProduct={preselectedProduct}
          allProducts={allProducts}
        />
      </div>
    </div>
  );
}
