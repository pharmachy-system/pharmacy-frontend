import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { PackageX, Loader2 } from 'lucide-react';
import ProductsHeroCarousel from '../components/ProductsHeroCarousel';
import ProductsTopBar from '../components/ProductsTopBar';
import ProductsFilterSidebar from '../components/ProductsFilterSidebar';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../api/productsApi';
import useSEO from '../hooks/useSEO';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../utils/axiosClient';
import { toggleGuestWishlistItem } from '../utils/guestWishlist';
import { toast } from 'sonner';

const INITIAL_FILTERS = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 500,
  minRating: 0,
  inStock: false,
};

const ProductsPage = () => {
  useSEO({ title: 'المنتجات', description: 'تصفح آلاف الأدوية والفيتامينات ومنتجات العناية الشخصية بأفضل الأسعار' });
  const { user } = useAuth();
  // Tracks which product IDs are currently wishlisted on this page session
  // (ProductCard starts with isWishlisted=false so first toggle = add)
  const wishlistSet = useRef(new Set());
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      const result = await getAllProducts();
      if (!mounted) return;
      if (result.success) {
        setAllProducts(result.products);
        setError(null);
      } else {
        setError(result.error || 'فشل تحميل المنتجات');
      }
      setIsLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (filters.categories?.length) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands?.length) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.maxPrice < 500) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'bestseller':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, filters, sortBy, searchQuery]);

  // handleAddToCart is unused — ProductCard calls useCart().addToCart internally
  const handleAddToCart = (_product) => {};

  const handleToggleWishlist = async (product) => {
    const id = product._id || product.id;
    const isAdding = !wishlistSet.current.has(id);
    if (isAdding) { wishlistSet.current.add(id); } else { wishlistSet.current.delete(id); }

    if (user) {
      try {
        if (isAdding) {
          await axiosClient.post('/wishlist', { medicineId: id });
          toast.success('تمت الإضافة إلى المفضلة');
        } else {
          await axiosClient.delete(`/wishlist/${id}`);
          toast.success('تمت الإزالة من المفضلة');
        }
      } catch {
        // Rollback local tracking on failure
        if (isAdding) { wishlistSet.current.delete(id); } else { wishlistSet.current.add(id); }
        toast.error('فشل تحديث المفضلة');
      }
    } else {
      const added = toggleGuestWishlistItem(product);
      toast.success(added ? 'تمت الإضافة إلى المفضلة' : 'تمت الإزالة من المفضلة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/20" dir="rtl">

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <section className="mb-8">
          <ProductsHeroCarousel />
        </section>

        <section className="flex gap-6">
          <ProductsFilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isMobileOpen={isMobileFiltersOpen}
            onMobileClose={() => setIsMobileFiltersOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <ProductsTopBar
              totalProducts={allProducts.length}
              displayedCount={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            <div className="mt-6">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1FB5C9] animate-spin" />
                  <p className="mt-4 text-sm text-gray-500">جاري تحميل المنتجات...</p>
                </div>
              )}

              {!isLoading && error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}

              {!isLoading && !error && filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100"
                >
                  <PackageX className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-[#1B3D6F] mb-2">
                    لا توجد منتجات
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm text-center">
                    جرّب تغيير الفلاتر أو البحث بكلمات مختلفة
                  </p>
                  <button
                    onClick={() => {
                      setFilters(INITIAL_FILTERS);
                      setSearchQuery('');
                    }}
                    className="mt-5 px-5 py-2 rounded-xl bg-[#1FB5C9] text-white text-sm font-semibold hover:bg-[#1B3D6F] transition-colors"
                  >
                    مسح الفلاتر
                  </button>
                </motion.div>
              )}

              {!isLoading && !error && filteredProducts.length > 0 && (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default ProductsPage;