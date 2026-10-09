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
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Mandatory Master Brief Section 7 Compliance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-charcoal">
            3D Model Licensing &amp; Legal Registry
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            This platform strictly observes digital asset licensing protocols. Third-party 3D geometry from Poly Haven and Sketchfab is registered below with author attribution, CC0 / CC-BY licensing terms, and explicit usage disclaimers.
          </p>
        </div>

        <AssetLicenceRegistry assets={formattedAssets} />
      </div>
    </div>
  );
}
