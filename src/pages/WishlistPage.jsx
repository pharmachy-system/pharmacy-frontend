import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import axiosClient from '../utils/axiosClient';

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movingId, setMovingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/favorites' } } });
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosClient.get('/wishlist');
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحميل المفضلة');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (medicineId) => {
    setRemovingId(medicineId);
    try {
      await axiosClient.delete(`/wishlist/${medicineId}`);
      setItems(prev => prev.filter(i => (i.medicine?.id || i.medicine?._id) !== medicineId));
    } catch (err) {
      setError(err.response?.data?.message || 'فشل الحذف من المفضلة');
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (item) => {
    const med = item.medicine;
    const medId = med?.id || med?._id;
    setMovingId(medId);
    try {
      await axiosClient.post('/wishlist/move-to-cart', { medicineId: medId });
      // Also add to local cart context so header badge updates
      addToCart({
        _id: medId,
        name: med.name,
        price: med.finalPrice ?? med.price,
        images: med.images,
      }, 1);
      setItems(prev => prev.filter(i => (i.medicine?.id || i.medicine?._id) !== medId));
    } catch (err) {
      setError(err.response?.data?.message || 'فشل نقل المنتج للسلة');
    } finally {
      setMovingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-[#1FB5C9]" />
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
      <XCircle className="w-12 h-12 text-red-400" />
      <p className="text-gray-600">{error}</p>
      <button onClick={fetchWishlist}
        className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
        style={{ background: 'linear-gradient(135deg,#0f3460,#1FB5C9)' }}>
        إعادة المحاولة
      </button>
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4" dir="rtl">
      <div className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,rgba(31,181,201,0.1),rgba(15,52,96,0.08))' }}>
        <Heart className="w-12 h-12 text-[#1FB5C9]" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-black text-[#0f3460] mb-2">قائمة المفضلة فارغة</h2>
        <p className="text-gray-500 text-sm">أضف منتجات تعجبك لتجدها هنا</p>
      </div>
      <Link to="/products"
        className="px-6 py-3 rounded-xl text-white font-bold text-sm"
        style={{ background: 'linear-gradient(135deg,#0f3460,#1FB5C9)', boxShadow: '0 4px 14px rgba(31,181,201,0.3)' }}>
        تصفح المنتجات
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          <h1 className="text-2xl font-black text-[#0f3460]">المفضلة</h1>
          <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full font-bold">
            {items.length} منتج
          </span>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => {
              const med = item.medicine || {};
              const medId = med.id || med._id;
              const effectivePrice = med.finalPrice ?? med.price;
              const img = med.images?.[0] || null;
              const isInStock = !med.isOutOfStock && (med.stock == null || med.stock > 0);
              const isMoving = movingId === medId;
              const isRemoving = removingId === medId;

              return (
                <motion.div
                  key={item._id || medId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4"
                  style={{ boxShadow: '0 2px 16px rgba(15,52,96,0.07)' }}
                >
                  {/* Image */}
                  <Link to={`/product/${medId}`}
                    className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#e0f7fa,#e3f2fd)' }}>
                    {img
                      ? <img src={img} alt={med.name} className="w-full h-full object-cover" />
                      : <Package className="w-8 h-8 text-[#1FB5C9] opacity-60" />}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${medId}`}>
                      <h3 className="font-bold text-[#0f3460] text-sm truncate hover:text-[#1FB5C9] transition-colors">
                        {med.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mt-1">
                      {effectivePrice != null ? (
                        <span className="text-base font-black text-[#1FB5C9]">
                          {Number(effectivePrice).toFixed(2)} ريال
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">السعر غير متوفر</span>
                      )}
                    </div>
                    {!isInStock && (
                      <span className="text-xs text-red-500 font-bold">غير متوفر</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isInStock && (
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isMoving}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white font-bold text-xs transition-all disabled:opacity-60 hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg,#0f3460,#1FB5C9)', boxShadow: '0 3px 10px rgba(31,181,201,0.3)' }}
                      >
                        {isMoving
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <ShoppingCart className="w-3.5 h-3.5" />}
                        أضف للسلة
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(medId)}
                      disabled={isRemoving}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-60"
                    >
                      {isRemoving
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
