import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, DollarSign,
  TrendingUp, TrendingDown, AlertCircle, Clock, ArrowUpRight,
  ArrowDownRight, MoreVertical, Loader2
} from 'lucide-react';
import { getDashboardStats, getRecentOrders, getLowStockAlerts } from '../api/admin';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes, stockRes] = await Promise.allSettled([
          getDashboardStats(),
          getRecentOrders(),
          getLowStockAlerts(),
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
            ordersChange:   0,
          });
        }
        if (ordersRes.status === 'fulfilled') {
          const d = ordersRes.value?.data || ordersRes.value;
          setRecentOrders(d.orders ?? d ?? []);
        }
        if (stockRes.status === 'fulfilled') {
          const d = stockRes.value?.data || stockRes.value;
          setLowStockItems((d.medicines ?? d ?? []).slice(0, 10));
        }
      } catch (_) {
        // partial failure — already handled per-promise above
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `${stats.totalRevenue.toLocaleString()} SAR`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Products',
      value: stats.totalProducts.toLocaleString(),
      change: 0,
      icon: Package,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: 0,
      icon: Users,
      color: 'from-orange-500 to-amber-600',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'processing':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'pending':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            Welcome back. Here's what's happening with Ansar Pharmacy today.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${card.color} rounded-xl`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {card.change !== 0 && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {Math.abs(card.change)}%
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.value}</h3>
                <p className="text-sm text-gray-500">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link to="/orders" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-3">
                  <ShoppingCart className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order._id || order.id} to={`/orders/${order._id || order.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          #{order.orderNumber || (order._id || order.id)?.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.name || order.customerName || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 text-sm">{Number(order.total || 0).toFixed(2)} SAR</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h2>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>

            {lowStockItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-3">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm">All stock levels healthy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-amber-200 overflow-hidden">
                        {item.images?.[0] || item.image
                          ? <img src={item.images?.[0] || item.image} alt="" className="w-full h-full object-cover" />
                          : <Package className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-amber-600">{item.stock ?? item.stockQuantity ?? 0} units left</p>
                      </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
