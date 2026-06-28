import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice >= 200 ? 0 : 25;
  const vat = +(totalPrice * 0.15).toFixed(2);
  const grandTotal = +(totalPrice + shipping + vat).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4" dir="rtl">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pharmacy-cyan/10 to-pharmacy-blue/8 flex items-center justify-center">
          <ShoppingCart className="w-14 h-14 text-pharmacy-cyan" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-pharmacy-blue mb-2">السلة فارغة</h2>
          <p className="text-gray-500 text-sm">أضف منتجات لتبدأ التسوق</p>
        </div>
        <Link to="/products"
          className="flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-bold text-sm bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
          <Package className="w-4 h-4" /> تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-8" dir="rtl">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-pharmacy-blue">سلة التسوق</h1>
            <p className="text-sm text-gray-500 mt-0.5">{getTotalItems()} منتج في السلة</p>
          </div>
          <button onClick={clearCart}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50">
            <Trash2 className="w-4 h-4" /> إفراغ السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div key={item._id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60 }} transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 items-center shadow-sm border border-gray-100 hover:border-pharmacy-cyan/20 hover:shadow-md transition-all">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 border border-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-pharmacy-cyan opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-pharmacy-blue text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-pharmacy-cyan font-black text-base mt-0.5">
                      {item.price} <span className="text-xs font-semibold text-gray-400">ريال</span>
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-pharmacy-blue hover:bg-pharmacy-cyan/10 transition-colors border border-gray-200">
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black text-pharmacy-blue text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-pharmacy-blue hover:bg-pharmacy-cyan/10 transition-colors border border-gray-200">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-left flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-gray-400">الإجمالي</p>
                    <p className="font-black text-pharmacy-blue">{+(item.price * item.quantity).toFixed(2)} ريال</p>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeFromCart(item._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link to="/products"
              className="flex items-center gap-2 text-sm font-semibold mt-2 w-fit text-pharmacy-cyan hover:text-pharmacy-blue transition-colors">
              <ArrowRight className="w-4 h-4" /> متابعة التسوق
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-lg shadow-blue-900/5 border border-gray-100">
              <h2 className="text-lg font-black text-pharmacy-blue mb-5">ملخص الطلب</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{getTotalItems()} منتج</span>
                  <span className="font-semibold text-gray-800">{totalPrice.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  {shipping === 0
                    ? <span className="font-bold text-emerald-500">مجاني 🎉</span>
                    : <span className="font-semibold text-gray-800">{shipping} ريال</span>
                  }
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-semibold text-gray-800">{vat} ريال</span>
                </div>

                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-pharmacy-cyan/5 text-pharmacy-blue border border-pharmacy-cyan/10">
                    <Tag className="w-3.5 h-3.5 text-pharmacy-cyan" />
                    أضف {(200 - totalPrice).toFixed(0)} ريال للحصول على شحن مجاني
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-black text-pharmacy-blue text-base">الإجمالي</span>
                  <span className="font-black text-pharmacy-cyan text-base">{grandTotal} ريال</span>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')}
                className="w-full mt-6 py-3.5 rounded-2xl text-white font-bold text-sm bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
                إتمام الطلب ←
              </button>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-3 mt-4 opacity-40">
                {['VISA', 'مدى', 'STC'].map(p => (
                  <span key={p} className="text-[10px] font-black text-gray-500 border border-gray-200 px-2 py-0.5 rounded">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
