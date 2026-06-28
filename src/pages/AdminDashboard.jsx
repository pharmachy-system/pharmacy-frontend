import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Package, Users,
  TrendingUp, TrendingDown, AlertCircle, ArrowUpRight, ArrowDownRight,
  Loader2, Sparkles, MoreVertical, ExternalLink,
} from 'lucide-react';
import { getDashboardStats, getRecentOrders, getLowStockAlerts } from '../api/admin';

const STATUS_CFG = {
  delivered:  { label: 'مُسلَّم',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  processing: { label: 'قيد التحضير', cls: 'bg-amber-50 text-amber-700 border-amber-200'    },
  pending:    { label: 'معلّق',        cls: 'bg-blue-50 text-blue-700 border-blue-200'        },
  shipped:    { label: 'في الطريق',   cls: 'bg-purple-50 text-purple-700 border-purple-200'  },
  confirmed:  { label: 'مؤكّد',       cls: 'bg-cyan-50 text-cyan-700 border-cyan-200'        },
  cancelled:  { label: 'ملغي',        cls: 'bg-red-50 text-red-700 border-red-200'           },
};

function StatCard({ label, value, change, icon: Icon, gradient, delay }) {
  const pos = change >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {change !== 0 && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${pos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-black text-gray-800 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0,
    revenueChange: 0, ordersChange: 0,
  });
  const [recentOrders, setRecentOrders]   = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsRes, ordersRes, stockRes] = await Promise.allSettled([
        getDashboardStats(), getRecentOrders(), getLowStockAlerts(),
      ]);
      if (statsRes.status === 'fulfilled') {
        const d = statsRes.value?.data || statsRes.value;
        const s = d.stats || d;
        setStats({
          totalRevenue:   s.revenue?.total   ?? s.totalRevenue   ?? 0,
          totalOrders:    s.orders?.total    ?? s.totalOrders    ?? 0,
          totalProducts:  s.medicines?.total ?? s.totalProducts  ?? 0,
          totalCustomers: s.users?.total     ?? s.totalCustomers ?? 0,
          revenueChange:  s.revenue?.growth  ?? s.revenueChange  ?? 0,
          ordersChange: 0,
        });
      }
      if (ordersRes.status === 'fulfilled') {
        const d = ordersRes.value?.data || ordersRes.value;
        setRecentOrders((d.orders ?? d ?? []).slice(0, 8));
      }
      if (stockRes.status === 'fulfilled') {
        const d = stockRes.value?.data || stockRes.value;
        setLowStockItems((d.medicines ?? d ?? []).slice(0, 8));
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  const STATS = [
    { label: 'إجمالي الإيرادات', value: `${Number(stats.totalRevenue).toLocaleString()} ر.س`, change: stats.revenueChange, icon: DollarSign, gradient: 'from-cyan-500 to-blue-600',    delay: 0.1 },
    { label: 'إجمالي الطلبات',   value: stats.totalOrders.toLocaleString(),   change: stats.ordersChange,  icon: ShoppingCart,  gradient: 'from-emerald-400 to-teal-600', delay: 0.17 },
    { label: 'المنتجات',          value: stats.totalProducts.toLocaleString(), change: 0,                   icon: Package,       gradient: 'from-violet-500 to-purple-600', delay: 0.24 },
    { label: 'العملاء',           value: stats.totalCustomers.toLocaleString(),change: 0,                   icon: Users,         gradient: 'from-orange-400 to-amber-600', delay: 0.31 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-800">Dashboard Overview</h1>
          </div>
          <p className="text-sm text-gray-500 pr-10">Welcome back — here's what's happening today.</p>
        </div>
        <Link to="/admin/orders"
          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 px-3 py-2 rounded-xl transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> View All Orders
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-cyan-500" />
              <h2 className="font-bold text-gray-800">Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
              See all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingCart className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const st = STATUS_CFG[order.status] || { label: order.status, cls: 'bg-gray-50 text-gray-500 border-gray-200' };
                return (
                  <Link key={order._id} to={`/admin/orders`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          #{(order._id || '').slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">{order.user?.name || '—'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{Number(order.total || 0).toFixed(2)} SAR</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Low Stock */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-gray-800">Low Stock</h2>
            </div>
            <Link to="/admin/inventory" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
              Manage →
            </Link>
          </div>
          {lowStockItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">All stock levels healthy</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStockItems.map((item) => {
                const stock = item.stock ?? item.stockQuantity ?? 0;
                const pct = Math.min(100, (stock / 50) * 100);
                return (
                  <div key={item._id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.images?.[0] || item.image
                        ? <img src={item.images?.[0] || item.image} alt="" className="w-full h-full object-cover" />
                        : <Package className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                      <div className="mt-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 flex-shrink-0">{stock}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
