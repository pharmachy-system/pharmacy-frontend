import { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star, Loader2, X, Check } from 'lucide-react';
import { userApi } from '../api/user';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = [
  { id: 'home',  label: 'المنزل', icon: Home      },
  { id: 'work',  label: 'العمل',  icon: Briefcase },
  { id: 'other', label: 'أخرى',   icon: MapPin    },
];

const EMPTY = { type: 'home', label: '', street: '', city: 'الرياض', district: '', phone: '', isDefault: false };

const CITIES = ['الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الطائف','بريدة','تبوك','أبها'];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getAddresses();
      setAddresses(data.addresses || data.data || []);
    } catch { toast.error('فشل تحميل العناوين'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = a => { setForm(a); setEditId(a._id); setModal(true); };

  const save = async () => {
    if (!form.street || !form.city) { toast.error('يرجى ملء الشارع والمدينة'); return; }
    setSaving(true);
    try {
      if (editId) { await userApi.updateAddress(editId, form); toast.success('تم تحديث العنوان'); }
      else        { await userApi.addAddress(form);             toast.success('تم إضافة العنوان'); }
      setModal(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const destroy = async (id) => {
    setDeleting(id);
    try { await userApi.deleteAddress(id); toast.success('تم الحذف'); load(); }
    catch { toast.error('فشل الحذف'); }
    finally { setDeleting(null); }
  };

  const setDefault = async (id) => {
    try { await userApi.setDefaultAddress(id); toast.success('تم تعيين العنوان الافتراضي'); load(); }
    catch { toast.error('فشل التعيين'); }
  };

  const TypeIcon = (type) => TYPES.find(t => t.id === type)?.icon || MapPin;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 pt-8 pb-16">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" /> عناويني
          </h1>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" /> إضافة
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-10 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-2xl border">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">لا توجد عناوين محفوظة</p>
            <button onClick={openAdd} className="mt-4 text-sm text-emerald-600 hover:underline">
              + أضف عنواناً
            </button>
          </div>
        ) : addresses.map(a => {
          const Icon = TypeIcon(a.type);
          return (
            <div key={a._id} className={`bg-white rounded-2xl border shadow-sm p-4 ${a.isDefault ? 'border-emerald-200' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.isDefault ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-4 h-4 ${a.isDefault ? 'text-emerald-600' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-800 text-sm">{a.label || TYPES.find(t=>t.id===a.type)?.label}</p>
                    {a.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-semibold">افتراضي</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{[a.street, a.district, a.city].filter(Boolean).join('، ')}</p>
                  {a.phone && <p className="text-xs text-gray-400 mt-0.5">{a.phone}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!a.isDefault && (
                    <button onClick={() => setDefault(a._id)} title="تعيين كافتراضي"
                      className="p-1.5 rounded-lg text-gray-300 hover:text-emerald-500 hover:bg-emerald-50">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-300 hover:text-cyan-500 hover:bg-cyan-50">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => destroy(a._id)} disabled={deleting===a._id}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50">
                    {deleting===a._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && (
          <button onClick={openAdd}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-emerald-300 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> إضافة عنوان جديد
          </button>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{editId ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h3>
                <button onClick={() => setModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-3">
                {/* Type picker */}
                <div className="flex gap-2">
                  {TYPES.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setForm(f => ({ ...f, type: id }))}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 text-xs font-semibold transition-colors ${
                        form.type===id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                      }`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
                {[
                  { label: 'اسم العنوان', key: 'label', placeholder: 'مثال: منزلي، عمل، إلخ' },
                  { label: 'الشارع',      key: 'street', placeholder: 'رقم المبنى والشارع' },
                  { label: 'الحي',        key: 'district', placeholder: 'اسم الحي' },
                  { label: 'رقم الجوال',  key: 'phone',  placeholder: '05xxxxxxxx' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input value={form[key]||''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">المدينة</label>
                  <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-500">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isDefault||false} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-emerald-600" />
                  <span className="text-sm text-gray-700">تعيين كعنوان افتراضي</span>
                </label>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm">إلغاء</button>
                <button onClick={save} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editId ? 'حفظ التعديلات' : 'إضافة العنوان'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
