import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronLeft, Clock, CheckCircle, XCircle, Truck, RefreshCw, Loader2 } from 'lucide-react';
import { getMyOrders } from '../api/orders';

const STATUS_MAP = {
  pending:    { label: 'قيد الانتظار',  color: 'bg-blue-50 text-blue-600 border-blue-200',      icon: Clock },
  confirmed:  { label: 'مؤكد',          color: 'bg-cyan-50 text-cyan-600 border-cyan-200',       icon: CheckCircle },
  processing: { label: 'جاري التحضير',  color: 'bg-amber-50 text-amber-600 border-amber-200',    icon: Package },
  shipped:    { label: 'في الطريق',     color: 'bg-purple-50 text-purple-600 border-purple-200', icon: Truck },
  delivered:  { label: 'تم التسليم',    color: 'bg-green-50 text-green-600 border-green-200',    icon: CheckCircle },
  cancelled:  { label: 'ملغي',          color: 'bg-red-50 text-red-600 border-red-200',          icon: XCircle },
  refunded:   { label: 'تم الاسترداد',  color: 'bg-gray-50 text-gray-600 border-gray-200',      icon: RefreshCw },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {s.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders || data.data?.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'فشل تحميل الطلبات');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FB5C9]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg,#0f3460,#1FB5C9)' }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4" dir="rtl">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,rgba(31,181,201,0.1),rgba(15,52,96,0.08))' }}
        >
          <Package className="w-12 h-12 text-[#1FB5C9]" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-[#0f3460] mb-2">لا توجد طلبات بعد</h2>
          <p className="text-gray-500 text-sm">ابدأ التسوق وسيظهر طلبك هنا</p>
        </div>
        <Link
          to="/products"
          className="px-6 py-3 rounded-xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#0f3460,#1FB5C9)', boxShadow: '0 4px 14px rgba(31,181,201,0.3)' }}
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-black text-[#0f3460] mb-6">طلباتي</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('ar-SA', {
              year: 'numeric', month: 'long', day: 'numeric',
            });
            const itemCount = order.items?.length || 0;
            const firstImg = order.items?.[0]?.medicine?.images?.[0] || order.items?.[0]?.medicine?.image || null;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 flex items-center gap-4"
                style={{ boxShadow: '0 2px 16px rgba(15,52,96,0.07)' }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#e0f7fa,#e3f2fd)' }}
                >
                  {firstImg
                    ? <img src={firstImg} alt="" className="w-full h-full object-cover" />
                    : <Package className="w-8 h-8 text-[#1FB5C9]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black text-sm text-[#0f3460]">
                      {order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{date} · {itemCount} منتج</p>
                  <p className="text-sm font-bold text-[#1FB5C9]">{Number(order.total || 0).toFixed(2)} ريال</p>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: 'rgba(31,181,201,0.08)' }}
                >
                  <ChevronLeft className="w-5 h-5 text-[#1FB5C9]" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
