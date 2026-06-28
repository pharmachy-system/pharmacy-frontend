import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, X, Check, Loader2, Eye, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { prescriptionsApi } from '../../api/prescriptions';
import { toast } from 'sonner';

const STATUS_TABS = [
  { key: '', label: 'الكل' },
  { key: 'pending', label: 'قيد الانتظار' },
  { key: 'approved', label: 'موافق' },
  { key: 'rejected', label: 'مرفوض' },
  { key: 'dispensed', label: 'تم الصرف' },
];

const STATUS_STYLE = {
  pending:   'bg-amber-100 text-amber-600',
  approved:  'bg-emerald-100 text-emerald-600',
  rejected:  'bg-red-100 text-red-500',
  dispensed: 'bg-cyan-100 text-cyan-600',
  expired:   'bg-gray-100 text-gray-500',
};

const STATUS_AR = {
  pending: 'قيد الانتظار', approved: 'موافق', rejected: 'مرفوض',
  dispensed: 'تم الصرف', expired: 'منتهية',
};

export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [status,        setStatus]        = useState('');
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(true);
  const [selected,      setSelected]      = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes,         setNotes]         = useState('');
  const PER = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await prescriptionsApi.getAll({
        status: status || undefined,
        search: search || undefined,
        page, limit: PER,
      });
      setPrescriptions(data.prescriptions || data.data || []);
      setTotal(data.total || data.pagination?.total || 0);
    } catch {
      toast.error('فشل تحميل الوصفات');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => { setPage(1); }, [status, search]);
  useEffect(() => { load(); }, [load]);

  const act = async (action) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const payload = { status: action, notes };
      if (action === 'approved') payload.status = 'approved';
      if (action === 'rejected') payload.status = 'rejected';
      if (action === 'dispensed') payload.status = 'dispensed';
      await prescriptionsApi.updateStatus(selected._id, payload);
      toast.success('تم تحديث الوصفة');
      setSelected(null);
      setNotes('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل التحديث');
    } finally {
      setActionLoading(false);
    }
  };

  const pages = Math.ceil(total / PER);
  const fmt = (iso) => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-emerald-600" /> الوصفات الطبية
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 flex-wrap">
            {STATUS_TABS.map(t => (
              <button key={t.key} onClick={() => setStatus(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  status === t.key ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}>{t.label}</button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث باسم المريض…"
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>لا توجد وصفات</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['المريض', 'التاريخ', 'النوع', 'الحالة', 'إجراء'].map(h => (
                    <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {prescriptions.map(rx => (
                  <tr key={rx._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{rx.user?.name || 'مستخدم'}</p>
                      <p className="text-xs text-gray-400">{rx.user?.phone || rx.user?.email || '—'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(rx.createdAt)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{rx.type || 'صورة'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[rx.status] || 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_AR[rx.status] || rx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setSelected(rx); setNotes(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-semibold transition-colors">
                        <Eye className="w-3 h-3" /> مراجعة
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
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">مراجعة الوصفة</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">المريض:</span> <span className="font-medium text-gray-800">{selected.user?.name}</span></div>
                  <div><span className="text-gray-500">التاريخ:</span> <span className="font-medium">{fmt(selected.createdAt)}</span></div>
                  <div><span className="text-gray-500">الحالة:</span>
                    <span className={`mr-1 text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[selected.status]}`}>
                      {STATUS_AR[selected.status]}
                    </span>
                  </div>
                </div>

                {/* Images */}
                {(selected.images?.length > 0) && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">صور الوصفة</p>
                    <div className="flex gap-2 flex-wrap">
                      {selected.images.map((img, i) => (
                        <a key={i} href={img?.url || img} target="_blank" rel="noreferrer"
                          className="w-24 h-24 rounded-xl border-2 border-gray-200 overflow-hidden block hover:border-emerald-400">
                          <img src={img?.url || img} alt="prescription" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {selected.notes && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">ملاحظات المريض</p>
                    <p className="text-sm text-gray-700">{selected.notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ملاحظاتك (اختياري)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="ملاحظات الصيدلاني..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-400 resize-none" />
                </div>

                {selected.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => act('approved')} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50">
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      موافقة
                    </button>
                    <button onClick={() => act('rejected')} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 font-semibold text-sm disabled:opacity-50">
                      <X className="w-4 h-4" /> رفض
                    </button>
                  </div>
                )}
                {selected.status === 'approved' && (
                  <button onClick={() => act('dispensed')} disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm disabled:opacity-50">
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    تأكيد الصرف
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
