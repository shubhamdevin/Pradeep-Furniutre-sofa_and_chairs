import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Sliders, 
  FileText, 
  Wrench, 
  Package, 
  Box, 
  ShoppingBag, 
  ExternalLink
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: 'Executive Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'CRM Leads Pipeline', href: '/admin/leads', icon: Users },
    { label: 'Custom Design Requests', href: '/admin/custom-requests', icon: Sliders },
    { label: 'Quotations & Approvals', href: '/admin/quotations', icon: FileText },
    { label: 'Manufacturing & Jobs', href: '/admin/manufacturing', icon: Wrench },
    { label: 'Inventory & Timber Stock', href: '/admin/inventory', icon: Package },
    { label: '3D Models & Licensing', href: '/admin/3d-models', icon: Box },
    { label: 'Product Catalogue', href: '/admin/products', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-platinum flex flex-col md:flex-row text-graphite font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-graphite text-platinum-soft p-5 flex flex-col justify-between shrink-0 border-r border-slate-border">
        <div className="space-y-6">
          {/* Atelier Brand Badge */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-border">
            <div className="w-8 h-8 rounded-md bg-graphite-elevated flex items-center justify-center text-platinum border border-slate-border">
              <span className="font-serif font-bold text-sm">P</span>
            </div>
            <div>
              <span className="block font-serif font-medium text-white text-sm tracking-wide">PRADEEP ATELIER</span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-silver font-medium">Factory Operations</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-md hover:bg-graphite-elevated hover:text-white transition-colors font-medium text-slate-silver"
                >
                  <Icon className="w-4 h-4 text-slate-silver shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Staff Profile & Public Link */}
        <div className="pt-6 border-t border-slate-border space-y-3 text-xs">
          <div className="bg-graphite-deep p-3 rounded-md border border-slate-border flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-graphite-elevated text-platinum font-bold flex items-center justify-center text-xs border border-slate-border">
              PS
            </div>
            <div className="truncate">
              <span className="block font-medium text-white text-[11px] truncate">Pradeep Sharma</span>
              <span className="block text-[9px] text-slate-silver uppercase tracking-wider">Super Administrator</span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-md bg-graphite-elevated hover:bg-graphite-hover text-slate-silver hover:text-white text-[11px] transition-colors"
          >
            <span>View Public Atelier</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-silver" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
