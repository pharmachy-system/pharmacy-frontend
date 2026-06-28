import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, MapPin, User, Phone, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../api/orders';

const STEPS = ['معلومات التوصيل', 'طريقة الدفع', 'تأكيد الطلب'];

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems.length]);

  const totalPrice = getTotalPrice();
  const shipping = totalPrice >= 200 ? 0 : 25;
  const vat = +(totalPrice * 0.15).toFixed(2);
  const grandTotal = +(totalPrice + shipping + vat).toFixed(2);

  const [form, setForm] = useState({
    name: '', phone: '', city: '', district: '', street: '', notes: '',
    payMethod: 'card',
    cardNum: '', cardExp: '', cardCvv: '', cardName: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOrder = async () => {
    setOrderError('');
    setLoading(true);
    try {
      const payload = {
        items: cartItems.map(item => ({ medicine: item._id, quantity: item.quantity })),
        paymentMethod: ['card', 'mada', 'stc'].includes(form.payMethod) ? 'card' : form.payMethod,
        shippingAddress: {
          fullName: form.name,
          phone: form.phone,
          street: form.street || form.district,
          city: form.city,
        },
        notes: form.notes || undefined,
      };
      const data = await createOrder(payload);
      setOrderId(data.order?._id || data.data?.order?._id || null);
      clearCart();
      setDone(true);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'فشل تأكيد الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4" dir="rtl">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-2xl shadow-pharmacy-cyan/30"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <h2 className="text-2xl font-black text-pharmacy-blue mb-2">تم تأكيد طلبك!</h2>
          <p className="text-gray-500 text-sm">سيصلك تأكيد الطلب عبر البريد والجوال</p>
          {orderId && <p className="text-xs text-gray-400 mt-1 font-mono">#{orderId.slice(-10).toUpperCase()}</p>}
        </motion.div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/orders')}
            className="px-6 py-3 rounded-2xl text-white font-bold text-sm bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
            متابعة طلباتي
          </button>
          <button onClick={() => navigate('/products')}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-pharmacy-blue border-2 border-pharmacy-blue/30 hover:bg-pharmacy-blue hover:text-white transition-all">
            متابعة التسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                  i <= step
                    ? 'bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue text-white shadow-md shadow-pharmacy-cyan/30'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${i <= step ? 'text-pharmacy-blue' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 rounded-full transition-all duration-300 ${
                  i < step ? 'bg-gradient-to-r from-pharmacy-blue to-pharmacy-cyan' : 'bg-gray-100'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* STEP 0 - Delivery */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-900/5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-pharmacy-cyan/10 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-pharmacy-cyan" />
                    </div>
                    <h2 className="text-base font-black text-pharmacy-blue">معلومات التوصيل</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'الاسم الكامل', key: 'name', icon: User, placeholder: 'محمد أحمد' },
                      { label: 'رقم الجوال', key: 'phone', icon: Phone, placeholder: '05xxxxxxxx' },
                      { label: 'المدينة', key: 'city', icon: MapPin, placeholder: 'الرياض' },
                      { label: 'الحي', key: 'district', icon: MapPin, placeholder: 'حي النزهة' },
                    ].map(({ label, key, icon: Icon, placeholder }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
                        <div className="relative">
                          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            value={form[key]} onChange={e => set(key, e.target.value)}
                            placeholder={placeholder}
                            className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-pharmacy-cyan focus:ring-2 focus:ring-pharmacy-cyan/10 transition-all"
                            style={{ fontFamily: 'inherit' }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">الشارع والعنوان التفصيلي</label>
                      <input value={form.street} onChange={e => set('street', e.target.value)}
                        placeholder="شارع الملك فهد، مبنى 12، شقة 3"
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-pharmacy-cyan focus:ring-2 focus:ring-pharmacy-cyan/10 transition-all"
                        style={{ fontFamily: 'inherit' }} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">ملاحظات (اختياري)</label>
                      <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                        placeholder="أي تعليمات خاصة للتوصيل..."
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-pharmacy-cyan transition-all resize-none"
                        style={{ fontFamily: 'inherit' }} />
                    </div>
                  </div>

                  <button onClick={() => setStep(1)}
                    disabled={!form.name || !form.phone || !form.city}
                    className="w-full mt-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-lg shadow-pharmacy-cyan/25">
                    التالي: طريقة الدفع →
                  </button>
                </motion.div>
              )}

              {/* STEP 1 - Payment */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-900/5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-pharmacy-cyan/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-pharmacy-cyan" />
                    </div>
                    <h2 className="text-base font-black text-pharmacy-blue">طريقة الدفع</h2>
                  </div>

                  {/* Payment options */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { id: 'card', label: 'بطاقة بنكية', icon: '💳' },
                      { id: 'mada', label: 'مدى', icon: '🏦' },
                      { id: 'stc', label: 'STC Pay', icon: '📱' },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => set('payMethod', opt.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                          form.payMethod === opt.id
                            ? 'border-pharmacy-cyan bg-pharmacy-cyan/5 text-pharmacy-blue'
                            : 'border-gray-200 text-gray-500 hover:border-pharmacy-cyan/40'
                        }`}>
                        <span className="text-xl">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Card fields */}
                  {form.payMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">رقم البطاقة</label>
                        <input value={form.cardNum} onChange={e => set('cardNum', e.target.value)}
                          placeholder="1234 5678 9012 3456" maxLength={19}
                          className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-pharmacy-cyan focus:ring-2 focus:ring-pharmacy-cyan/10 transition-all"
                          style={{ fontFamily: 'inherit', direction: 'ltr', textAlign: 'left' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">تاريخ الانتهاء</label>
                          <input value={form.cardExp} onChange={e => set('cardExp', e.target.value)}
                            placeholder="MM/YY" maxLength={5}
                            className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-pharmacy-cyan transition-all"
                            style={{ fontFamily: 'inherit', direction: 'ltr', textAlign: 'left' }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">CVV</label>
                          <input value={form.cardCvv} onChange={e => set('cardCvv', e.target.value)}
                            placeholder="123" maxLength={4} type="password"
                            className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-pharmacy-cyan transition-all"
                            style={{ fontFamily: 'inherit', direction: 'ltr', textAlign: 'left' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                    <Lock className="w-3.5 h-3.5" />
                    جميع المعاملات محمية بتشفير SSL
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-pharmacy-cyan hover:text-pharmacy-cyan transition-all">
                      ← رجوع
                    </button>
                    <button onClick={() => setStep(2)}
                      className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-md shadow-pharmacy-cyan/20">
                      التالي: تأكيد الطلب →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 - Confirm */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-900/5">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-pharmacy-cyan/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-pharmacy-cyan" />
                    </div>
                    <h2 className="text-base font-black text-pharmacy-blue">مراجعة الطلب</h2>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {cartItems.map(item => (
                      <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f7f9fc' }}>
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg,#e0f7fa,#e3f2fd)' }}>
                          {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-pharmacy-blue truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                        <p className="font-black text-sm text-pharmacy-cyan flex-shrink-0">{+(item.price * item.quantity).toFixed(2)} ريال</p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery summary */}
                  <div className="p-3 rounded-xl mb-5 text-sm bg-pharmacy-cyan/5 border border-pharmacy-cyan/10">
                    <p className="font-bold text-pharmacy-blue mb-1">عنوان التوصيل</p>
                    <p className="text-gray-600">{form.name} — {form.phone}</p>
                    <p className="text-gray-500">{form.city}، {form.district}، {form.street}</p>
                  </div>

                  {orderError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                      {orderError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-pharmacy-cyan hover:text-pharmacy-cyan transition-all">
                      ← رجوع
                    </button>
                    <button onClick={handleOrder} disabled={loading}
                      className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-70 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-md shadow-pharmacy-cyan/20">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          جاري التأكيد...
                        </span>
                      ) : 'تأكيد الطلب ✓'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 sticky top-24 shadow-lg shadow-blue-900/5">
              <h3 className="font-black text-pharmacy-blue text-sm mb-4">ملخص الطلب</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{getTotalItems()} منتج</span>
                  <span className="font-semibold">{totalPrice.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : ''}`}>
                    {shipping === 0 ? 'مجاني' : `${shipping} ريال`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ضريبة 15%</span>
                  <span className="font-semibold">{vat} ريال</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-black text-pharmacy-blue">الإجمالي</span>
                  <span className="font-black text-pharmacy-cyan">{grandTotal} ريال</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}