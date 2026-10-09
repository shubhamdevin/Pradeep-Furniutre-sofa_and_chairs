import React from 'react';
import { ThreeDAssetItem } from '@/lib/types';
import { ShieldCheck, ExternalLink, Box, Info } from 'lucide-react';

interface RegistryProps {
  assets: (ThreeDAssetItem & { productSlug?: string; productTitle?: string })[];
}

export default function AssetLicenceRegistry({ assets }: RegistryProps) {
  return (
    <div className="bg-white rounded-2xl border border-ivory-300 shadow-luxury p-6 md:p-8">
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-ivory-200 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Compliance & Transparency</span>
          </div>
          <h3 className="font-serif text-2xl text-charcoal font-semibold mt-1">3D Furniture Asset Registry</h3>
          <p className="text-sm text-charcoal/70 mt-1 max-w-2xl">
            In compliance with open-source and digital licensing standards (CC0 1.0 Universal &amp; CC-BY 4.0), all interactive 3D demonstration models hosted or embedded on this platform are cataloged below with direct author attribution.
          </p>
        </div>
        <div className="bg-ivory-50 px-4 py-2.5 rounded-xl border border-ivory-300 text-xs">
          <span className="text-walnut font-medium block">Total Verified 3D Assets:</span>
          <span className="text-base font-bold text-charcoal">{assets.length} Interactive Models</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="border border-ivory-300 rounded-xl p-5 bg-ivory-50/50 hover:bg-white hover:border-gold/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-walnut" />
                  <span className="text-xs font-mono font-semibold text-charcoal">{asset.id}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  asset.licence.includes('CC0') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {asset.licence}
                </span>
              </div>

              <h4 className="font-serif text-base font-medium text-charcoal mb-2">{asset.name}</h4>

              <div className="space-y-1.5 text-xs text-charcoal/80 mb-4">
                <p><span className="text-walnut font-medium">Provider:</span> {asset.provider} ({asset.embedMode})</p>
                <p><span className="text-walnut font-medium">Author / Modeler:</span> {asset.author}</p>
                <p><span className="text-walnut font-medium">File Format:</span> {asset.fileFormat.toUpperCase()}</p>
                <p><span className="text-walnut font-medium">Status:</span> <span className="text-emerald-700 font-semibold">{asset.loadingStatus}</span></p>
                {asset.productTitle && (
                  <p><span className="text-walnut font-medium">Demonstration Product:</span> {asset.productTitle}</p>
                )}
              </div>

              <div className="bg-white p-3 rounded-lg border border-ivory-200 text-[11px] text-charcoal/70 mb-4 leading-relaxed flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>{asset.disclaimer}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-ivory-200 flex items-center justify-between">
              <a
                href={asset.attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-gold hover:text-gold-dark font-medium underline"
              >
                <span>Original Asset Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              {asset.productSlug && (
                <a
                  href={`/products/${asset.productSlug}`}
                  className="text-xs font-medium text-charcoal hover:text-gold transition-colors"
                >
                  View Product Page →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
