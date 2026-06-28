import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, ShoppingBag, Heart, Bell, MapPin, Wallet,
  Gift, RotateCcw, Star, Settings, ChevronLeft, Loader2,
  Package, Clock, CheckCircle, Stethoscope, FileText, Bot,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/user';
import { getMyOrders } from '../api/orders';
import { useNotifications } from '../contexts/NotificationContext';
import { toast } from 'sonner';

const MENU = [
  { to: '/orders',             icon: ShoppingBag, label: 'طلباتي',           color: 'text-cyan-500',   bg: 'bg-cyan-50'   },
  { to: '/prescriptions',      icon: FileText,    label: 'وصفاتي',           color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { to: '/wishlist',           icon: Heart,       label: 'المفضلة',          color: 'text-rose-500',   bg: 'bg-rose-50'   },
  { to: '/notifications',      icon: Bell,        label: 'الإشعارات',        color: 'text-amber-500',  bg: 'bg-amber-50'  },
  { to: '/addresses',          icon: MapPin,      label: 'عناويني',          color: 'text-emerald-500',bg: 'bg-emerald-50'},
  { to: '/wallet',             icon: Wallet,      label: 'المحفظة',          color: 'text-violet-500', bg: 'bg-violet-50' },
  { to: '/loyalty',            icon: Star,        label: 'الولاء',           color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { to: '/referral',           icon: Gift,        label: 'الإحالات',         color: 'text-pink-500',   bg: 'bg-pink-50'   },
  { to: '/returns',            icon: RotateCcw,   label: 'المرتجعات',        color: 'text-orange-500', bg: 'bg-orange-50' },
  { to: '/ai/chat',            icon: Bot,         label: 'المساعد الطبي',    color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { to: '/ai/symptom-checker', icon: Stethoscope, label: 'فاحص الأعراض',    color: 'text-teal-500',   bg: 'bg-teal-50'   },
  { to: '/settings',           icon: Settings,    label: 'الإعدادات',        color: 'text-slate-500',  bg: 'bg-slate-50'  },
];

const ORDER_ICONS = {
  pending: Clock, confirmed: CheckCircle, processing: Package,
  shipped: Package, delivered: CheckCircle,
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { unreadCount }  = useNotifications();
  const [orders,  setOrders]  = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [r1, r2] = await Promise.allSettled([
        getMyOrders({ limit: 3 }),
        userApi.getLoyalty(),
      ]);
      if (r1.status === 'fulfilled') setOrders(r1.value.orders || []);
      if (r2.status === 'fulfilled') setLoyalty(r2.value.loyalty || r2.value.data || r2.value);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const initial = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-8">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 px-4 pt-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black text-white overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                : initial}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user?.name || 'مستخدم'}</h1>
              <p className="text-cyan-200 text-sm">{user?.email}</p>
              {loyalty && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-semibold">
                  <Star className="w-3 h-3" /> {loyalty.points || 0} نقطة
                </span>
              )}
            </div>
            <Link to="/profile" className="mr-auto p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white">
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'الطلبات',     value: loading ? '—' : orders.length, to: '/orders' },
            { label: 'الإشعارات',   value: unreadCount > 0 ? unreadCount : '0', to: '/notifications' },
            { label: 'نقاط الولاء', value: loading ? '—' : (loyalty?.points || 0), to: '/loyalty' },
          ].map(({ label, value, to }) => (
            <Link key={to} to={to}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <p className="text-2xl font-black text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        {!loading && orders.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">آخر الطلبات</h2>
              <Link to="/orders" className="text-xs text-cyan-600 hover:underline flex items-center gap-1">
                عرض الكل <ChevronLeft className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {orders.map(o => {
                const Icon = ORDER_ICONS[o.status] || Package;
                return (
                  <Link key={o._id} to={`/orders/${o._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-cyan-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">#{o._id?.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{o.items?.length || 0} منتج</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-800">{Number(o.total || 0).toFixed(0)} ر.س</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-300" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-4 gap-3">
            {MENU.map(({ to, icon: Icon, label, color, bg }) => (
              <Link key={to} to={to}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors text-center group">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-[11px] font-medium text-gray-600 leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors">
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
