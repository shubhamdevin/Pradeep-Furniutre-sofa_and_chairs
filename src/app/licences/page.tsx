import React from 'react';
import { prisma } from '@/lib/prisma';
import AssetLicenceRegistry from '@/components/three-d/AssetLicenceRegistry';

export const revalidate = 60;

export default async function LicencesPage() {
  const assets = await prisma.threeDAsset.findMany({
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });

  const formattedAssets = assets.map((a) => ({
    id: a.id,
    name: a.name,
    provider: a.provider,
    embedMode: a.embedMode,
    modelUrl: a.modelUrl,
    sketchfabUid: a.sketchfabUid,
    author: a.author,
    licence: a.licence,
    attributionUrl: a.attributionUrl,
    posterImageUrl: a.posterImageUrl,
    fileFormat: a.fileFormat,
    loadingStatus: a.loadingStatus,
    isAccurateRep: a.isAccurateRep,
    disclaimer: a.disclaimer,
    initialCameraPos: a.initialCameraPos,
    isEnabled: a.isEnabled,
    productSlug: a.product?.slug,
    productTitle: a.product?.name,
  }));

  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Digital Asset Licensing Registry
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            3D Model Licensing &amp; Legal Registry
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            This atelier platform strictly observes digital intellectual property protocols. Interactive 3D geometry from Poly Haven and Sketchfab is catalogued below with author attribution, CC0 / CC-BY licensing terms, and explicit usage disclaimers.
          </p>
        </div>

        <AssetLicenceRegistry assets={formattedAssets} />
      </div>
    </div>
  );
}
