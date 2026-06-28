import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Search, ChevronLeft, ChevronRight, Loader2, Eye, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus } from '../../api/admin';
import { toast } from 'sonner';

const TABS = [
  { key: '', label: 'الكل' },
  { key: 'pending', label: 'معلق' },
  { key: 'confirmed', label: 'مؤكد' },
  { key: 'processing', label: 'جاري التجهيز' },
];

const STATUS_STYLE = {
  pending:    'bg-blue-100 text-blue-600',
  confirmed:  'bg-cyan-100 text-cyan-600',
  processing: 'bg-amber-100 text-amber-600',
  shipped:    'bg-purple-100 text-purple-600',
  delivered:  'bg-emerald-100 text-emerald-600',
  cancelled:  'bg-red-100 text-red-400',
};

const STATUS_AR = {
  pending: 'معلق', confirmed: 'مؤكد', processing: 'جاري التجهيز',
  shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي',
};

const NEXT = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
};

export default function PharmacistOrdersPage() {
  const [orders,   setOrders]   = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [status,   setStatus]   = useState('');
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [note,     setNote]     = useState('');
  const PER = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllOrders({ status: status || undefined, search: search || undefined, page, limit: PER });
      setOrders(data.orders || data.data || []);
      setTotal(data.total || data.pagination?.total || 0);
    } catch { toast.error('فشل تحميل الطلبات'); }
    finally { setLoading(false); }
  }, [status, search, page]);

  useEffect(() => { setPage(1); }, [status, search]);
  useEffect(() => { load(); }, [load]);

  const advance = async (newStatus) => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateOrderStatus(selected._id, newStatus, note);
      toast.success('تم تحديث حالة الطلب');
      setSelected(null);
      setNote('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التحديث');
    } finally { setSaving(false); }
  };

  const pages = Math.ceil(total / PER);
  const fmt = (iso) => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-600" /> الطلبات
        </h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 flex-wrap">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setStatus(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${status === t.key ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث برقم الطلب..."
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>لا توجد طلبات</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['رقم الطلب','العميل','التاريخ','المبلغ','الحالة','إجراء'].map(h => (
                  <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-500">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-800">{o.user?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(o.createdAt)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{o.totalAmount?.toFixed(2)} ر.س</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_AR[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setSelected(o); setNote(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-semibold">
                        <Eye className="w-3 h-3" /> عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <span className="text-xs text-gray-500">صفحة {page} من {pages}</span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1} className="p-1.5 rounded-lg border bg-white disabled:opacity-40"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page>=pages} className="p-1.5 rounded-lg border bg-white disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">تفاصيل الطلب #{selected._id.slice(-6).toUpperCase()}</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="divide-y divide-gray-50">
                  {(selected.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between py-2 text-sm">
                      <span className="text-gray-700">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>الإجمالي</span>
                  <span>{selected.totalAmount?.toFixed(2)} ر.س</span>
                </div>
                {NEXT[selected.status]?.length > 0 && (
                  <>
                    <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                      placeholder="ملاحظة (اختياري)"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-400 resize-none" />
                    <div className="flex gap-2">
                      {NEXT[selected.status].map(ns => (
                        <button key={ns} onClick={() => advance(ns)} disabled={saving}
                          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 ${
                            ns === 'cancelled' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}>
                          {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : STATUS_AR[ns]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
