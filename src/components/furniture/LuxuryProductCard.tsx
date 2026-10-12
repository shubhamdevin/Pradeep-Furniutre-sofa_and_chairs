'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, GitCompareArrows, ArrowUpRight, MoveRight, SlidersHorizontal, Armchair, Ruler, Layers } from 'lucide-react';

export interface LuxuryProductCardProps {
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description?: string | null;
    furnitureType?: string | null;
    seatingCapacity?: string | null;
    dimensionsSummary?: string | null;
    isCustomizable?: boolean | null;
    isFeatured?: boolean | null;
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    images: { url: string; viewAngle?: string | null; isPrimary?: boolean | null }[];
  } | any;
  isShortlisted?: boolean;
  isCompared?: boolean;
  onToggleShortlist?: (id: string) => void;
  onToggleCompare?: (id: string) => void;
  showQuickActions?: boolean;
}


export default function LuxuryProductCard({ product, isShortlisted = false, isCompared = false, onToggleShortlist, onToggleCompare, showQuickActions = true }: LuxuryProductCardProps) {
  const primaryImg = product.images?.find((image: any) => image.isPrimary)?.url || product.images?.[0]?.url || '/images/atelier/ivory-curved-sofa.webp';
  const detailsUrl = '/products/' + product.slug;
  const designUrl = '/custom-design?product=' + product.id;
  return (
    <article className="premium-product-card">
      <div className="premium-product-stage">
        <Link href={detailsUrl} className="premium-product-image" aria-label={'Explore ' + product.name}>
          <Image fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={!primaryImg.startsWith('/')} src={primaryImg} alt={product.name} loading="lazy" />
          <span className="premium-image-cue" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </Link>
        {(product.isFeatured || product.isCustomizable) && <span className="premium-product-label">{product.isFeatured ? 'The signature edit' : 'Made to order'}</span>}
        {showQuickActions && <div className="premium-product-tools">
          {onToggleShortlist && <button type="button" onClick={() => onToggleShortlist(product.id)} aria-pressed={isShortlisted} aria-label={(isShortlisted ? 'Remove from shortlist: ' : 'Save to shortlist: ') + product.name} title={isShortlisted ? 'Saved to shortlist' : 'Save design'} className={isShortlisted ? 'is-selected' : ''}><Heart size={17} fill={isShortlisted ? 'currentColor' : 'none'} /></button>}
          {onToggleCompare && <button type="button" onClick={() => onToggleCompare(product.id)} aria-pressed={isCompared} aria-label={'Compare ' + product.name} title="Compare design" className={isCompared ? 'is-selected' : ''}><GitCompareArrows size={17} /></button>}
        </div>}
      </div>
      <div className="premium-product-body">
        <div className="premium-product-eyebrow"><span>{product.category?.name || 'Signature seating'}</span><span className="premium-product-index">{product.sku?.split('-').pop()}</span></div>
        <Link href={detailsUrl} className="premium-product-title"><h3>{product.name}</h3></Link>
        {product.description && <p className="premium-product-description">{product.description}</p>}
        <div className="premium-product-specs">
          {product.seatingCapacity && <span><Armchair size={14} />{product.seatingCapacity}</span>}
          {product.upholsteryType ? <span><Layers size={14} />{product.upholsteryType}</span> : product.dimensionsSummary && <span><Ruler size={14} />{product.dimensionsSummary}</span>}
        </div>
        <div className="premium-product-actions">
          <Link href={detailsUrl} className="premium-details-link">Explore design <MoveRight size={17} /></Link>
          <Link href={designUrl} className="premium-quote-link">Request quote <ArrowUpRight size={15} /></Link>
        </div>
        {product.isCustomizable && <Link href={designUrl} className="premium-customize-link"><SlidersHorizontal size={13} />Personalise this design</Link>}
      </div>
    </article>
  );
}
