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
    },
  });

  if (!product || !product.isAvailable) {
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

  return (
    <div className="min-h-screen bg-platinum py-10 md:py-16 font-sans text-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
          fabricSwatches={fabricSwatches}
        />
      </div>
    </div>
  );
}
