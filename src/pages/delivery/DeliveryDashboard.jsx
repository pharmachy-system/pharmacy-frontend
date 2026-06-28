import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, MapPin, Loader2, Truck, ToggleLeft, ToggleRight } from 'lucide-react';
import { deliveryApi } from '../../api/delivery';
import { toast } from 'sonner';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm ${color}`}>
      <Icon className="w-5 h-5 text-gray-400 mb-3" />
      <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [online,     setOnline]     = useState(false);
  const [toggling,   setToggling]   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await deliveryApi.getMyDeliveries({ limit: 20 });
        setDeliveries(data.orders || data.data || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleStatus = async () => {
    setToggling(true);
    try {
      const newStatus = online ? 'offline' : 'online';
      await deliveryApi.updateStatus(newStatus);
      setOnline(!online);
      toast.success(online ? 'أصبحت غير متصل' : 'أصبحت متصلاً');
    } catch {
      toast.error('فشل تحديث الحالة');
    } finally { setToggling(false); }
  };

  const active    = deliveries.filter(d => !['delivered','cancelled'].includes(d.status));
  const completed = deliveries.filter(d => d.status === 'delivered');

  const fmt = (iso) => new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });

  const STATUS_AR = {
    pending: 'معلق', confirmed: 'مؤكد', processing: 'جاري التجهيز',
    shipped: 'في الطريق', delivered: 'تم التوصيل', cancelled: 'ملغي',
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header + status toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">لوحة التوصيل</h1>
            <p className="text-sm text-gray-500">مرحباً، تتبع توصيلاتك من هنا</p>
          </div>
          <button onClick={toggleStatus} disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              online ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}>
            {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : online ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {online ? 'متصل' : 'غير متصل'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package}      label="إجمالي الطلبات"  value={deliveries.length} color="border-gray-100" />
          <StatCard icon={Clock}        label="نشطة"            value={active.length}     color="border-amber-100" />
          <StatCard icon={CheckCircle}  label="تم التوصيل"      value={completed.length}  color="border-emerald-100" />
          <StatCard icon={Truck}        label="متوسط اليوم"     value={completed.length}  color="border-violet-100" />
        </div>

        {/* Active deliveries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">التوصيلات النشطة</h2>
            <Link to="/delivery/orders" className="text-xs text-violet-600 hover:underline">عرض الكل</Link>
          </div>
          {active.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">لا توجد توصيلات نشطة حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {active.slice(0, 5).map(d => (
                <div key={d._id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">#{d._id.slice(-6).toUpperCase()}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {d.deliveryAddress?.city || d.deliveryAddress?.street || 'عنوان التوصيل'}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-600">{fmt(d.createdAt)}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">
                      {STATUS_AR[d.status] || d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
