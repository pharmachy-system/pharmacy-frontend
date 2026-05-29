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
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,rgba(31,181,201,0.1),rgba(15,52,96,0.08))' }}
        >
          <ShoppingCart className="w-14 h-14" style={{ color: '#1FB5C9' }} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#0f3460] mb-2">السلة فارغة</h2>
          <p className="text-gray-500 text-sm">أضف منتجات لتبدأ التسوق</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
            boxShadow: '0 4px 16px rgba(31,181,201,0.35)',
          }}
        >
          <Package className="w-4 h-4" />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8" dir="rtl">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0f3460]">سلة التسوق</h1>
            <p className="text-sm text-gray-500 mt-0.5">{getTotalItems()} منتج في السلة</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            إفراغ السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 items-center"
                  style={{ boxShadow: '0 2px 16px rgba(15,52,96,0.07)' }}
                >
                  {/* Image */}
                  <div
                    className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#e0f7fa,#e3f2fd)' }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-[#1FB5C9] opacity-60" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0f3460] text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-[#1FB5C9] font-black text-base mt-0.5">
                      {item.price} <span className="text-xs font-semibold">ريال</span>
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f3460] hover:bg-[rgba(31,181,201,0.1)] transition-colors border border-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black text-[#0f3460] text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0f3460] hover:bg-[rgba(31,181,201,0.1)] transition-colors border border-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-left flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-gray-400">الإجمالي</p>
                    <p className="font-black text-[#0f3460]">{+(item.price * item.quantity).toFixed(2)} ريال</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="flex items-center gap-2 text-sm font-semibold mt-2 w-fit"
              style={{ color: '#1FB5C9' }}
            >
              <ArrowRight className="w-4 h-4" />
              متابعة التسوق
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-2xl p-6 sticky top-24"
              style={{ boxShadow: '0 2px 20px rgba(15,52,96,0.08)' }}
            >
              <h2 className="text-lg font-black text-[#0f3460] mb-5">ملخص الطلب</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{getTotalItems()} منتج</span>
                  <span className="font-semibold text-gray-800">{totalPrice.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  {shipping === 0 ? (
                    <span className="font-bold text-green-500">مجاني 🎉</span>
                  ) : (
                    <span className="font-semibold text-gray-800">{shipping} ريال</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-semibold text-gray-800">{vat} ريال</span>
                </div>

                {shipping > 0 && (
                  <div
                    className="flex items-center gap-2 text-xs p-2.5 rounded-lg"
                    style={{ background: 'rgba(31,181,201,0.07)', color: '#0f3460' }}
                  >
                    <Tag className="w-3.5 h-3.5 text-[#1FB5C9]" />
                    أضف {(200 - totalPrice).toFixed(0)} ريال للحصول على شحن مجاني
                  </div>
                )}

                <div
                  className="flex justify-between pt-3 border-t border-gray-100"
                >
                  <span className="font-black text-[#0f3460] text-base">الإجمالي</span>
                  <span className="font-black text-[#1FB5C9] text-base">{grandTotal} ريال</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#0f3460,#1FB5C9)',
                  boxShadow: '0 4px 16px rgba(31,181,201,0.35)',
                }}
              >
                إتمام الطلب ←
              </button>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-3 mt-4 opacity-50">
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