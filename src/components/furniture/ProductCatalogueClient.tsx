'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Heart, 
  ArrowRight, 
  X, 
  GitCompareArrows, 
  SlidersHorizontal
} from 'lucide-react';
import { ProductItem, CategoryItem, CollectionItem } from '@/lib/types';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { useWishlist } from '@/components/furniture/WishlistProvider';
import { useToast } from '@/components/ui/ToastProvider';

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
  const { info: toastInfo } = useToast();
  // Search & Filter State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'capacity'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => { setSearch(initialSearch); setSelectedCategory(initialCategory); setSelectedType(initialType); setSelectedCollection(initialCollection); }, [initialSearch, initialCategory, initialType, initialCollection]);

  // Shortlist and Compare State
  const { productIds: wishlistIds, toggleWishlist } = useWishlist();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Toggle Compare
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        toastInfo('Comparison Limit', 'You can compare a maximum of 3 furniture designs simultaneously.');
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
        if (selectedCategory && !(selectedCategory === 'fancy-chairs' && p.furnitureType === 'CHAIR') && !(selectedCategory === 'luxury-sofas' && p.furnitureType === 'SOFA') && p.category?.slug !== selectedCategory) {
          return false;
        }

        // Furniture Type
        if (selectedType && !(selectedType === 'SECTIONAL' && p.category?.slug === 'sectional-sofas') && !(selectedType === 'LOUNGE' && p.category?.slug === 'lounge-chairs') && p.furnitureType !== selectedType) {
          return false;
        }

        // Collection
        if (selectedCollection && p.collection?.slug !== selectedCollection) {
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
  }, [products, search, selectedCategory, selectedType, selectedCollection, onlyCustomizable, sortBy]);

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
    setOnlyCustomizable(false);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6">
      <div className="catalogue-type-tabs" aria-label="Furniture collections">{[{value:'',label:'All designs'},{value:'SOFA',label:'Luxury & fancy sofas'},{value:'CHAIR',label:'Fancy chairs'}].map(tab=><button key={tab.value} aria-pressed={selectedType===tab.value&&!selectedCategory&&!selectedCollection} onClick={()=>{setSelectedType(tab.value);setSelectedCategory('');setSelectedCollection('');setSearch('')}}><span>{tab.label}</span><b>{products.filter(p=>!tab.value||p.furnitureType===tab.value).length}</b></button>)}</div>
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
              title="LayoutGrid View"
            >
              <LayoutGrid className="w-4 h-4" />
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
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="rounded text-graphite focus:ring-0"
              />
              <span className="font-medium text-graphite">Customizable Only</span>
            </label>

            {(search || selectedCategory || selectedType || selectedCollection || onlyCustomizable) && (
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

      {/* Product LayoutGrid / List Results */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-platinum-border space-y-4">
          <div className="w-12 h-12 rounded bg-platinum-soft flex items-center justify-center text-slate-dark mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-graphite font-medium">No matching designs found</h3>
          <p className="text-xs text-slate-dark max-w-md mx-auto">
            We can manufacture any custom silhouette from your reference photos. Use our customization studio or upload your Pinterest design inspiration.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((prod) => (
            <LuxuryProductCard
              key={prod.id}
              product={prod}
              isShortlisted={wishlistIds.includes(prod.id)}
              isCompared={compareList.includes(prod.id)}
              onToggleShortlist={toggleWishlist}
              onToggleCompare={toggleCompare}
              showQuickActions={true}
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {filteredProducts.map((prod) => (
            <div className="premium-product-list-row" key={prod.id}>
              <LuxuryProductCard product={prod} isShortlisted={wishlistIds.includes(prod.id)} isCompared={compareList.includes(prod.id)} onToggleShortlist={toggleWishlist} onToggleCompare={toggleCompare} />
            </div>
          ))}
        </div>
      )}

      {/* Floating Comparison Bar when items are selected */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-graphite text-white px-5 py-3 rounded-md shadow-elevated border border-graphite-border flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <GitCompareArrows className="w-4 h-4 text-slate-silver" />
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
