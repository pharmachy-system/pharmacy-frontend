import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, MapPin, Loader2, Truck, ToggleLeft, ToggleRight, Sparkles, Navigation } from 'lucide-react';
import { deliveryApi } from '../../api/delivery';
import { toast } from 'sonner';

const STATUS_CFG = {
  pending:    { label: 'معلّق',         cls: 'bg-gray-100 text-gray-600'    },
  confirmed:  { label: 'مؤكّد',         cls: 'bg-cyan-50 text-cyan-700'     },
  processing: { label: 'جاري التجهيز', cls: 'bg-amber-50 text-amber-700'   },
  shipped:    { label: 'في الطريق',    cls: 'bg-purple-50 text-purple-700'  },
  delivered:  { label: 'تم التوصيل',  cls: 'bg-emerald-50 text-emerald-700' },
  cancelled:  { label: 'ملغي',         cls: 'bg-red-50 text-red-600'        },
};

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [online,     setOnline]     = useState(false);
  const [toggling,   setToggling]   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await deliveryApi.getMyDeliveries({ limit: 20 });
        setDeliveries(data.orders || data.data || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleStatus = async () => {
    setToggling(true);
    try {
      await deliveryApi.updateStatus(online ? 'offline' : 'online');
      setOnline(p => !p);
      toast.success(online ? 'أصبحت غير متصل' : 'أصبحت متصلاً ومستعداً للاستلام');
    } catch { toast.error('فشل تحديث الحالة'); }
    finally { setToggling(false); }
  };

  const active    = deliveries.filter(d => !['delivered','cancelled'].includes(d.status));
  const completed = deliveries.filter(d => d.status === 'delivered');
  const fmt       = iso => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
    </div>
  );

  const STATS = [
    { icon: Package,     label: 'إجمالي الطلبات', value: deliveries.length, g: 'from-cyan-400 to-blue-600' },
    { icon: Clock,       label: 'نشطة',            value: active.length,     g: 'from-amber-400 to-orange-500' },
    { icon: CheckCircle, label: 'تم التوصيل',      value: completed.length,  g: 'from-emerald-400 to-teal-600' },
    { icon: Navigation,  label: 'اليوم',            value: completed.length,  g: 'from-violet-400 to-purple-600' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800">لوحة التوصيل</h1>
              <p className="text-xs text-gray-400">تتبع توصيلاتك في الوقت الفعلي</p>
            </div>
          </div>

          {/* Online toggle */}
          <button onClick={toggleStatus} disabled={toggling}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
              online
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-100'
                : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}>
            {toggling
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : online ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />
            }
            <span>{online ? '🟢 متصل ونشط' : '⚪ غير متصل'}</span>
          </button>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${s.g}`} />
                <div className="p-5">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.g} flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-2xl font-black text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Active deliveries */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="font-bold text-gray-800 text-sm">التوصيلات النشطة</h2>
              {active.length > 0 && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{active.length}</span>
              )}
            </div>
            <Link to="/delivery/orders" className="text-xs font-semibold text-violet-600 hover:text-violet-700">عرض الكل →</Link>
          </div>

          {active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Package className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm">لا توجد توصيلات نشطة</p>
              <p className="text-xs text-gray-300 mt-1">ستظهر الطلبات الجديدة هنا تلقائياً</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {active.slice(0, 6).map(d => {
                const st = STATUS_CFG[d.status] || STATUS_CFG.pending;
                return (
                  <div key={d._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">#{d._id.slice(-6).toUpperCase()}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{d.shippingAddress?.city || d.shippingAddress?.street || 'العنوان غير محدد'}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400 mb-1">{fmt(d.createdAt)}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
