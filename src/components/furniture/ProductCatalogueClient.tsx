'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  X, 
  Check, 
  Scale, 
  FileText,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { ProductItem, CategoryItem, CollectionItem } from '@/lib/types';

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

  // Shortlist (Wishlist) and Compare State (stored locally)
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
          const matchDesc = p.description.toLowerCase().includes(q);
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
    <div className="space-y-8">
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search by name, SKU, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold text-charcoal"
            />
            <Search className="w-4 h-4 text-walnut absolute left-3.5 top-3" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-charcoal/50 hover:text-charcoal"
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
              className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs text-charcoal focus:outline-none focus:border-gold"
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
              className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs text-charcoal focus:outline-none focus:border-gold"
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
              className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-xs text-charcoal focus:outline-none focus:border-gold"
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
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-charcoal text-white' : 'text-charcoal hover:bg-ivory-100'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-charcoal text-white' : 'text-charcoal hover:bg-ivory-100'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Checkbox Chips & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-ivory-200 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center space-x-2 cursor-pointer bg-ivory-50 px-3 py-1.5 rounded-xl border border-ivory-300 hover:border-gold">
              <input
                type="checkbox"
                checked={only3D}
                onChange={(e) => setOnly3D(e.target.checked)}
                className="rounded text-gold focus:ring-0"
              />
              <span className="flex items-center space-x-1 font-medium text-charcoal">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>With Interactive 3D Model</span>
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-ivory-50 px-3 py-1.5 rounded-xl border border-ivory-300 hover:border-gold">
              <input
                type="checkbox"
                checked={onlyCustomizable}
                onChange={(e) => setOnlyCustomizable(e.target.checked)}
                className="rounded text-gold focus:ring-0"
              />
              <span className="font-medium text-charcoal">Customizable Only</span>
            </label>

            {(search || selectedCategory || selectedType || selectedCollection || only3D || onlyCustomizable) && (
              <button
                onClick={clearFilters}
                className="text-gold hover:text-gold-dark font-medium underline px-2 py-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="text-xs text-charcoal/60">
            Showing <strong className="text-charcoal">{filteredProducts.length}</strong> bespoke designs
          </div>
        </div>
      </div>

      {/* Product Grid / List Results */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-ivory-300 space-y-4">
          <div className="w-12 h-12 rounded-full bg-ivory-100 flex items-center justify-center text-walnut mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-charcoal font-medium">No matching designs found</h3>
          <p className="text-xs text-charcoal/70 max-w-md mx-auto">
            We can manufacture any custom silhouette from your reference photos. Use our Custom Studio or upload your Pinterest/Google design inspiration.
          </p>
          <div className="pt-2">
            <Link
              href="/custom-design"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-charcoal text-white text-xs font-semibold uppercase tracking-wider"
            >
              <span>Upload Your Design</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((prod) => {
            const primaryImg =
              prod.images.find((i: any) => i.isPrimary)?.url ||
              prod.images[0]?.url ||
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
            const isCompared = compareList.includes(prod.id);
            const isShortlisted = shortlist.includes(prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-luxury-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Stage */}
                  <div className="relative aspect-[4/3] bg-ivory-100 overflow-hidden">
                    <img
                      src={primaryImg}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Floating Controls */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/90 backdrop-blur text-charcoal text-[10px] font-mono font-semibold rounded-full border border-ivory-300">
                        {prod.sku}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleShortlist(prod.id)}
                          className={`p-1.5 rounded-full backdrop-blur transition-colors ${
                            isShortlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-charcoal/70 hover:bg-white'
                          }`}
                          title="Save to Shortlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-red-600' : ''}`} />
                        </button>

                        <button
                          onClick={() => toggleCompare(prod.id)}
                          className={`p-1.5 rounded-full backdrop-blur transition-colors ${
                            isCompared ? 'bg-charcoal text-gold' : 'bg-white/80 text-charcoal/70 hover:bg-white'
                          }`}
                          title="Compare Design"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom 3D Badge */}
                    {prod.threeDAsset && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 bg-charcoal text-gold text-[10px] font-semibold rounded-full flex items-center space-x-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          <span>3D Model</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                      {prod.category?.name}
                    </span>

                    <h3 className="font-serif text-lg font-medium text-charcoal group-hover:text-gold transition-colors line-clamp-1">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="pt-3 border-t border-ivory-200 space-y-1 text-xs text-charcoal/80">
                      <div className="flex justify-between">
                        <span className="text-walnut font-medium">Capacity:</span>
                        <span>{prod.seatingCapacity || 'Custom Seater'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-walnut font-medium">Dimensions:</span>
                        <span className="truncate max-w-[130px]">{prod.dimensionsSummary || 'Custom CAD'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons (STRICTLY NO CART / BUY NOW) */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="px-3 py-2 text-center rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold transition-colors"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/studio?baseProduct=${prod.id}`}
                      className="px-3 py-2 text-center rounded-xl bg-gold/15 hover:bg-gold/25 text-walnut text-xs font-semibold transition-colors"
                    >
                      Customize
                    </Link>
                  </div>

                  <Link
                    href={`/custom-design?product=${prod.id}`}
                    className="w-full block py-2.5 text-center rounded-xl bg-charcoal hover:bg-charcoal-light text-ivory-100 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {filteredProducts.map((prod) => {
            const primaryImg =
              prod.images.find((i: any) => i.isPrimary)?.url ||
              prod.images[0]?.url ||
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
            const isCompared = compareList.includes(prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm hover:shadow-luxury transition-all flex flex-col md:flex-row items-center gap-6"
              >
                <div className="w-full md:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-ivory-100 shrink-0 relative">
                  <img src={primaryImg} alt={prod.name} className="w-full h-full object-cover" />
                  {prod.threeDAsset && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-charcoal text-gold text-[10px] font-semibold rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>3D</span>
                    </span>
                  )}
                </div>

                <div className="flex-grow space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-xs font-mono font-semibold text-charcoal bg-ivory-100 px-2 py-0.5 rounded">
                      {prod.sku}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold">
                      {prod.category?.name}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-charcoal">{prod.name}</h3>
                  <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed max-w-2xl">{prod.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-charcoal/80 pt-1">
                    <span><strong>Capacity:</strong> {prod.seatingCapacity}</span>
                    <span><strong>Dimensions:</strong> {prod.dimensionsSummary}</span>
                    <span><strong>Frame:</strong> {prod.frameMaterial}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-44">
                  <Link
                    href={`/products/${prod.slug}`}
                    className="px-4 py-2.5 text-center rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/studio?baseProduct=${prod.id}`}
                    className="px-4 py-2.5 text-center rounded-xl bg-gold/15 hover:bg-gold/25 text-walnut text-xs font-semibold transition-colors"
                  >
                    Customize Studio
                  </Link>
                  <Link
                    href={`/custom-design?product=${prod.id}`}
                    className="px-4 py-2.5 text-center rounded-xl bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold uppercase tracking-wider transition-colors"
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-charcoal text-white px-6 py-4 rounded-2xl shadow-2xl border border-gold/40 flex items-center space-x-6 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Comparing {compareList.length} of 3 Designs
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs rounded-xl uppercase tracking-wider transition-colors"
            >
              Compare Specifications
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-ivory-300 hover:text-white text-xs underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-w-5xl w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-ivory-300 text-charcoal relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-gold">Technical Comparison</span>
                <h3 className="font-serif text-2xl font-semibold mt-0.5">Side-by-Side Specifications</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-charcoal/50 hover:text-charcoal p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ivory-300">
                    <th className="p-3 bg-ivory-50 w-44 font-semibold text-walnut">Specification</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 font-serif text-base text-charcoal min-w-[220px]">
                        {p.name}
                        <span className="block font-mono text-[10px] text-charcoal/60 font-sans mt-0.5">{p.sku}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">Seating Capacity</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.seatingCapacity || 'Custom'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">Dimensions Summary</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.dimensionsSummary || 'Custom CAD'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">Frame Material</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.frameMaterial || 'Solid Hardwood'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">Foam &amp; Cushioning</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.foamDensity || '45D HR Foam'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">Upholstery Tier</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3">{p.upholsteryType || 'Luxe Velvet / Boucle'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">3D Model Available</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 font-semibold text-emerald-700">
                        {p.threeDAsset ? 'Yes (Interactive 360°)' : 'Photo Gallery Only'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-ivory-50 font-semibold text-walnut">Commercial Workflow</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-walnut">
                        Offline Quotation Finalized at Atelier
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-4 border-t border-ivory-200 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-6 py-2.5 bg-charcoal text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
