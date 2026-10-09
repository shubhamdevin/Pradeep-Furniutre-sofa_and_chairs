import React from 'react';
import { ThreeDAssetItem } from '@/lib/types';
import { ShieldCheck, ExternalLink, Box, Info } from 'lucide-react';

interface RegistryProps {
  assets: (ThreeDAssetItem & { productSlug?: string; productTitle?: string })[];
}

export default function AssetLicenceRegistry({ assets }: RegistryProps) {
  return (
    <div className="bg-white rounded-lg border border-platinum-border shadow-sm p-6 md:p-8 font-sans">
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-platinum-border pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-slate-muted" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-muted">Compliance &amp; Transparency</span>
          </div>
          <h3 className="font-serif text-2xl text-graphite font-medium mt-1">3D Furniture Asset Registry</h3>
          <p className="text-sm text-slate-dark mt-1 max-w-2xl leading-relaxed">
            In compliance with open-source and digital licensing standards (CC0 1.0 Universal &amp; CC-BY 4.0), all interactive 3D demonstration models hosted or embedded on this platform are catalogued below with direct author attribution.
          </p>
        </div>
        <div className="bg-platinum-soft px-4 py-2.5 rounded-md border border-platinum-border text-xs">
          <span className="text-slate-dark font-medium block">Total Verified 3D Assets:</span>
          <span className="text-base font-semibold text-graphite">{assets.length} Interactive Models</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="border border-platinum-border rounded-md p-5 bg-platinum-soft/30 hover:bg-white transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-slate-muted" />
                  <span className="text-xs font-mono font-medium text-graphite">{asset.id}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded uppercase ${
                  asset.licence.includes('CC0') ? 'bg-status-success/10 text-status-success' : 'bg-status-info/10 text-status-info'
                }`}>
                  {asset.licence}
                </span>
              </div>

              <h4 className="font-serif text-base font-medium text-graphite mb-2">{asset.name}</h4>

              <div className="space-y-1.5 text-xs text-slate-dark mb-4">
                <p><span className="font-medium text-graphite">Provider:</span> {asset.provider} ({asset.embedMode})</p>
                <p><span className="font-medium text-graphite">Author / Modeler:</span> {asset.author}</p>
                <p><span className="font-medium text-graphite">File Format:</span> {asset.fileFormat.toUpperCase()}</p>
                <p><span className="font-medium text-graphite">Status:</span> <span className="text-status-success font-medium">{asset.loadingStatus}</span></p>
                {asset.productTitle && (
                  <p><span className="font-medium text-graphite">Demonstration Product:</span> {asset.productTitle}</p>
                )}
              </div>

              <div className="bg-white p-3 rounded border border-platinum-border text-[11px] text-slate-dark mb-4 leading-relaxed flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-slate-muted shrink-0 mt-0.5" />
                <span>{asset.disclaimer}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-platinum-border flex items-center justify-between">
              <a
                href={asset.attributionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-graphite hover:underline font-medium"
              >
                <span>Original Asset Source</span>
                <ExternalLink className="w-3 h-3 text-slate-muted" />
              </a>
              {asset.productSlug && (
                <a
                  href={`/products/${asset.productSlug}`}
                  className="text-xs font-medium text-slate-dark hover:text-graphite transition-colors"
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
