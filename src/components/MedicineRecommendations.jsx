import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Package, ShoppingCart, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import axiosClient from '../utils/axiosClient';

export default function MedicineRecommendations() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          // Personalised: based on order history (backend returns top-N)
          const { data } = await axiosClient.get('/medicines/recommendations?limit=6');
          setProducts(data.medicines || data.data || []);
        } else {
          // Guest: show best-sellers
          const { data } = await axiosClient.get('/medicines?sort=sales&limit=6');
          setProducts(data.medicines || data.data || []);
        }
      } catch {
        // Fallback to a simple list
        try {
          const { data } = await axiosClient.get('/medicines?limit=6');
          setProducts(data.medicines || data.data || []);
        } catch { /* silent */ }
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  if (loading) return (
    <section className="py-16 px-6" dir="rtl">
      <div className="max-w-screen-xl mx-auto flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pharmacy-cyan/40" />
      </div>
    </section>
  );

  if (!products.length) return null;

  return (
    <section dir="rtl" className="py-16 px-6 bg-gradient-to-b from-white to-cyan-50/30">
      <div className="max-w-screen-xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {user ? 'مقترح لك' : 'الأكثر مبيعاً'}
            </span>
            <h2 className="text-2xl font-black text-pharmacy-blue">
              {user ? 'منتجات بناءً على اهتماماتك' : 'المنتجات الأكثر مبيعاً'}
            </h2>
          </div>
          <Link to="/products"
            className="text-sm font-bold text-pharmacy-cyan hover:text-pharmacy-blue transition-colors">
            عرض الكل ←
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((med, i) => {
            const id    = med._id || med.id;
            const price = med.finalPrice ?? med.price;
            const img   = med.images?.[0] || null;
            return (
              <motion.div key={id || i}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pharmacy-cyan/20 transition-all flex flex-col overflow-hidden group">

                <Link to={`/product/${id}`}
                  className="w-full aspect-square bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden">
                  {img
                    ? <img src={img} alt={med.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <Package className="w-10 h-10 text-gray-200" />
                  }
                </Link>

                <div className="p-3 flex flex-col flex-1">
                  <Link to={`/product/${id}`}>
                    <h3 className="text-xs font-bold text-pharmacy-blue line-clamp-2 hover:text-pharmacy-cyan transition-colors leading-snug mb-1">
                      {med.name}
                    </h3>
                  </Link>
                  {price != null && (
                    <p className="text-sm font-black text-pharmacy-cyan mt-auto">
                      {Number(price).toFixed(2)} <span className="text-[10px] font-medium text-gray-400">ر.س</span>
                    </p>
                  )}
                  <button
                    onClick={() => { addToCart({ _id: id, name: med.name, price, images: med.images }, 1); toast.success('تمت الإضافة'); }}
                    aria-label={`أضف ${med.name} للسلة`}
                    className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all">
                    <ShoppingCart className="w-3 h-3" /> أضف للسلة
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
