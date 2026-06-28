import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Clock, CheckCircle, XCircle, Eye, Plus, Loader2, AlertCircle } from 'lucide-react';
import { prescriptionsApi } from '../api/prescriptions';

const STATUS = {
  pending:   { label: 'قيد المراجعة', cls: 'bg-amber-50 text-amber-700 border-amber-200',    icon: Clock        },
  approved:  { label: 'موافق عليها',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle  },
  rejected:  { label: 'مرفوضة',       cls: 'bg-red-50 text-red-600 border-red-200',           icon: XCircle      },
  dispensed: { label: 'تم الصرف',     cls: 'bg-cyan-50 text-pharmacy-cyan border-cyan-200',   icon: CheckCircle  },
  expired:   { label: 'منتهية',        cls: 'bg-gray-50 text-gray-500 border-gray-200',        icon: AlertCircle  },
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await prescriptionsApi.getMyPrescriptions();
        setPrescriptions(data.prescriptions || data.data || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  const fmt = iso => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-lg shadow-pharmacy-cyan/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-pharmacy-blue">وصفاتي الطبية</h1>
              <p className="text-sm text-gray-400">{prescriptions.length} وصفة إجمالي</p>
            </div>
          </div>
          <Link to="/prescription/upload"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-sm shadow-lg shadow-pharmacy-cyan/20 hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> رفع وصفة
          </Link>
        </div>

        {/* Upload prompt card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-pharmacy-cyan/5 to-pharmacy-blue/5 border border-pharmacy-cyan/15 rounded-3xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-md shadow-pharmacy-cyan/20 flex-shrink-0">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-pharmacy-blue text-sm">ارفع وصفة طبية جديدة</p>
            <p className="text-xs text-gray-500 mt-0.5">الصيدلاني سيراجعها ويصرف الأدوية المطلوبة</p>
          </div>
          <Link to="/prescription/upload"
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-pharmacy-cyan text-white font-bold text-xs hover:opacity-90 transition-opacity">
            ارفع الآن
          </Link>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-pharmacy-cyan" />
          </div>
        ) : prescriptions.length === 0 ? (
          /* Empty state */
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm py-24 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mb-5">
              <FileText className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">لا توجد وصفات بعد</h2>
            <p className="text-sm text-gray-400 mb-8">ارفع وصفتك الطبية وسيصرفها لك صيدلانينا</p>
            <Link to="/prescription/upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white font-bold text-sm shadow-lg shadow-pharmacy-cyan/20 hover:-translate-y-0.5 transition-all">
              <Upload className="w-4 h-4" /> ارفع أول وصفة
            </Link>
          </motion.div>
        ) : (
          /* Prescriptions list */
          <div className="space-y-3">
            <AnimatePresence>
              {prescriptions.map((rx, i) => {
                const st   = STATUS[rx.status] || STATUS.pending;
                const Icon = st.icon;
                return (
                  <motion.div key={rx._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pharmacy-cyan/20 transition-all">
                    <div className="flex items-center gap-4 p-4">
                      {/* Image thumb */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {rx.images?.[0]
                          ? <img src={rx.images[0]} alt="" className="w-full h-full object-cover" />
                          : <FileText className="w-7 h-7 text-gray-200" />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-black text-pharmacy-blue">
                            وصفة #{rx._id?.slice(-6).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>
                            <Icon className="w-3 h-3" /> {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">
                          {fmt(rx.createdAt)}
                          {rx.doctor && ` · د. ${rx.doctor}`}
                        </p>
                        {rx.notes && (
                          <p className="text-xs text-gray-500 truncate">{rx.notes}</p>
                        )}
                        {rx.status === 'rejected' && rx.rejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5">{rx.rejectionReason}</p>
                        )}
                      </div>

                      <Link to={`/prescriptions/${rx._id}`}
                        className="w-9 h-9 rounded-xl bg-pharmacy-cyan/8 hover:bg-pharmacy-cyan/15 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Eye className="w-4 h-4 text-pharmacy-cyan" />
                      </Link>
                    </div>

                    {/* Status bar for pending */}
                    {rx.status === 'pending' && (
                      <div className="px-4 pb-3">
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-pharmacy-blue to-pharmacy-cyan rounded-full"
                            initial={{ width: '10%' }} animate={{ width: '45%' }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">جاري المراجعة...</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
