import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ShoppingBag, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import API from '../../api/axios';
import { prescriptionsApi } from '../../api/prescriptions';
import { medicinesApi } from '../../api/medicines';

function StatCard({ icon: Icon, label, value, color, to }) {
  const inner = (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${color}`}>
      <div className={`inline-flex p-2.5 rounded-xl mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function PharmacistDashboard() {
  const [stats,      setStats]      = useState(null);
  const [pending,    setPending]    = useState([]);
  const [lowStock,   setLowStock]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [r1, r2, r3, r4] = await Promise.allSettled([
        API.get('/admin/dashboard/stats'),
        prescriptionsApi.getAll({ status: 'pending', limit: 8 }),
        API.get('/orders', { params: { status: 'confirmed', limit: 8 } }),
        medicinesApi.getLowStock({ limit: 6 }),
      ]);

      if (r1.status === 'fulfilled') {
        const d = r1.value.data?.stats || r1.value.data || {};
        setStats({
          totalOrders:    d.orders?.total    ?? 0,
          pendingScripts: d.prescriptions?.pending ?? 0,
          lowStockCount:  d.medicines?.lowStock ?? 0,
        });
      }
      if (r2.status === 'fulfilled') {
        setPending((r2.value.prescriptions || r2.value.data || []).slice(0, 8));
      }
      if (r4.status === 'fulfilled') {
        setLowStock((r4.value.medicines || r4.value.data || []).slice(0, 6));
      }
      setLoading(false);
    };
    load();
  }, []);

  const fmt = (iso) => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });

  const STATUS_AR = {
    pending: 'قيد الانتظار', approved: 'موافق عليها', rejected: 'مرفوضة',
    dispensed: 'تم الصرف', expired: 'منتهية',
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة الصيدلاني</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ClipboardList} label="وصفات قيد الانتظار"
            value={stats?.pendingScripts} color="border-amber-100"
            to="/pharmacist/prescriptions" />
          <StatCard icon={ShoppingBag} label="إجمالي الطلبات"
            value={stats?.totalOrders} color="border-cyan-100"
            to="/pharmacist/orders" />
          <StatCard icon={AlertTriangle} label="منخفض المخزون"
            value={stats?.lowStockCount} color="border-red-100"
            to="/pharmacist/inventory" />
          <StatCard icon={CheckCircle} label="جاهز للصرف"
            value={pending.filter(p => p.status === 'approved').length}
            color="border-emerald-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pending Prescriptions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">وصفات تنتظر المراجعة</h2>
              <Link to="/pharmacist/prescriptions" className="text-xs text-emerald-600 hover:underline">عرض الكل</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {pending.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">لا توجد وصفات معلقة</p>
                </div>
              ) : pending.map(rx => (
                <div key={rx._id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {rx.user?.name || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-400">{fmt(rx.createdAt)}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">
                    {STATUS_AR[rx.status] || rx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">تنبيهات المخزون</h2>
              <Link to="/pharmacist/inventory" className="text-xs text-emerald-600 hover:underline">عرض الكل</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {lowStock.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">المخزون بمستوى جيد</p>
                </div>
              ) : lowStock.map(med => (
                <div key={med._id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{med.name}</p>
                    <p className="text-xs text-gray-400">{med.dosageForm || '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${(med.stock ?? 0) === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                      {med.stock ?? 0} وحدة
                    </p>
                    <p className="text-xs text-gray-400">الحد: {med.lowStockThreshold ?? 10}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
