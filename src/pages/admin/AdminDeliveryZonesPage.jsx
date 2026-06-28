import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, Edit2, Loader2, X, Check, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deliveryApi } from '../../api/delivery';
import { toast } from 'sonner';

const EMPTY = { name: '', nameAr: '', cities: '', baseFee: '', freeDeliveryThreshold: '', isActive: true, estimatedDays: '' };

export default function AdminDeliveryZonesPage() {
  const [zones,    setZones]    = useState([]);
  const [drivers,  setDrivers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.allSettled([
        deliveryApi.getZones(),
        deliveryApi.getDrivers(),
      ]);
      if (r1.status === 'fulfilled') setZones(r1.value.zones || r1.value.data || []);
      if (r2.status === 'fulfilled') setDrivers(r2.value.drivers || r2.value.data || []);
    } catch { toast.error('فشل تحميل البيانات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (z) => { setForm({ ...z, cities: Array.isArray(z.cities) ? z.cities.join(', ') : z.cities || '' }); setModal('edit'); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        cities: form.cities.split(',').map(c => c.trim()).filter(Boolean),
        baseFee: Number(form.baseFee),
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold) || undefined,
        estimatedDays: Number(form.estimatedDays) || undefined,
      };
      if (modal === 'add') { await deliveryApi.createZone(payload); toast.success('تم إنشاء المنطقة'); }
      else { await deliveryApi.updateZone(form._id, payload); toast.success('تم التحديث'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const destroy = async (id) => {
    setDeleting(id);
    try { await deliveryApi.deleteZone(id); toast.success('تم الحذف'); load(); }
    catch { toast.error('فشل الحذف'); }
    finally { setDeleting(null); }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
              <span>/</span><span className="text-gray-600 font-medium">مناطق التوصيل</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-cyan-600" /> مناطق التوصيل
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> إضافة منطقة
          </button>
        </div>

        {/* Available Drivers */}
        {drivers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-cyan-500" /> السائقون المتاحون ({drivers.length})</h2>
            <div className="flex flex-wrap gap-2">
              {drivers.map(d => (
                <div key={d._id} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="w-5 h-5 rounded-full bg-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-700">{d.name?.[0]}</div>
                  <span className="text-xs font-medium text-cyan-700">{d.name}</span>
                  <span className="text-[10px] text-cyan-500">{d.phone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>
          ) : zones.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border text-center py-20 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد مناطق توصيل</p>
            </div>
          ) : zones.map(z => (
            <div key={z._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${z.isActive !== false ? 'border-gray-100' : 'border-red-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{z.nameAr || z.name}</h3>
                  {z.nameAr && <p className="text-xs text-gray-400">{z.name}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(z)} className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-500 hover:bg-cyan-50"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => destroy(z._id)} disabled={deleting===z._id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50">
                    {deleting===z._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>رسوم التوصيل</span><span className="font-semibold">{z.baseFee} ر.س</span></div>
                {z.freeDeliveryThreshold && <div className="flex justify-between"><span>توصيل مجاني من</span><span className="font-semibold text-emerald-600">{z.freeDeliveryThreshold} ر.س</span></div>}
                {z.estimatedDays && <div className="flex justify-between"><span>وقت التوصيل</span><span>{z.estimatedDays} أيام</span></div>}
              </div>
              {z.cities?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">المدن</p>
                  <p className="text-xs text-gray-600">{(Array.isArray(z.cities) ? z.cities : []).join('، ')}</p>
                </div>
              )}
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
                <h3 className="font-bold text-gray-800">{modal === 'add' ? 'إضافة منطقة' : 'تعديل المنطقة'}</h3>
                <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'الاسم بالعربية', key: 'nameAr' },
                  { label: 'الاسم بالإنجليزية', key: 'name' },
                  { label: 'المدن (مفصولة بفاصلة)', key: 'cities', placeholder: 'الرياض, جدة, مكة' },
                  { label: 'رسوم التوصيل (ر.س)', key: 'baseFee', type: 'number' },
                  { label: 'توصيل مجاني من (ر.س)', key: 'freeDeliveryThreshold', type: 'number' },
                  { label: 'وقت التوصيل (أيام)', key: 'estimatedDays', type: 'number' },
                ].map(({ label, key, type = 'text', placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[key]||''} placeholder={placeholder}
                      onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive !== false} onChange={e => setForm(f => ({...f, isActive: e.target.checked}))} className="accent-cyan-600" />
                  <span className="text-sm text-gray-700">منطقة نشطة</span>
                </label>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border text-gray-600 font-semibold text-sm hover:bg-gray-50">إلغاء</button>
                <button onClick={save} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}حفظ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
