import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronLeft, Clock, CheckCircle, XCircle, Truck, RefreshCw, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getMyOrders } from '../api/orders';

const STATUS_MAP = {
  pending:    { label: 'قيد الانتظار',  cls: 'bg-blue-50 text-blue-700 border-blue-200',      icon: Clock,         dot: 'bg-blue-400'    },
  confirmed:  { label: 'مؤكد',          cls: 'bg-cyan-50 text-cyan-700 border-cyan-200',       icon: CheckCircle,   dot: 'bg-cyan-400'    },
  processing: { label: 'جاري التحضير',  cls: 'bg-amber-50 text-amber-700 border-amber-200',    icon: Package,       dot: 'bg-amber-400'   },
  shipped:    { label: 'في الطريق',     cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck,         dot: 'bg-purple-400'  },
  delivered:  { label: 'تم التسليم',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-400' },
  cancelled:  { label: 'ملغي',          cls: 'bg-red-50 text-red-700 border-red-200',          icon: XCircle,       dot: 'bg-red-400'     },
  refunded:   { label: 'تم الاسترداد',  cls: 'bg-gray-50 text-gray-600 border-gray-200',       icon: RefreshCw,     dot: 'bg-gray-300'    },
};

const FILTERS = ['الكل', 'معلّق', 'في الطريق', 'مكتمل', 'ملغي'];

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('الكل');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders || data.data?.orders || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = orders.filter(o => {
    if (filter === 'الكل')    return true;
    if (filter === 'معلّق')    return ['pending','confirmed','processing'].includes(o.status);
    if (filter === 'في الطريق') return o.status === 'shipped';
    if (filter === 'مكتمل')   return o.status === 'delivered';
    if (filter === 'ملغي')    return ['cancelled','refunded'].includes(o.status);
    return true;
  });

  const fmt = iso => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-pharmacy-cyan" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/account" className="hover:text-pharmacy-cyan">حسابي</Link>
            <span>/</span><span className="text-gray-600">طلباتي</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-lg shadow-pharmacy-cyan/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-pharmacy-blue">طلباتي</h1>
              <p className="text-sm text-gray-400">{orders.length} طلب إجمالي</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-pharmacy-cyan/50'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm py-24 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mb-5">
              <Package className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">لا توجد طلبات</h2>
            <p className="text-sm text-gray-400 mb-8">
              {filter === 'الكل' ? 'ابدأ التسوق وستجد طلباتك هنا' : `لا توجد طلبات بحالة "${filter}"`}
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-sm shadow-lg shadow-pharmacy-cyan/20 hover:-translate-y-0.5 transition-all">
              تصفح المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((order, i) => {
                const st  = STATUS_MAP[order.status] || STATUS_MAP.pending;
                const Icon = st.icon;
                const img  = order.items?.[0]?.medicine?.images?.[0] || order.items?.[0]?.medicine?.image || null;
                return (
                  <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pharmacy-cyan/20 transition-all">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {img
                          ? <img src={img} alt="" className="w-full h-full object-cover" />
                          : <Package className="w-8 h-8 text-gray-200" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-black text-pharmacy-blue">
                            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>
                            <Icon className="w-3 h-3" /> {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1.5">
                          {fmt(order.createdAt)} · {order.items?.length || 0} منتج
                        </p>
                        <p className="text-base font-black text-pharmacy-cyan">
                          {Number(order.total || 0).toFixed(2)} <span className="text-xs font-medium text-gray-400">ر.س</span>
                        </p>
                      </div>
                      <Link to={`/orders/${order._id}`}
                        className="w-9 h-9 rounded-xl bg-pharmacy-cyan/8 hover:bg-pharmacy-cyan/15 flex items-center justify-center flex-shrink-0 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-pharmacy-cyan" />
                      </Link>
                    </div>

                    {/* Progress bar for active orders */}
                    {['pending','confirmed','processing','shipped'].includes(order.status) && (
                      <div className="px-4 pb-3">
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${st.dot}`}
                            style={{ width: order.status === 'pending' ? '25%' : order.status === 'confirmed' ? '50%' : order.status === 'processing' ? '70%' : '90%' }} />
                        </div>
                      </div>
                    )}
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
