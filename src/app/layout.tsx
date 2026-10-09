import type { Metadata } from 'next';
import { Manrope, Instrument_Serif } from 'next/font/google';
import './globals.css';
import '@/styles/tokens.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import FloatingContact from '@/components/ui/FloatingContact';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pradeep Furniture Atelier | Bespoke Architectural Sofas & Statement Chairs',
  description:
    'High-end architectural sofa & fancy chairs manufacturing studio. Precision woodworking, European textiles, 360° interactive 3D digital showroom, and bespoke commissions.',
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
    description: 'Architectural furniture manufacturing studio with interactive 3D digital showroom and direct atelier production.',
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
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen flex flex-col bg-platinum text-graphite font-sans antialiased selection:bg-graphite selection:text-white">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
