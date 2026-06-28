import { useState, useEffect, useCallback } from 'react';
import { Package, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, Plus, Loader2, X, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { returnsApi } from '../api/returns';
import { getMyOrders } from '../api/orders';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CFG = {
  pending:   { icon: Clock,        color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', label: 'قيد المراجعة' },
  approved:  { icon: CheckCircle,  color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',label: 'موافق'         },
  rejected:  { icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',   label: 'مرفوض'         },
  completed: { icon: CheckCircle,  color: 'text-cyan-600',   bg: 'bg-cyan-50',   border: 'border-cyan-200',  label: 'مكتمل'         },
};

const TABS = ['الكل', 'قيد المراجعة', 'موافق', 'مرفوض', 'مكتمل'];
const REASONS = ['المنتج تالف','منتج خاطئ','لم يطابق الوصف','انتهاء الصلاحية','سبب آخر'];

export default function ReturnsPage() {
  const [returns,  setReturns]  = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('الكل');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ orderId: '', reason: '', description: '' });
  const [saving,   setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.allSettled([returnsApi.getMy(), getMyOrders()]);
      if (r1.status === 'fulfilled') setReturns(r1.value.returns || r1.value.data || []);
      if (r2.status === 'fulfilled') setOrders(r2.value.orders || []);
    } catch { toast.error('فشل تحميل المرتجعات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const STATUS_LABEL_MAP = { pending: 'قيد المراجعة', approved: 'موافق', rejected: 'مرفوض', completed: 'مكتمل' };
  const filtered = returns.filter(r => tab === 'الكل' || STATUS_LABEL_MAP[r.status] === tab);

  const submit = async () => {
    if (!form.orderId || !form.reason) { toast.error('يرجى اختيار الطلب والسبب'); return; }
    setSaving(true);
    try {
      await returnsApi.create(form);
      toast.success('تم تقديم طلب الاسترجاع');
      setModal(false);
      setForm({ orderId: '', reason: '', description: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل تقديم الطلب'); }
    finally { setSaving(false); }
  };

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 pt-8 pb-16">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> المرتجعات
          </h1>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" /> طلب استرجاع
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-10 space-y-4">
        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                tab === t ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-2xl border">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 text-gray-400">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">لا توجد مرتجعات</p>
            <button onClick={() => setModal(true)}
              className="mt-4 text-sm text-orange-500 hover:underline">طلب استرجاع +</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => {
              const cfg = STATUS_CFG[r.status] || STATUS_CFG.pending;
              const Icon = cfg.icon;
              return (
                <div key={r._id} className={`bg-white rounded-2xl border ${cfg.border} shadow-sm p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-800">طلب رقم #{r._id?.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fmt(r.createdAt)}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    {r.reason && <p>السبب: <strong className="text-gray-800">{r.reason}</strong></p>}
                    {r.description && <p className="text-gray-500 text-xs">{r.description}</p>}
                    {r.refundAmount && <p>مبلغ الاسترداد: <strong className="text-emerald-600">{r.refundAmount} ر.س</strong></p>}
                    {r.adminNote && (
                      <div className="bg-gray-50 rounded-lg p-2 mt-2 text-xs text-gray-600">
                        <strong>ملاحظة الإدارة:</strong> {r.adminNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New return modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">طلب استرجاع منتج</h3>
                <button onClick={() => setModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">اختر الطلب</label>
                  <select value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500">
                    <option value="">-- اختر طلباً --</option>
                    {orders.filter(o => o.status === 'delivered').map(o => (
                      <option key={o._id} value={o._id}>
                        #{o._id.slice(-6).toUpperCase()} — {Number(o.total||0).toFixed(0)} ر.س
                      </option>
                    ))}
                  </select>
                  {orders.filter(o => o.status === 'delivered').length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">يمكن استرجاع الطلبات المُسلَّمة فقط</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">سبب الاسترجاع</label>
                  <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500">
                    <option value="">-- اختر السبب --</option>
                    {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">تفاصيل إضافية (اختياري)</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="وصف المشكلة بالتفصيل..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 resize-none" />
                </div>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50">إلغاء</button>
                <button onClick={submit} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  تقديم الطلب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
