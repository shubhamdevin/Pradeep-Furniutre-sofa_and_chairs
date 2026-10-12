import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import WishlistClient from '@/components/furniture/WishlistClient';

export const metadata: Metadata = {
  title: 'Your Wishlist | Pradeep Furniture Atelier',
  description: 'Review and manage the furniture designs saved to your wishlist.',
};

export const revalidate = 30;

export default async function WishlistPage() {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: { images: true, category: true, collection: true },
    orderBy: { createdAt: 'desc' },
  });

  return <WishlistClient products={products} />;
}
