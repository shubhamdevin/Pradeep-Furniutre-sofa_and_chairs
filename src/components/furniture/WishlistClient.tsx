'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Trash2 } from 'lucide-react';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { useWishlist } from '@/components/furniture/WishlistProvider';

export default function WishlistClient({ products }: { products: any[] }) {
  const { productIds, isReady, toggleWishlist, clearWishlist } = useWishlist();
  const savedProducts = products.filter((product) => productIds.includes(product.id));

  return (
    <section className="wishlist-page min-h-screen bg-platinum py-12 md:py-20 text-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="wishlist-heading">
          <span className="wishlist-eyebrow"><Heart size={14} /> YOUR ATELIER SHORTLIST</span>
          <div className="wishlist-heading-row">
            <div>
              <h1 className="font-serif">Saved designs</h1>
              <p>Keep the sofas and chairs you love together while you explore the collection.</p>
            </div>
            {savedProducts.length > 0 && (
              <button type="button" className="wishlist-clear" onClick={clearWishlist}>
                <Trash2 size={15} /> Clear wishlist
              </button>
            )}
          </div>
          <div className="wishlist-count" aria-live="polite">
            {isReady ? `${savedProducts.length} ${savedProducts.length === 1 ? 'design' : 'designs'} saved` : 'Loading saved designs…'}
          </div>
        </div>

        {!isReady ? null : savedProducts.length ? (
          <div className="wishlist-grid">
            {savedProducts.map((product) => (
              <LuxuryProductCard
                key={product.id}
                product={product}
                isShortlisted
                onToggleShortlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <span className="wishlist-empty-icon"><Heart size={24} /></span>
            <h2>Your wishlist is ready for inspiration</h2>
            <p>Tap the heart on any sofa or chair to save it here. Your list stays on this device.</p>
            <Link href="/products" className="wishlist-browse">
              Explore furniture <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
