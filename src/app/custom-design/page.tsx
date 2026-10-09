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
    <div className="min-h-screen bg-platinum py-12 md:py-20 text-graphite font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Bespoke Commission Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-graphite font-medium leading-tight">
            Have a Bespoke Vision in Mind? <br />
            <span className="italic text-slate-dark font-normal">We Engineer &amp; Craft It.</span>
          </h1>
          <p className="text-sm text-slate-dark max-w-xl mx-auto leading-relaxed">
            Upload your architectural drawings, Pinterest references, or showroom photography. Specify spatial dimensions and upholstery grades, and our master craftsmen will build it to exact millimeter tolerances.
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
