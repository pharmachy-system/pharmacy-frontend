import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Trash2, Edit2, Loader2, X, Check, Search, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { articlesApi } from '../../api/articles';
import { toast } from 'sonner';

const EMPTY = { title: '', titleAr: '', content: '', excerpt: '', category: '', isPublished: false };
const CATEGORIES = ['الأدوية','الصحة العامة','التغذية','اللياقة','الأمراض المزمنة','أخرى'];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await articlesApi.getAll({ limit: 50 });
      setArticles(data.articles || data.data || []);
    } catch { toast.error('فشل تحميل المقالات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (a) => { setForm(a); setModal('edit'); };

  const save = async () => {
    if (!form.title && !form.titleAr) { toast.error('العنوان مطلوب'); return; }
    setSaving(true);
    try {
      if (modal === 'add') { await articlesApi.create(form); toast.success('تم نشر المقال'); }
      else                 { await articlesApi.update(form._id, form); toast.success('تم التحديث'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const destroy = async (id) => {
    setDeleting(id);
    try { await articlesApi.delete(id); toast.success('تم حذف المقال'); load(); }
    catch { toast.error('فشل الحذف'); }
    finally { setDeleting(null); }
  };

  const filtered = search
    ? articles.filter(a => (a.title||'').toLowerCase().includes(search.toLowerCase()) || (a.titleAr||'').includes(search))
    : articles;

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ar-SA') : '—';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
              <span>/</span><span className="text-gray-600 font-medium">المقالات</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-600" /> المقالات الصحية
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> مقال جديد
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="relative max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالعنوان..."
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد مقالات</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['العنوان','الفئة','الحالة','التاريخ',''].map(h=>(
                  <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => (
                  <tr key={a._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {a.image
                          ? <img src={a.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          : <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center"><BookOpen className="w-4 h-4 text-cyan-400" /></div>
                        }
                        <div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{a.titleAr || a.title}</p>
                          {a.titleAr && a.title && <p className="text-xs text-gray-400 line-clamp-1">{a.title}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{a.category || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.isPublished ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        {a.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(a.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/articles/${a.slug || a._id}`} target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50">
                          <Globe className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => destroy(a._id)} disabled={deleting===a._id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50">
                          {deleting===a._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
                <h3 className="font-bold text-gray-800">{modal === 'add' ? 'مقال جديد' : 'تعديل المقال'}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[['العنوان بالعربية','titleAr'],['العنوان بالإنجليزية','title']].map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                      <input value={form[key]||''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الملخص</label>
                  <textarea value={form.excerpt||''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المحتوى (HTML مدعوم)</label>
                  <textarea value={form.content||''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={8} placeholder="<p>اكتب محتوى المقال هنا...</p>"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500 resize-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">الفئة</label>
                  <select value={form.category||''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500">
                    <option value="">-- اختر الفئة --</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished||false} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="accent-cyan-600" />
                  <span className="text-sm text-gray-700">نشر المقال فوراً</span>
                </label>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50">إلغاء</button>
                <button onClick={save} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {modal === 'add' ? 'نشر المقال' : 'حفظ'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
