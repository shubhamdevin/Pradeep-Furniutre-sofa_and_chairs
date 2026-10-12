import SiteShell from '@/components/ui/SiteShell';
import { ToastProvider } from '@/components/ui/ToastProvider';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import '@/styles/tokens.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#111417',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Pradeep Furniture Atelier | Bespoke Architectural Sofas & Statement Chairs',
  description:
    'High-end architectural sofa & fancy chairs manufacturing studio. Precision woodworking, European textiles, luxury sofa and chair collections, and bespoke commissions.',
  keywords: [
    'Architectural Sofa Manufacturer',
    'Custom Sofa Manufacturer',
    'Fancy Chair Studio',
    'Bespoke Seating Atelier',
    'Upholstered Furniture Manufacturer',
    'Designer Lounge Seating',
  ],
  openGraph: {
    title: 'Pradeep Furniture Atelier | Bespoke Sofas & Statement Chairs',
    description: 'Architectural furniture manufacturing studio with bespoke sofa and chair collections and direct atelier production.',
    url: 'https://pradeepfurniture.com',
    siteName: 'Pradeep Furniture Atelier',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col bg-platinum text-graphite font-sans antialiased selection:bg-graphite selection:text-white">
        <ToastProvider>
          <SiteShell>{children}</SiteShell>
        </ToastProvider>
      </body>
    </html>
  );
}
