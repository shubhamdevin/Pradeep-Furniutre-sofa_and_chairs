import React from 'react';
import { prisma } from '@/lib/prisma';
import { Package, AlertTriangle, ArrowDownRight, ArrowUpRight, Plus, Layers } from 'lucide-react';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const [items, suppliers] = await Promise.all([
    prisma.inventoryItem.findMany({
      include: {
        supplier: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { currentStock: 'asc' },
    }),
    prisma.supplier.findMany(),
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-platinum-border pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Factory Inventory Control</span>
        <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">Raw Materials &amp; Supplier Management</h1>
        <p className="text-xs text-slate-dark mt-1">
          Monitor fabric bolts, high-resilience foam blocks, seasoned CP teak planks, and hardware stock levels with traceable movements.
        </p>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const isLow = item.currentStock <= item.minimumLevel;
          return (
            <div
              key={item.id}
              className="bg-white rounded-md p-6 border border-platinum-border shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-graphite">{item.itemCode}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                  isLow ? 'bg-status-error/10 text-status-error' : 'bg-status-success/10 text-status-success'
                }`}>
                  {isLow ? 'Low Stock' : 'Optimal'}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-graphite">{item.name}</h4>
                <p className="text-xs text-slate-dark mt-0.5">Category: {item.category} • Location: {item.locationBin || 'Bodla Warehouse'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-platinum-soft/50 p-3 rounded-md border border-platinum-border text-xs">
                <div>
                  <span className="text-slate-dark block">Current Stock:</span>
                  <span className="font-semibold text-base text-graphite">{item.currentStock} {item.unit}</span>
                </div>
                <div>
                  <span className="text-slate-dark block">Reserved for Jobs:</span>
                  <span className="font-semibold text-base text-slate-muted">{item.reservedStock} {item.unit}</span>
                </div>
              </div>

              {item.supplier && (
                <div className="text-[11px] text-slate-dark pt-1 border-t border-platinum-border flex justify-between">
                  <span>Supplier: {item.supplier.name}</span>
                  <span>Lead: {item.supplier.leadTimeDays}d</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-md p-6 border border-platinum-border shadow-sm space-y-4">
        <h3 className="font-serif text-xl font-medium text-graphite">Verified Material Suppliers</h3>
        <div className="border border-platinum-border rounded-md overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-platinum-soft border-b border-platinum-border text-slate-dark font-medium">
              <tr>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">City</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Lead Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum-border">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-platinum-soft/30">
                  <td className="p-3 font-medium text-graphite">{s.name}</td>
                  <td className="p-3 text-slate-dark">{s.category.replace('_', ' ')}</td>
                  <td className="p-3 text-slate-dark">{s.city || 'Domestic'}</td>
                  <td className="p-3 font-mono text-graphite">{s.phone}</td>
                  <td className="p-3 text-slate-dark">{s.leadTimeDays} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
