import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShoppingBag, Box, ExternalLink } from 'lucide-react';

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
    <div className="space-y-6 font-sans">
      <div className="border-b border-platinum-border pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Catalogue CMS</span>
        <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">Furniture Designs &amp; Models</h1>
        <p className="text-xs text-slate-dark mt-1">
          Catalogued sofa and fancy chair silhouettes with 3D model bindings and technical specifications.
        </p>
      </div>

      <div className="bg-white rounded-md border border-platinum-border shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-platinum-soft border-b border-platinum-border text-slate-dark font-medium">
            <tr>
              <th className="p-3.5">SKU &amp; Name</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Capacity</th>
              <th className="p-3.5">Frame Material</th>
              <th className="p-3.5 text-center">3D Model</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-platinum-soft/30">
                <td className="p-3.5">
                  <span className="font-mono font-medium text-graphite block">{p.sku}</span>
                  <span className="font-serif font-medium text-sm text-graphite block mt-0.5">{p.name}</span>
                </td>
                <td className="p-3.5 text-slate-dark">{p.category?.name}</td>
                <td className="p-3.5 text-slate-dark">{p.seatingCapacity || 'Custom'}</td>
                <td className="p-3.5 text-slate-dark">{p.frameMaterial}</td>
                <td className="p-3.5 text-center">
                  {p.threeDAsset ? (
                    <span className="px-2 py-0.5 rounded bg-graphite text-white font-medium text-[10px] inline-flex items-center space-x-1">
                      <Box className="w-3 h-3 text-slate-silver" />
                      <span>3D Live</span>
                    </span>
                  ) : (
                    <span className="text-slate-muted text-[10px]">Photo Only</span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/products/${p.slug}`}
                    target="_blank"
                    className="text-graphite hover:underline font-medium inline-flex items-center space-x-1"
                  >
                    <span>View Public</span>
                    <ExternalLink className="w-3 h-3 text-slate-muted" />
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
