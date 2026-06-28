import { useState, useEffect, useCallback } from 'react';
import { Package, MapPin, Check, ChevronLeft, ChevronRight, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deliveryApi } from '../../api/delivery';
import { toast } from 'sonner';

const STATUS_AR = {
  pending: 'معلق', confirmed: 'مؤكد', processing: 'جاري التجهيز',
  shipped: 'في الطريق', delivered: 'تم التوصيل', cancelled: 'ملغي',
};

const STATUS_STYLE = {
  pending: 'bg-blue-100 text-blue-600', confirmed: 'bg-cyan-100 text-cyan-600',
  processing: 'bg-amber-100 text-amber-600', shipped: 'bg-purple-100 text-purple-600',
  delivered: 'bg-emerald-100 text-emerald-600', cancelled: 'bg-red-100 text-red-400',
};

export default function DeliveryOrdersPage() {
  const [orders,   setOrders]   = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [filter,   setFilter]   = useState('active');
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const PER = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER };
      if (filter === 'active') params.status = 'shipped';
      if (filter === 'done') params.status = 'delivered';
      const data = await deliveryApi.getMyDeliveries(params);
      setOrders(data.orders || data.data || []);
      setTotal(data.total || data.pagination?.total || 0);
    } catch { toast.error('فشل تحميل الطلبات'); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { setPage(1); }, [filter]);
  useEffect(() => { load(); }, [load]);

  const markDelivered = async () => {
    if (!selected) return;
    setConfirming(true);
    try {
      await deliveryApi.markDelivered(selected._id);
      toast.success('تم تحديد الطلب كمُسلَّم');
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التحديث');
    } finally { setConfirming(false); }
  };

  const pages = Math.ceil(total / PER);
  const fmt = (iso) => new Date(iso).toLocaleDateString('ar-SA', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-violet-600" /> توصيلاتي
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-xl border border-gray-100 p-1 w-fit shadow-sm">
          {[['active','نشطة'],['done','مكتملة'],['all','الكل']].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter===k?'bg-violet-600 text-white shadow-sm':'text-gray-500 hover:bg-gray-100'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>لا توجد طلبات</p>
            </div>
          ) : orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[order.status]||'bg-gray-100 text-gray-500'}`}>
                      {STATUS_AR[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{[order.deliveryAddress?.street, order.deliveryAddress?.city, order.deliveryAddress?.district].filter(Boolean).join('، ') || 'العنوان غير متوفر'}</span>
                  </div>
                  {order.user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${order.user.phone}`} className="hover:text-violet-600">{order.user.phone}</a>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{fmt(order.createdAt)}</p>
                  <p className="font-bold text-gray-800 mt-1">{order.totalAmount?.toFixed(2)} ر.س</p>
                </div>
              </div>

              {/* Items summary */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{order.items?.length || 0} منتج</p>
                <p className="text-sm text-gray-600 truncate">
                  {order.items?.map(i => i.name).join(' · ')}
                </p>
              </div>

              {order.status === 'shipped' && (
                <button onClick={() => setSelected(order)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors">
                  <Check className="w-4 h-4" /> تأكيد التسليم
                </button>
              )}
            </div>
          ))}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <span className="text-xs text-gray-500">صفحة {page} من {pages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page<=1} className="p-1.5 rounded-lg border bg-white disabled:opacity-40"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
              <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page>=pages} className="p-1.5 rounded-lg border bg-white disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تأكيد التسليم</h3>
              <p className="text-sm text-gray-500 mb-6">
                هل تأكد أنك سلمت الطلب #{selected._id.slice(-6).toUpperCase()} للعميل؟
              </p>
              <div className="flex gap-2">
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                  إلغاء
                </button>
                <button onClick={markDelivered} disabled={confirming}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm disabled:opacity-50">
                  {confirming ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'تأكيد'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
