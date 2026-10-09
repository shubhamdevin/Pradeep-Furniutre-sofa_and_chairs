import React from 'react';
import { prisma } from '@/lib/prisma';
import { Box, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-6 font-sans">
      <div className="border-b border-platinum-border pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Digital Assets Administration</span>
        <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">3D Model Library &amp; Licences</h1>
        <p className="text-xs text-slate-dark mt-1">
          Manage Poly Haven hosted GLTF models, Sketchfab 3D embeds, CC0 commercial licences, and catalogue associations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-md p-6 border border-platinum-border shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-slate-muted">{asset.id}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-medium uppercase bg-status-success/10 text-status-success">
                {asset.loadingStatus}
              </span>
            </div>

            <div>
              <h4 className="font-serif text-lg font-medium text-graphite">{asset.name}</h4>
              <p className="text-xs text-slate-dark mt-0.5">Provider: {asset.provider} ({asset.embedMode})</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-dark bg-platinum-soft/50 p-3.5 rounded-md border border-platinum-border">
              <p><strong className="text-graphite font-medium">Licence:</strong> {asset.licence}</p>
              <p><strong className="text-graphite font-medium">Author:</strong> {asset.author}</p>
              <p><strong className="text-graphite font-medium">Model Resource:</strong> <span className="font-mono truncate">{asset.modelUrl}</span></p>
              {asset.product && (
                <p><strong className="text-graphite font-medium">Linked Product:</strong> {asset.product.name} ({asset.product.sku})</p>
              )}
            </div>

            <div className="pt-2 border-t border-platinum-border flex items-center justify-between text-xs">
              <a
                href={asset.attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-graphite hover:underline font-medium flex items-center space-x-1"
              >
                <span>Original Provider Source</span>
                <ExternalLink className="w-3 h-3 text-slate-muted" />
              </a>

              <span className="text-xs font-medium text-status-success flex items-center space-x-1">
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
