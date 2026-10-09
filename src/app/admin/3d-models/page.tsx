import React from 'react';
import { prisma } from '@/lib/prisma';
import { Box, ExternalLink, ShieldCheck, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function Admin3DModelsPage() {
  const [assets, products] = await Promise.all([
    prisma.threeDAsset.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      select: { id: true, name: true, sku: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-gold">Section 7.6 Administration</span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">3D Model Library &amp; Licences</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Manage Poly Haven hosted GLTF models, Sketchfab 3D embeds, commercial licences, and product associations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-charcoal">{asset.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {asset.loadingStatus}
              </span>
            </div>

            <div>
              <h4 className="font-serif text-lg font-medium text-charcoal">{asset.name}</h4>
              <p className="text-xs text-walnut mt-0.5">Provider: {asset.provider} ({asset.embedMode})</p>
            </div>

            <div className="space-y-1.5 text-xs text-charcoal/80 bg-ivory-50 p-3.5 rounded-xl border border-ivory-200">
              <p><strong>Licence:</strong> {asset.licence}</p>
              <p><strong>Author:</strong> {asset.author}</p>
              <p><strong>Model Resource:</strong> <span className="font-mono truncate">{asset.modelUrl}</span></p>
              {asset.product && (
                <p><strong>Linked Product:</strong> {asset.product.name} ({asset.product.sku})</p>
              )}
            </div>

            <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-xs">
              <a
                href={asset.attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-dark font-medium underline flex items-center space-x-1"
              >
                <span>Original Provider Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-xs font-semibold text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Commercial Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
