import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShoppingBag, Sparkles, Plus, ExternalLink } from 'lucide-react';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      collection: true,
      threeDAsset: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-gold">Catalogue CMS</span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">Furniture Designs &amp; Models</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Catalogued sofa and fancy chair silhouettes with 3D model bindings and technical specifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-ivory-50 border-b border-ivory-200 text-walnut font-semibold">
            <tr>
              <th className="p-3.5">SKU &amp; Name</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Capacity</th>
              <th className="p-3.5">Frame Material</th>
              <th className="p-3.5 text-center">3D Model</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-ivory-50/50">
                <td className="p-3.5">
                  <span className="font-mono font-semibold text-charcoal block">{p.sku}</span>
                  <span className="font-serif font-medium text-sm text-charcoal block mt-0.5">{p.name}</span>
                </td>
                <td className="p-3.5">{p.category?.name}</td>
                <td className="p-3.5">{p.seatingCapacity || 'Custom'}</td>
                <td className="p-3.5">{p.frameMaterial}</td>
                <td className="p-3.5 text-center">
                  {p.threeDAsset ? (
                    <span className="px-2 py-0.5 rounded-full bg-charcoal text-gold font-semibold text-[10px] inline-flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>3D Live</span>
                    </span>
                  ) : (
                    <span className="text-charcoal/40 text-[10px]">Photo Only</span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/products/${p.slug}`}
                    target="_blank"
                    className="text-gold hover:text-gold-dark font-medium underline inline-flex items-center space-x-1"
                  >
                    <span>View Public</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
