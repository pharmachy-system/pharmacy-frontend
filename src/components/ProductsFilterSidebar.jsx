import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Star, Check } from 'lucide-react';
import { CATEGORIES, BRANDS } from '../data/mockProducts';

const FilterSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-right mb-3"
    >
      <ChevronDown
        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? '' : '-rotate-90'}`}
      />
      <h4 className="text-sm font-bold text-[#1B3D6F]">{title}</h4>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="space-y-2 pt-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Checkbox = ({ checked, onChange, label, count }) => (
  <label className="flex items-center justify-between cursor-pointer group py-1">
    <span className="text-sm text-gray-600 group-hover:text-[#1B3D6F] transition-colors">
      {label}
      {count !== undefined && (
        <span className="text-xs text-gray-400 mr-1">({count})</span>
      )}
    </span>
    <button
      onClick={onChange}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
        checked
          ? 'bg-[#1FB5C9] border-[#1FB5C9]'
          : 'bg-white border-gray-300 group-hover:border-[#1FB5C9]'
      }`}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>
  </label>
);

const ProductsFilterSidebar = ({
  filters,
  onFiltersChange,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const updateFilter = (key, value) =>
    onFiltersChange?.({ ...filters, [key]: value });

  const toggleCategory = (catId) => {
    const current = filters.categories || [];
    const next = current.includes(catId)
      ? current.filter((c) => c !== catId)
      : [...current, catId];
    updateFilter('categories', next);
  };

  const toggleBrand = (brand) => {
    const current = filters.brands || [];
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    updateFilter('brands', next);
  };

  const clearAll = () =>
    onFiltersChange?.({
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 500,
      minRating: 0,
      inStock: false,
    });

  const content = (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-[#1FB5C9] hover:text-[#1B3D6F] transition-colors"
        >
          مسح الكل
        </button>
        <h3 className="text-base font-bold text-[#1B3D6F]">الفلاتر</h3>
      </div>

      <FilterSection
        title="التصنيفات"
        isOpen={openSections.category}
        onToggle={() => toggleSection('category')}
      >
        {CATEGORIES.map((cat) => (
          <Checkbox
            key={cat.id}
            checked={(filters.categories || []).includes(cat.id)}
            onChange={() => toggleCategory(cat.id)}
            label={`${cat.icon} ${cat.name}`}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="السعر (ر.س)"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{filters.maxPrice || 500} ر.س</span>
            <span>{filters.minPrice || 0} ر.س</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.maxPrice || 500}
            onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1FB5C9]"
          />
        </div>
      </FilterSection>

      <FilterSection
        title="الماركات"
        isOpen={openSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
          {BRANDS.map((brand) => (
            <Checkbox
              key={brand}
              checked={(filters.brands || []).includes(brand)}
              onChange={() => toggleBrand(brand)}
              label={brand}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="التقييم"
        isOpen={openSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => updateFilter('minRating', rating === filters.minRating ? 0 : rating)}
            className={`w-full flex items-center justify-end gap-2 py-1.5 px-2 rounded-lg transition-colors ${
              filters.minRating === rating ? 'bg-[#1FB5C9]/10' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-xs text-gray-600">وأكثر</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
          </button>
        ))}
      </FilterSection>

      <FilterSection
        title="التوفّر"
        isOpen={openSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-600">المنتجات المتوفّرة فقط</span>
          <button
            onClick={() => updateFilter('inStock', !filters.inStock)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              filters.inStock ? 'bg-[#1FB5C9]' : 'bg-gray-300'
            }`}
          >
            <motion.span
              animate={{ x: filters.inStock ? -20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md"
            />
          </button>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 flex-shrink-0 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-5 h-fit sticky top-24">
        {content}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white z-50 overflow-y-auto p-5 shadow-2xl"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="mt-12">{content}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsFilterSidebar;