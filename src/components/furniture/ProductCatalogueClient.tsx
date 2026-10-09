'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Grid, 
  List, 
  Heart, 
  ArrowRight, 
  X, 
  Scale, 
  Sliders,
  Box
} from 'lucide-react';
import { ProductItem, CategoryItem, CollectionItem } from '@/lib/types';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';

interface CatalogueProps {
  products: any[];
  categories: CategoryItem[];
  collections: CollectionItem[];
  initialSearch?: string;
  initialCategory?: string;
  initialType?: string;
  initialCollection?: string;
}

export default function ProductCatalogueClient({
  products,
  categories,
  collections,
  initialSearch = '',
  initialCategory = '',
  initialType = '',
  initialCollection = '',
}: CatalogueProps) {
  // Search & Filter State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [only3D, setOnly3D] = useState(false);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'capacity'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Shortlist and Compare State
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Toggle Shortlist
  const toggleShortlist = (productId: string) => {
    setShortlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Toggle Compare
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 furniture designs simultaneously.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (search) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.name.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchDesc && !matchCat) return false;
        }

        // Category
        if (selectedCategory && p.category?.slug !== selectedCategory) {
          return false;
        }

        // Furniture Type
        if (selectedType && p.furnitureType !== selectedType) {
          return false;
        }

        // Collection
        if (selectedCollection && p.collection?.slug !== selectedCollection) {
          return false;
        }

        // Only 3D Models
        if (only3D && !p.threeDAsset) {
          return false;
        }

        // Only Customizable
        if (onlyCustomizable && !p.isCustomizable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'capacity') return (b.seatingCapacity || '').localeCompare(a.seatingCapacity || '');
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, search, selectedCategory, selectedType, selectedCollection, only3D, onlyCustomizable, sortBy]);

  // Compared products data
  const comparedProducts = useMemo(() => {
    return products.filter((p) => compareList.includes(p.id));
  }, [products, compareList]);

  // Reset Filters
  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedCollection('');
    setOnly3D(false);
    setOnlyCustomizable(false);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-lg p-5 border border-platinum-border shadow-subtle space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search by name, SKU, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-xs focus:outline-none focus:border-graphite text-graphite"
            />
            <Search className="w-4 h-4 text-slate-dark absolute left-3 top-3" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-muted hover:text-graphite"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-xs text-graphite focus:outline-none focus:border-graphite"
            >
              <option value="">All Types</option>
              <option value="SOFA">Sofas</option>
              <option value="CHAIR">Fancy Chairs</option>
              <option value="SECTIONAL">Sectionals</option>
              <option value="LOUNGE">Loungers</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-xs text-graphite focus:outline-none focus:border-graphite"
            >
              <option value="">All 15 Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-xs text-graphite focus:outline-none focus:border-graphite"
            >
              <option value="featured">Sort: Featured</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="capacity">Sort: Seating Capacity</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="md:col-span-1 flex items-center justify-end space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-graphite text-white' : 'text-slate-dark hover:bg-platinum-soft'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-graphite text-white' : 'text-slate-dark hover:bg-platinum-soft'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Checkbox Chips & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-platinum-border text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center space-x-2 cursor-pointer bg-platinum-soft px-3 py-1.5 rounded-md border border-platinum-border hover:border-slate-silver">
              <input
                type="checkbox"
                checked={only3D}
                onChange={(e) => setOnly3D(e.target.checked)}
                className="rounded text-graphite focus:ring-0"
              />
              <span className="flex items-center space-x-1 font-medium text-graphite">
                <Box className="w-3.5 h-3.5 text-slate-dark" />
                <span>Interactive 3D Model</span>
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-platinum-soft px-3 py-1.5 rounded-md border border-platinum-border hover:border-slate-silver">
              <input
                type="checkbox"
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="rounded text-graphite focus:ring-0"
              />
              <span className="font-medium text-graphite">Customizable Only</span>
            </label>

            {(search || selectedCategory || selectedType || selectedCollection || only3D || onlyCustomizable) && (
              <button
                onClick={clearFilters}
                className="text-graphite hover:underline font-semibold px-2 py-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="text-xs text-slate-dark">
            Showing <strong className="text-graphite">{filteredProducts.length}</strong> bespoke designs
          </div>
        </div>
      </div>

      {/* Product Grid / List Results */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-platinum-border space-y-4">
          <div className="w-12 h-12 rounded bg-platinum-soft flex items-center justify-center text-slate-dark mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-graphite font-medium">No matching designs found</h3>
          <p className="text-xs text-slate-dark max-w-md mx-auto">
            We can manufacture any custom silhouette from your reference photos. Use our 3D Studio or upload your Pinterest design inspiration.
          </p>
          <div className="pt-2">
            <Link
              href="/custom-design"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-md bg-graphite text-white text-xs font-semibold uppercase tracking-wider hover:bg-graphite-hover"
            >
              <span>Upload Your Design</span>
              <ArrowRight className="w-4 h-4 text-slate-silver" />
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <LuxuryProductCard
              key={prod.id}
              product={prod}
              isShortlisted={shortlist.includes(prod.id)}
              isCompared={compareList.includes(prod.id)}
              onToggleShortlist={toggleShortlist}
              onToggleCompare={toggleCompare}
              showQuickActions={true}
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {filteredProducts.map((prod) => {
            const primaryImg =
              prod.images.find((i: any) => i.isPrimary)?.url ||
              prod.images[0]?.url ||
              '/images/models/sofa_03_primary.png';

            return (
              <div
                key={prod.id}
                className="bg-white rounded-lg p-5 border border-platinum-border shadow-subtle hover:border-slate-silver transition-all flex flex-col md:flex-row items-center gap-6"
              >
                <div className="w-full md:w-56 aspect-[4/3] rounded overflow-hidden bg-platinum-soft shrink-0 relative border border-platinum-border">
                  <img src={primaryImg} alt={prod.name} className="w-full h-full object-cover" />
                  {prod.threeDAsset && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-graphite-deep text-platinum text-[10px] font-semibold rounded flex items-center space-x-1 shadow-subtle border border-graphite-border">
                      <Box className="w-3 h-3 text-slate-silver" />
                      <span>3D</span>
                    </span>
                  )}
                </div>

                <div className="flex-grow space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-mono font-semibold text-graphite bg-platinum-soft px-2 py-0.5 rounded border border-platinum-border">
                      {prod.sku}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-dark">
                      {prod.category?.name}
                    </span>
                    {prod.threeDAsset && (
                      <span className="text-[10px] bg-white text-status-success border border-platinum-border px-2 py-0.5 rounded font-medium">
                        ✓ 1:1 Photo &amp; 3D Match
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-medium text-graphite">{prod.name}</h3>
                  <p className="text-xs text-slate-dark line-clamp-2 leading-relaxed max-w-2xl">{prod.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-dark pt-1">
                    <span><strong>Capacity:</strong> {prod.seatingCapacity}</span>
                    <span><strong>Dimensions:</strong> {prod.dimensionsSummary}</span>
                    <span><strong>Frame:</strong> {prod.frameMaterial}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-44">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="px-4 py-2.5 text-center rounded-md bg-white hover:bg-platinum-soft text-graphite text-xs font-semibold transition-colors border border-graphite"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/studio?baseProduct=${prod.id}`}
                    className="px-4 py-2.5 text-center rounded-md bg-platinum-soft hover:bg-platinum text-graphite text-xs font-semibold transition-colors border border-platinum-border"
                  >
                    Customize Studio
                  </Link>
                  <Link
                    href={`/custom-design?product=${prod.id}`}
                    className="px-4 py-2.5 text-center rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Comparison Bar when items are selected */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-graphite text-white px-5 py-3 rounded-md shadow-elevated border border-graphite-border flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-slate-silver" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Comparing {compareList.length} of 3 Designs
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-1.5 bg-platinum text-graphite-deep font-semibold text-xs rounded hover:bg-white transition-colors uppercase tracking-wider"
            >
              Compare Specs
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-slate-silver hover:text-white text-xs underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-w-5xl w-full rounded-lg p-6 md:p-8 shadow-elevated border border-platinum-border text-graphite relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-platinum-border mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-dark">Technical Comparison</span>
                <h3 className="font-serif text-2xl font-medium mt-0.5">Side-by-Side Specifications</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-slate-dark hover:text-graphite p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-platinum-border">
                    <th className="p-3 bg-platinum-soft w-44 font-semibold text-slate-dark">Specification</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 font-serif text-base text-graphite min-w-[220px]">
                        {p.name}
                        <span className="block font-mono text-[10px] text-slate-dark font-sans mt-0.5">{p.sku}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-platinum-border">
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Seating Capacity</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.seatingCapacity || 'Custom'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Dimensions Summary</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.dimensionsSummary || 'Custom CAD'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Structural Frame</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.frameMaterial || 'Kiln-Dried Salwood / Teak'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Comfort Foam Core</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.foamDensity || '45D Sag-Resistant HR Foam'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Upholstery Spec</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.upholsteryType || 'Belgian Weave / Velvet'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Interactive 3D</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.threeDAsset ? (
                          <span className="text-status-success font-semibold">Available (360° Rotate)</span>
                        ) : (
                          <span className="text-slate-muted">High-Res Render</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-platinum-soft font-semibold text-slate-dark">Actions</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">
                        <Link
                          href={`/products/${p.slug}`}
                          className="px-3 py-1.5 bg-graphite text-white text-xs font-semibold rounded hover:bg-graphite-hover inline-block"
                        >
                          View Details
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
