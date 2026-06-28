import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Plus, Trash2, Edit2, Loader2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi } from '../../api/categories';
import { toast } from 'sonner';

const EMPTY = { name: { ar: '', en: '' }, description: { ar: '', en: '' }, isActive: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data.categories || data.data || []);
    } catch { toast.error('فشل تحميل الفئات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (c) => { setForm({ ...c, name: c.name || { ar: '', en: '' }, description: c.description || { ar: '', en: '' } }); setModal('edit'); };

  const set = (path, val) => setForm(f => {
    const parts = path.split('.');
    const copy = { ...f };
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) { cur[parts[i]] = { ...cur[parts[i]] }; cur = cur[parts[i]]; }
    cur[parts[parts.length - 1]] = val;
    return copy;
  });

  const save = async () => {
    setSaving(true);
    try {
      if (modal === 'add') { await categoriesApi.create(form); toast.success('تم إنشاء الفئة'); }
      else { await categoriesApi.update(form._id, form); toast.success('تم التحديث'); }
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const destroy = async (id) => {
    setDeleting(id);
    try { await categoriesApi.delete(id); toast.success('تم الحذف'); load(); }
    catch { toast.error('فشل الحذف'); }
    finally { setDeleting(null); }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
              <span>/</span><span className="text-gray-600 font-medium">الفئات</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-600" /> الفئات
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> إضافة فئة
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد فئات</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['الفئة (عربي)','الفئة (إنجليزي)','الحالة',''].map(h=>(
                  <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.image && <img src={c.image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                        <p className="text-sm font-medium text-gray-800">{c.name?.ar || c.name || '—'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{c.name?.en || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.isActive !== false ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-400'}`}>
                        {c.isActive !== false ? 'نشطة' : 'معطلة'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => destroy(c._id)} disabled={deleting===c._id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50">
                          {deleting===c._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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

      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(null)}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{modal === 'add' ? 'إضافة فئة' : 'تعديل الفئة'}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="p-5 space-y-3">
                {[['الاسم بالعربية','name.ar'],['الاسم بالإنجليزية','name.en'],['الوصف بالعربية','description.ar'],['الوصف بالإنجليزية','description.en']].map(([label, path]) => (
                  <div key={path}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input value={path.split('.').reduce((o,k) => o?.[k] ?? '', form) || ''}
                      onChange={e => set(path, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive !== false} onChange={e => set('isActive', e.target.checked)} className="accent-cyan-600" />
                  <span className="text-sm text-gray-700">فئة نشطة</span>
                </label>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">إلغاء</button>
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
