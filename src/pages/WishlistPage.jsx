import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import axiosClient from '../utils/axiosClient';

export default function WishlistPage() {
  const { user }  = useAuth();
  const { addToCart } = useCart();
  const navigate  = useNavigate();
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [movingId,   setMovingId]   = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/wishlist');
      setItems(data.items || []);
    } catch { toast.error('فشل تحميل المفضلة'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: { pathname: '/favorites' } } }); return; }
    fetchWishlist();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = async (medicineId) => {
    setRemovingId(medicineId);
    try {
      await axiosClient.delete(`/wishlist/${medicineId}`);
      setItems(prev => prev.filter(i => (i.medicine?.id || i.medicine?._id) !== medicineId));
      toast.success('تم الحذف من المفضلة');
    } catch { toast.error('فشل الحذف'); }
    finally { setRemovingId(null); }
  };

  const handleMoveToCart = async (item) => {
    const med   = item.medicine;
    const medId = med?.id || med?._id;
    setMovingId(medId);
    try {
      await axiosClient.post('/wishlist/move-to-cart', { medicineId: medId });
      addToCart({ _id: medId, name: med.name, price: med.finalPrice ?? med.price, images: med.images }, 1);
      setItems(prev => prev.filter(i => (i.medicine?.id || i.medicine?._id) !== medId));
      toast.success('تمت الإضافة إلى السلة');
    } catch { toast.error('فشل النقل إلى السلة'); }
    finally { setMovingId(null); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-pharmacy-cyan" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-rose-50/20 to-pink-50/10 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-pharmacy-cyan">الرئيسية</Link>
            <span>/</span><span className="text-gray-600">المفضلة</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-pharmacy-blue">قائمة المفضلة</h1>
              <p className="text-sm text-gray-400">{items.length} منتج محفوظ</p>
            </div>
          </div>
        </div>

        {/* Empty */}
        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm py-24 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 text-rose-200" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">قائمة المفضلة فارغة</h2>
            <p className="text-sm text-gray-400 mb-8">أضف منتجات تعجبك لتجدها هنا بسهولة</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-sm shadow-lg shadow-pharmacy-cyan/20 hover:-translate-y-0.5 transition-all">
              تصفح المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => {
                const med   = item.medicine || {};
                const medId = med.id || med._id;
                const price = med.finalPrice ?? med.price;
                const img   = med.images?.[0] || null;
                const inStock = !med.isOutOfStock && (med.stock == null || med.stock > 0);
                return (
                  <motion.div key={item._id || medId}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 0.28 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pharmacy-cyan/20 transition-all p-4 flex items-center gap-4">

                    <Link to={`/product/${medId}`}
                      className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center border border-gray-100">
                      {img
                        ? <img src={img} alt={med.name} className="w-full h-full object-cover" />
                        : <Package className="w-8 h-8 text-gray-200" />}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${medId}`}>
                        <h3 className="font-bold text-pharmacy-blue text-sm line-clamp-2 hover:text-pharmacy-cyan transition-colors">
                          {med.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5">
                        {price != null
                          ? <span className="text-lg font-black text-pharmacy-cyan">{Number(price).toFixed(2)} <span className="text-xs font-medium text-gray-400">ر.س</span></span>
                          : <span className="text-xs text-gray-400">السعر غير متوفر</span>
                        }
                        {!inStock && <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">غير متوفر</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {inStock && (
                        <button onClick={() => handleMoveToCart(item)} disabled={movingId === medId}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-xs shadow-sm hover:-translate-y-0.5 transition-all disabled:opacity-50">
                          {movingId === medId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                          أضف للسلة
                        </button>
                      )}
                      <button onClick={() => handleRemove(medId)} disabled={removingId === medId}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors disabled:opacity-50">
                        {removingId === medId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
