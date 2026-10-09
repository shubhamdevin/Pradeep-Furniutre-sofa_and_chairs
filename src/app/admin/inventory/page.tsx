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
    <div className="space-y-6">
      <div className="border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-gold">Section 14 Factory Inventory</span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">Raw Materials &amp; Supplier Management</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Monitor fabric rolls, foam sheets, seasoned teak planks, and hardware stock levels with traceable movements.
        </p>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const isLow = item.currentStock <= item.minimumLevel;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-charcoal">{item.itemCode}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isLow ? 'Low Stock' : 'Optimal'}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-charcoal">{item.name}</h4>
                <p className="text-xs text-charcoal/60 mt-0.5">Category: {item.category} • Location: {item.locationBin || 'Bodla Warehouse'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-ivory-50 p-3 rounded-xl border border-ivory-200 text-xs">
                <div>
                  <span className="text-walnut block">Current Stock:</span>
                  <span className="font-bold text-base text-charcoal">{item.currentStock} {item.unit}</span>
                </div>
                <div>
                  <span className="text-walnut block">Reserved for Jobs:</span>
                  <span className="font-bold text-base text-gold">{item.reservedStock} {item.unit}</span>
                </div>
              </div>

              {item.supplier && (
                <div className="text-[11px] text-charcoal/70 pt-1 border-t border-ivory-200 flex justify-between">
                  <span>Supplier: {item.supplier.name}</span>
                  <span>Lead: {item.supplier.leadTimeDays}d</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm space-y-4">
        <h3 className="font-serif text-xl font-semibold text-charcoal">Verified Material Suppliers</h3>
        <div className="border border-ivory-300 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-ivory-50 border-b border-ivory-200 text-walnut font-semibold">
              <tr>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">City</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Lead Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3">{s.category.replace('_', ' ')}</td>
                  <td className="p-3">{s.city || 'Domestic'}</td>
                  <td className="p-3 font-mono">{s.phone}</td>
                  <td className="p-3">{s.leadTimeDays} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
