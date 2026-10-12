'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pradeep-furniture-wishlist-v1';

interface WishlistContextValue {
  productIds: string[];
  isReady: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readWishlist(): string[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? Array.from(new Set(value.filter((id): id is string => typeof id === 'string'))) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setProductIds(readWishlist());
    setIsReady(true);

    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setProductIds(readWishlist());
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    } catch {
      // Keep the in-memory wishlist usable when browser storage is unavailable.
    }
  }, [isReady, productIds]);

  const toggleWishlist = useCallback((productId: string) => {
    setProductIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setProductIds((current) => current.filter((id) => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setProductIds([]), []);

  const value = useMemo<WishlistContextValue>(() => ({
    productIds,
    isReady,
    isWishlisted: (productId) => productIds.includes(productId),
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  }), [productIds, isReady, toggleWishlist, removeFromWishlist, clearWishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
