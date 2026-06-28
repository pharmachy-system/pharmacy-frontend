import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Award, Plus, Trash2, Edit2, Loader2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandsApi } from '../../api/brands';
import { toast } from 'sonner';

const EMPTY = { name: '', nameAr: '', website: '' };

export default function AdminBrandsPage() {
  const [brands,   setBrands]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await brandsApi.getAll();
      setBrands(data.brands || data.data || []);
    } catch { toast.error('فشل تحميل العلامات التجارية'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (b) => { setForm(b); setModal('edit'); };

  const save = async () => {
    setSaving(true);
    try {
      if (modal === 'add') { await brandsApi.create(form); toast.success('تم الإنشاء'); }
      else { await brandsApi.update(form._id, form); toast.success('تم التحديث'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const destroy = async (id) => {
    setDeleting(id);
    try { await brandsApi.delete(id); toast.success('تم الحذف'); load(); }
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
              <span>/</span><span className="text-gray-600 font-medium">العلامات التجارية</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-600" /> العلامات التجارية
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> إضافة علامة
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : brands.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد علامات تجارية</p>
            </div>
          ) : brands.map(b => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                {b.logo ? <img src={b.logo} alt="" className="w-full h-full object-contain" /> : <Award className="w-5 h-5 text-gray-300" />}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{b.nameAr || b.name}</p>
              {b.name && b.nameAr && <p className="text-xs text-gray-400">{b.name}</p>}
              <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => destroy(b._id)} disabled={deleting===b._id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50">
                  {deleting===b._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
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
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{modal === 'add' ? 'إضافة علامة تجارية' : 'تعديل العلامة'}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-3">
                {[['الاسم بالعربية','nameAr'],['الاسم بالإنجليزية','name'],['الموقع الإلكتروني','website']].map(([label,key]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input value={form[key]||''} onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
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
