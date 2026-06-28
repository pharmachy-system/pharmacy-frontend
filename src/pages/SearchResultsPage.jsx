import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Loader2, ArrowLeft, Filter, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import API from '../api/axios';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('search') || '';
  const { addToCart } = useCart();

  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);
  const [sort,     setSort]     = useState('relevance');
  const [addingId, setAddingId] = useState(null);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.get('/medicines', { params: { search: query, limit: 24, sort } });
      const list = data.medicines || data.data || [];
      setResults(list);
      setTotal(data.total || data.count || list.length);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, [query, sort]);

  useEffect(() => { search(); }, [search]);

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    addToCart({ ...product, quantity: 1 });
    toast.success('تمت الإضافة إلى السلة');
    setTimeout(() => setAddingId(null), 800);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/20 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-pharmacy-cyan">الرئيسية</Link>
            <span>/</span>
            <span className="text-gray-600">البحث</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black text-pharmacy-blue">نتائج البحث</h1>
              </div>
              {query && (
                <p className="text-gray-500 text-sm mr-13">
                  نتائج البحث عن: <span className="font-bold text-gray-800">"{query}"</span>
                  {!loading && <span> — <span className="text-pharmacy-cyan font-bold">{total}</span> نتيجة</span>}
                </p>
              )}
            </div>

            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white outline-none focus:border-pharmacy-cyan shadow-sm">
              <option value="relevance">الأكثر صلة</option>
              <option value="price-asc">السعر: الأقل</option>
              <option value="price-desc">السعر: الأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-pharmacy-cyan mb-4" />
            <p className="text-sm text-gray-400">جاري البحث...</p>
          </div>
        ) : results.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h2>
            <p className="text-sm text-gray-400 mb-8">جرّب كلمات بحث مختلفة أو تصفح جميع المنتجات</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-sm shadow-lg shadow-pharmacy-cyan/20 hover:-translate-y-0.5 transition-all">
              تصفح جميع المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {results.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pharmacy-cyan/30 transition-all overflow-hidden">
                  <Link to={`/product/${p._id}`}>
                    <div className="h-36 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden">
                      {p.images?.[0] || p.image
                        ? <img src={p.images?.[0] || p.image} alt={p.name} className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform" />
                        : <Package className="w-12 h-12 text-gray-200" />
                      }
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-pharmacy-cyan font-semibold mb-1 line-clamp-1">{p.category?.name || p.category || ''}</p>
                      <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-pharmacy-blue transition-colors">{p.name}</h3>
                      {p.rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-500">{p.rating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="px-3 pb-3 flex items-center justify-between">
                    <span className="text-base font-black text-pharmacy-blue">{p.price} <span className="text-xs font-semibold text-gray-400">ر.س</span></span>
                    <button onClick={() => handleAddToCart(p)} disabled={addingId === p._id}
                      className="w-8 h-8 rounded-lg bg-pharmacy-cyan/10 hover:bg-pharmacy-cyan text-pharmacy-cyan hover:text-white flex items-center justify-center transition-all disabled:opacity-50">
                      {addingId === p._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
