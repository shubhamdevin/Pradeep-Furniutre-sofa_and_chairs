'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingContact from './FloatingContact';
import MotionEffects from './MotionEffects';
import { WishlistProvider } from '@/components/furniture/WishlistProvider';

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <>{children}</>;
  return <WishlistProvider><MotionEffects /><Header /><main className="flex-grow">{children}</main><Footer /><FloatingContact /></WishlistProvider>;
}
