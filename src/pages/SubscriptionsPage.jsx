import { useState, useEffect } from 'react';
import { Repeat, Calendar, Package, Clock, ChevronLeft, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';

export default function SubscriptionsPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('upcoming');

  useEffect(() => {
    getMyOrders({ status: 'delivered', limit: 20 })
      .then(d => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 px-4 pt-8 pb-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <Repeat className="w-5 h-5" /> الاشتراكات والطلبات المتكررة
          </h1>
          <p className="text-purple-200 text-sm">جدول طلباتك المتكررة للأدوية الدورية</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-10 space-y-4">
        {/* Coming soon card */}
        <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-5">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 mb-1">خاصية الاشتراكات قريباً!</h2>
              <p className="text-sm text-gray-500">
                سيمكنك قريباً جدولة طلبات أدويتك المزمنة تلقائياً شهرياً أو أسبوعياً.
                حتى ذلك الحين، استخدم ميزة "إعادة الطلب" أدناه.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
          {[
            { id: 'upcoming', label: 'إعادة الطلب' },
            { id: 'history',  label: 'السجل' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t.id ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'upcoming' && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-2xl border">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">لا توجد طلبات سابقة للتكرار</p>
                <Link to="/products" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 px-1">اضغط "إعادة الطلب" على أي طلب سابق لإنشاء طلب جديد بنفس المحتوى:</p>
                {orders.slice(0, 10).map(o => (
                  <div key={o._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">طلب #{o._id?.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">{fmt(o.createdAt)} — {o.items?.length || 0} منتج</p>
                      </div>
                      <Link to={`/orders/${o._id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold">
                        <Repeat className="w-3 h-3" /> تكرار
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {tab === 'history' && (
          <Link to="/orders"
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-semibold text-gray-800">عرض كل الطلبات</p>
                <p className="text-xs text-gray-400">سجل جميع طلباتك بالتفصيل</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </Link>
        )}
      </div>
    </div>
  );
}
