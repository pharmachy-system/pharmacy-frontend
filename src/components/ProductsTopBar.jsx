import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3x3, List, ChevronDown, SlidersHorizontal } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'default',     label: 'الأكثر صلة' },
  { value: 'newest',      label: 'الأحدث' },
  { value: 'price-asc',   label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc',  label: 'السعر: من الأعلى للأقل' },
  { value: 'rating',      label: 'الأعلى تقييماً' },
  { value: 'bestseller',  label: 'الأكثر مبيعاً' },
];

const ProductsTopBar = ({
  totalProducts = 0,
  displayedCount = 0,
  sortBy = 'default',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  searchQuery = '',
  onSearchChange,
  onOpenMobileFilters,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="text-sm text-gray-600 font-medium">
          عرض <span className="text-[#1B3D6F] font-bold">{displayedCount}</span> من{' '}
          <span className="text-[#1B3D6F] font-bold">{totalProducts}</span> منتج
        </div>

        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#1B3D6F] hover:border-[#1FB5C9] hover:text-[#1FB5C9] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          فلاتر
        </button>

        <div className="flex-1" />

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1FB5C9] focus:ring-2 focus:ring-[#1FB5C9]/20 transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm text-sm font-medium text-[#1B3D6F] hover:border-[#1FB5C9] transition-colors"
          >
            <span>{currentSort.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSortOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange?.(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-right text-sm transition-colors ${
                      sortBy === option.value
                        ? 'bg-[#1FB5C9]/10 text-[#1FB5C9] font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onViewModeChange?.('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#1FB5C9] shadow-sm'
                : 'text-gray-500 hover:text-[#1B3D6F]'
            }`}
            aria-label="عرض شبكي"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange?.('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white text-[#1FB5C9] shadow-sm'
                : 'text-gray-500 hover:text-[#1B3D6F]'
            }`}
            aria-label="عرض قائمة"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTopBar;