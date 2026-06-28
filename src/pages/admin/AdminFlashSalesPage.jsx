import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Plus, Trash2, Edit2, Loader2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { flashsalesApi } from '../../api/flashsales';
import { toast } from 'sonner';

const EMPTY = { title: '', titleAr: '', discountPercentage: '', startDate: '', endDate: '', isActive: false };

export default function AdminFlashSalesPage() {
  const [sales,    setSales]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await flashsalesApi.getAll();
      setSales(data.flashSales || data.data || []);
    } catch { toast.error('فشل تحميل التخفيضات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s, startDate: s.startDate?.split('T')[0]||'', endDate: s.endDate?.split('T')[0]||'' }); setModal('edit'); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, discountPercentage: Number(form.discountPercentage) };
      if (modal === 'add') { await flashsalesApi.create(payload); toast.success('تم الإنشاء'); }
      else { await flashsalesApi.update(form._id, payload); toast.success('تم التحديث'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const toggle = async (sale) => {
    setToggling(sale._id);
    try {
      await flashsalesApi.toggle(sale._id);
      toast.success(sale.isActive ? 'تم إيقاف التخفيض' : 'تم تفعيل التخفيض');
      load();
    } catch { toast.error('فشل التبديل'); }
    finally { setToggling(null); }
  };

  const destroy = async (id) => {
    try { await flashsalesApi.delete(id); toast.success('تم الحذف'); load(); }
    catch { toast.error('فشل الحذف'); }
  };

  const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('ar-SA') : '—';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
              <span>/</span><span className="text-gray-600 font-medium">التخفيضات</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-600" /> التخفيضات السريعة
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> إضافة تخفيض
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-2xl border"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : sales.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 text-gray-400">
              <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد تخفيضات</p>
            </div>
          ) : sales.map(sale => (
            <div key={sale._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${sale.isActive ? 'border-amber-200' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{sale.titleAr || sale.title}</h3>
                    {sale.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> نشط
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{sale.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>خصم: <strong className="text-amber-600">{sale.discountPercentage}%</strong></span>
                    <span>من: {fmt(sale.startDate)}</span>
                    <span>إلى: {fmt(sale.endDate)}</span>
                    <span>{sale.medicines?.length || 0} منتج</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(sale)} disabled={toggling === sale._id}
                    className={`p-1.5 rounded-lg transition-colors ${sale.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                    {toggling === sale._id ? <Loader2 className="w-4 h-4 animate-spin" /> : sale.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => openEdit(sale)} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => destroy(sale._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(null)}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{modal === 'add' ? 'إضافة تخفيض' : 'تعديل التخفيض'}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'العنوان بالعربية', key: 'titleAr' },
                  { label: 'العنوان بالإنجليزية', key: 'title' },
                  { label: 'نسبة الخصم %', key: 'discountPercentage', type: 'number' },
                  { label: 'تاريخ البداية', key: 'startDate', type: 'date' },
                  { label: 'تاريخ النهاية', key: 'endDate', type: 'date' },
                ].map(({ label, key, type = 'text' }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[key] || ''}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50">إلغاء</button>
                <button onClick={save} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {modal === 'add' ? 'إنشاء' : 'حفظ'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
