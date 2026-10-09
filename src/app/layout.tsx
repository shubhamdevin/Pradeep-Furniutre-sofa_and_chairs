import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import FloatingContact from '@/components/ui/FloatingContact';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pradeep Furniture Atelier | Luxury 3D Sofa & Fancy Chairs Manufacturer',
  description:
    'Bespoke luxury sofas, fancy statement chairs, and custom upholstered seating handcrafted in Agra. Inspect 360° 3D models, request custom dimensions, and commission bespoke furniture.',
  keywords: [
    'Luxury Sofa Manufacturer',
    'Custom Sofa Manufacturer',
    'Fancy Chair Manufacturer',
    'Bespoke Furniture Manufacturer',
    'Upholstered Furniture Manufacturer',
    'Custom Designer Chairs',
    'Sofa Manufacturer in Agra',
  ],
  openGraph: {
    title: 'Pradeep Furniture Atelier | Bespoke Sofas & Fancy Chairs',
    description: 'Custom handcrafted sofas & fancy chairs with interactive 3D digital showroom and direct atelier manufacturing.',
    url: 'https://pradeepfurniture.com',
    siteName: 'Pradeep Furniture Atelier',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-ivory-100 text-charcoal">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
