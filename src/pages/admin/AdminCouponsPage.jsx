import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Plus, Trash2, Edit2, Loader2, Search, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { couponsApi } from '../../api/coupons';
import { toast } from 'sonner';

const EMPTY = { code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiresAt: '', isActive: true };

export default function AdminCouponsPage() {
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null); // null | 'add' | 'edit'
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await couponsApi.getAll();
      setCoupons(data.coupons || data.data || []);
    } catch { toast.error('فشل تحميل الكوبونات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (c) => { setForm({ ...c, expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '' }); setModal('edit'); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, discountValue: Number(form.discountValue), minOrderAmount: Number(form.minOrderAmount)||0,
        maxDiscount: Number(form.maxDiscount)||undefined, usageLimit: Number(form.usageLimit)||undefined };
      if (modal === 'add') {
        await couponsApi.create(payload);
        toast.success('تم إنشاء الكوبون');
      } else {
        await couponsApi.update(form._id, payload);
        toast.success('تم تحديث الكوبون');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل الحفظ');
    } finally { setSaving(false); }
  };

  const destroy = async (id) => {
    setDeleting(id);
    try {
      await couponsApi.delete(id);
      toast.success('تم الحذف');
      load();
    } catch { toast.error('فشل الحذف'); }
    finally { setDeleting(null); }
  };

  const filtered = search ? coupons.filter(c => c.code?.toLowerCase().includes(search.toLowerCase())) : coupons;
  const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('ar-SA') : '—';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
              <span>/</span><span className="text-gray-600 font-medium">الكوبونات</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Tag className="w-6 h-6 text-cyan-600" /> الكوبونات
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> إضافة كوبون
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="relative max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بكود الكوبون..."
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد كوبونات</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['الكود','نوع الخصم','القيمة','الحد الأدنى','الاستخدامات','الانتهاء','الحالة',''].map(h=>(
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3.5">
                      <code className="text-sm font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-lg">{c.code}</code>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{c.discountType === 'percentage' ? 'نسبة %' : 'مبلغ ثابت'}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} ر.س`}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{c.minOrderAmount ? `${c.minOrderAmount} ر.س` : '—'}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {c.usageCount ?? 0}{c.usageLimit ? `/${c.usageLimit}` : ''}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{fmt(c.expiresAt)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-400'}`}>
                        {c.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => destroy(c._id)} disabled={deleting === c._id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50">
                          {deleting === c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(null)}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{modal === 'add' ? 'إضافة كوبون' : 'تعديل الكوبون'}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'كود الكوبون', key: 'code', type: 'text', placeholder: 'مثال: SAVE20' },
                  { label: 'قيمة الخصم', key: 'discountValue', type: 'number', placeholder: '20' },
                  { label: 'الحد الأدنى للطلب (ر.س)', key: 'minOrderAmount', type: 'number', placeholder: '100' },
                  { label: 'الحد الأقصى للخصم (ر.س)', key: 'maxDiscount', type: 'number', placeholder: '50 (اختياري)' },
                  { label: 'الحد الأقصى للاستخدام', key: 'usageLimit', type: 'number', placeholder: '100 (اختياري)' },
                  { label: 'تاريخ الانتهاء', key: 'expiresAt', type: 'date' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">نوع الخصم</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500">
                    <option value="percentage">نسبة مئوية %</option>
                    <option value="fixed">مبلغ ثابت ر.س</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="accent-cyan-600" />
                  <span className="text-sm text-gray-700">كوبون نشط</span>
                </label>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                  إلغاء
                </button>
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
