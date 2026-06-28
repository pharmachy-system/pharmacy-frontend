import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, CheckCircle, Truck, Clock, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { trackOrder } from '../api/orders';

const STEPS = [
  { key: 'pending',    title: 'تم استلام الطلب',  desc: 'جاري مراجعة طلبك',            icon: CheckCircle, color: 'from-blue-400 to-blue-600'   },
  { key: 'confirmed',  title: 'تم تأكيد الطلب',   desc: 'طلبك مؤكد لدى الصيدلية',      icon: CheckCircle, color: 'from-cyan-400 to-cyan-600'    },
  { key: 'processing', title: 'جاري التحضير',      desc: 'الصيدلاني يجهّز طلبك الآن',   icon: Package,     color: 'from-amber-400 to-amber-600'  },
  { key: 'shipped',    title: 'في الطريق',         desc: 'المندوب في طريقه إليك',        icon: Truck,       color: 'from-purple-400 to-purple-600' },
  { key: 'delivered',  title: 'تم التسليم',        desc: 'وصل طلبك بنجاح',               icon: CheckCircle, color: 'from-emerald-400 to-emerald-600' },
];
const STEP_KEYS = STEPS.map(s => s.key);

export default function OrderTrackingPage() {
  const { id }       = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await trackOrder(id);
        setTracking(data.tracking || data.data?.tracking || null);
      } catch (err) { setError(err.response?.data?.message || 'فشل تحميل التتبع'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-pharmacy-cyan" />
    </div>
  );

  if (error || !tracking) return (
    <div dir="rtl" className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-gray-600 font-medium">{error || 'بيانات التتبع غير متاحة'}</p>
      <Link to={`/orders/${id}`}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-sm">
        تفاصيل الطلب
      </Link>
    </div>
  );

  const currentIdx   = STEP_KEYS.indexOf(tracking.status);
  const isCancelled  = tracking.status === 'cancelled';
  const currentStep  = STEPS[currentIdx];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/orders/${id}`}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm">
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-pharmacy-blue">تتبع الطلب</h1>
            <p className="text-xs text-gray-400 font-mono">#{(tracking.orderNumber || id || '').slice(-10).toUpperCase()}</p>
          </div>
        </div>

        {/* Status banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 mb-6 text-white relative overflow-hidden ${
            isCancelled
              ? 'bg-gradient-to-br from-red-500 to-red-700'
              : `bg-gradient-to-br ${currentStep?.color || 'from-pharmacy-cyan to-pharmacy-blue'}`
          }`}>
          {/* Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs mb-1">الحالة الحالية</p>
              <p className="text-2xl font-black leading-tight">
                {isCancelled ? 'الطلب ملغي' : currentStep?.title || tracking.status}
              </p>
              <p className="text-white/80 text-sm mt-1">
                {isCancelled ? 'عذراً، تم إلغاء هذا الطلب' : currentStep?.desc}
              </p>
              {tracking.estimatedArrival && !isCancelled && (
                <p className="text-white/70 text-xs mt-2">
                  الوصول المتوقع: {new Date(tracking.estimatedArrival).toLocaleString('ar-SA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </p>
              )}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
              {isCancelled ? <AlertCircle className="w-8 h-8 text-white" /> : <Truck className="w-8 h-8 text-white" />}
            </div>
          </div>

          {/* Driver info */}
          {tracking.driver && !isCancelled && (
            <div className="mt-4 bg-white/12 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">المندوب</p>
                <p className="text-sm font-bold">{tracking.driver.name || '—'}</p>
              </div>
              {tracking.driver.phone && (
                <a href={`tel:${tracking.driver.phone}`}
                  className="mr-auto text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                  اتصال
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Progress steps */}
        {!isCancelled && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="font-black text-pharmacy-blue mb-6 text-sm">مراحل الطلب</h2>
            {STEPS.map((step, i) => {
              const Icon    = step.icon;
              const isDone  = i <= currentIdx;
              const isCurr  = i === currentIdx;
              const isLast  = i === STEPS.length - 1;
              const hist    = tracking.timeline?.find(t => t.status === step.key);
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone ? `bg-gradient-to-br ${step.color} shadow-md` : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isDone ? 'text-white' : 'text-gray-300'}`} />
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-10 mt-1 rounded-full transition-colors ${isDone && !isCurr ? 'bg-pharmacy-cyan' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold ${isDone ? 'text-pharmacy-blue' : 'text-gray-300'}`}>{step.title}</p>
                      {isCurr && (
                        <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                          className="text-[10px] bg-pharmacy-cyan/10 text-pharmacy-cyan px-2 py-0.5 rounded-full font-bold border border-pharmacy-cyan/20">
                          الحالة الحالية
                        </motion.span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-400' : 'text-gray-200'}`}>{step.desc}</p>
                    {hist?.timestamp && (
                      <p className="text-[10px] text-gray-300 mt-0.5">
                        {new Date(hist.timestamp).toLocaleString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        <Link to={`/orders/${id}`}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white border border-gray-200 text-pharmacy-blue font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
          <Package className="w-4 h-4" /> تفاصيل الطلب
        </Link>
      </div>
    </div>
  );
}
