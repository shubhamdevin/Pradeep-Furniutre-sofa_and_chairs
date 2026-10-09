import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/furniture/ProductDetailClient';

export const revalidate = 30;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      specifications: {
        orderBy: { sortOrder: 'asc' },
      },
      threeDAsset: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isAvailable: true,
    },
    include: {
      images: true,
      category: true,
      threeDAsset: true,
    },
    take: 4,
  });

  // Fetch fabric swatches
  const fabricSwatches = await prisma.fabricSwatch.findMany({
    take: 8,
    include: {
      material: true,
    },
  });

  // Format 3D asset if available
  const formatted3D = product.threeDAsset
    ? {
        ...product.threeDAsset,
        productSlug: product.slug,
        productTitle: product.name,
      }
    : null;

  return (
    <div className="min-h-screen bg-ivory-100 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
          fabricSwatches={fabricSwatches}
          threeDAsset={formatted3D}
        />
      </div>
    </div>
  );
}
