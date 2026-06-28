import { useState, useEffect, useCallback } from 'react';
import { Boxes, Search, AlertTriangle, Loader2, Edit2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { medicinesApi } from '../../api/medicines';
import { toast } from 'sonner';

export default function PharmacistInventoryPage() {
  const [medicines, setMedicines]   = useState([]);
  const [total,     setTotal]       = useState(0);
  const [page,      setPage]        = useState(1);
  const [search,    setSearch]      = useState('');
  const [filter,    setFilter]      = useState('all');
  const [loading,   setLoading]     = useState(true);
  const [editing,   setEditing]     = useState(null);
  const [editVal,   setEditVal]     = useState('');
  const [saving,    setSaving]      = useState(false);
  const PER = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER, search: search || undefined };
      if (filter === 'low')  { params.lowStock = true; }
      if (filter === 'out')  { params.stock = 0; }
      const data = await medicinesApi.getAll(params);
      let meds = data.medicines || data.data || [];
      if (filter === 'low') meds = meds.filter(m => (m.stock ?? 0) <= (m.lowStockThreshold ?? 10) && m.stock > 0);
      if (filter === 'out') meds = meds.filter(m => (m.stock ?? 0) === 0);
      setMedicines(meds);
      setTotal(data.pagination?.total || data.total || meds.length);
    } catch { toast.error('فشل تحميل المخزون'); }
    finally { setLoading(false); }
  }, [page, search, filter]);

  useEffect(() => { setPage(1); }, [search, filter]);
  useEffect(() => { load(); }, [load]);

  const startEdit = (med) => { setEditing(med._id); setEditVal(String(med.stock ?? 0)); };
  const cancelEdit = () => { setEditing(null); setEditVal(''); };

  const saveStock = async (med) => {
    setSaving(true);
    try {
      await medicinesApi.updateStock(med._id, Number(editVal), 'set');
      toast.success('تم تحديث المخزون');
      setMedicines(prev => prev.map(m => m._id === med._id ? { ...m, stock: Number(editVal) } : m));
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التحديث');
    } finally { setSaving(false); }
  };

  const pages = Math.ceil(total / PER);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Boxes className="w-6 h-6 text-emerald-600" /> المخزون
        </h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="flex gap-1">
            {[['all','الكل'],['low','منخفض'],['out','نفذ']].map(([k,l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter===k?'bg-emerald-600 text-white':'text-gray-500 hover:bg-gray-100'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن دواء..."
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Boxes className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>لا توجد أدوية</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['الدواء','الشكل','السعر','المخزون','الإجراء'].map(h=>(
                  <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {medicines.map(med => (
                  <tr key={med._id} className={`hover:bg-gray-50/50 ${(med.stock??0)===0?'bg-red-50/20':''}`}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-800 max-w-xs truncate">{med.name}</p>
                      <p className="text-xs text-gray-400">{med.manufacturer || '—'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{med.dosageForm || '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">
                      {(med.finalPrice ?? med.price ?? 0).toFixed(2)} ر.س
                    </td>
                    <td className="px-5 py-3.5">
                      {editing === med._id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" min="0" value={editVal} onChange={e => setEditVal(e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg border border-emerald-400 text-sm text-center outline-none"
                            autoFocus onKeyDown={e => { if(e.key==='Enter') saveStock(med); if(e.key==='Escape') cancelEdit(); }} />
                          <button onClick={() => saveStock(med)} disabled={saving}
                            className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50">
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          </button>
                          <button onClick={cancelEdit} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-sm font-bold ${(med.stock??0)===0?'text-red-500':(med.stock??0)<=(med.lowStockThreshold??10)?'text-amber-500':'text-gray-700'}`}>
                          {med.stock ?? 0}
                          {(med.stock??0) === 0 && <span className="mr-1 text-xs bg-red-100 text-red-500 px-1.5 rounded-full">نفذ</span>}
                          {(med.stock??0) > 0 && (med.stock??0) <= (med.lowStockThreshold??10) && (
                            <AlertTriangle className="inline w-3 h-3 mr-1 text-amber-400" />
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editing !== med._id && (
                        <button onClick={() => startEdit(med)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold">
                          <Edit2 className="w-3 h-3" /> تعديل
                        </button>
                      )}
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
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page<=1} className="p-1.5 rounded-lg border bg-white disabled:opacity-40"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page>=pages} className="p-1.5 rounded-lg border bg-white disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
