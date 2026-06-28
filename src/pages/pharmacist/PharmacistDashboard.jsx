import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardList, ShoppingBag, AlertTriangle, CheckCircle,
  Clock, Loader2, Package, TrendingUp, Sparkles, ArrowLeft,
} from 'lucide-react';
import API from '../../api/axios';
import { prescriptionsApi } from '../../api/prescriptions';
import { medicinesApi } from '../../api/medicines';

const STAT_CARDS = (stats, pending) => [
  { label: 'وصفات معلّقة',  value: stats?.pendingScripts, icon: ClipboardList, gradient: 'from-amber-400 to-orange-500',   to: '/pharmacist/prescriptions' },
  { label: 'إجمالي الطلبات', value: stats?.totalOrders,    icon: ShoppingBag,   gradient: 'from-cyan-400 to-blue-600',      to: '/pharmacist/orders'        },
  { label: 'منخفض المخزون', value: stats?.lowStockCount,  icon: AlertTriangle,  gradient: 'from-red-400 to-rose-600',       to: '/pharmacist/inventory'     },
  { label: 'جاهز للصرف',    value: pending.filter(p => p.status === 'approved').length, icon: CheckCircle, gradient: 'from-emerald-400 to-teal-600', to: '/pharmacist/prescriptions' },
];

const STATUS_AR = {
  pending: { label: 'قيد الانتظار', cls: 'bg-amber-50 text-amber-700' },
  approved: { label: 'موافق عليها', cls: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'مرفوضة', cls: 'bg-red-50 text-red-600' },
  dispensed: { label: 'تم الصرف', cls: 'bg-cyan-50 text-cyan-700' },
  expired: { label: 'منتهية', cls: 'bg-gray-50 text-gray-500' },
};

export default function PharmacistDashboard() {
  const [stats,   setStats]   = useState(null);
  const [pending, setPending] = useState([]);
  const [lowStock,setLowStock]= useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [r1, r2, r4] = await Promise.allSettled([
        API.get('/admin/dashboard/stats'),
        prescriptionsApi.getAll({ status: 'pending', limit: 8 }),
        medicinesApi.getLowStock({ limit: 6 }),
      ]);
      if (r1.status === 'fulfilled') {
        const d = r1.value.data?.stats || r1.value.data || {};
        setStats({ totalOrders: d.orders?.total ?? 0, pendingScripts: d.prescriptions?.pending ?? 0, lowStockCount: d.medicines?.lowStock ?? 0 });
      }
      if (r2.status === 'fulfilled') setPending((r2.value.prescriptions || r2.value.data || []).slice(0, 8));
      if (r4.status === 'fulfilled') setLowStock((r4.value.medicines || r4.value.data || []).slice(0, 6));
      setLoading(false);
    };
    load();
  }, []);

  const fmt = iso => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/60 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-800">لوحة الصيدلاني</h1>
          </div>
          <p className="text-sm text-gray-500 pr-12">مراجعة الوصفات وإدارة المخزون</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS(stats, pending).map((card, i) => {
            const Icon = card.icon;
            const inner = (
              <motion.div key={card.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
                <div className="p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black text-gray-800">{card.value ?? '—'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                </div>
              </motion.div>
            );
            return card.to ? <Link key={card.label} to={card.to}>{inner}</Link> : inner;
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pending prescriptions */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-gray-800 text-sm">وصفات تنتظر المراجعة</h2>
              </div>
              <Link to="/pharmacist/prescriptions" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                عرض الكل →
              </Link>
            </div>
            {pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <ClipboardList className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">لا توجد وصفات معلّقة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pending.map(rx => {
                  const st = STATUS_AR[rx.status] || { label: rx.status, cls: 'bg-gray-50 text-gray-500' };
                  return (
                    <div key={rx._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{rx.user?.name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-400">{fmt(rx.createdAt)}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Low stock */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h2 className="font-bold text-gray-800 text-sm">تنبيهات المخزون</h2>
              </div>
              <Link to="/pharmacist/inventory" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                إدارة →
              </Link>
            </div>
            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Package className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">المخزون بمستوى جيد</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {lowStock.map(med => {
                  const stock = med.stock ?? 0;
                  const pct   = Math.min(100, (stock / (med.lowStockThreshold ?? 10)) * 100);
                  const red   = stock === 0;
                  return (
                    <div key={med._id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${red ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
                        <Package className={`w-4 h-4 ${red ? 'text-red-400' : 'text-amber-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{med.name}</p>
                        <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${red ? 'bg-red-400' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${red ? 'text-red-500' : 'text-amber-500'}`}>{stock}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
