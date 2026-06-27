import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Package, ShoppingCart, Users, DollarSign,
  Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import API from '../api/axios';

const MONTH_LABELS = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_COLORS = {
  pending:    '#3b82f6',
  confirmed:  '#06b6d4',
  processing: '#f59e0b',
  shipped:    '#8b5cf6',
  delivered:  '#10b981',
  cancelled:  '#ef4444',
  refunded:   '#6b7280',
};

const CHART_COLORS = ['#06b6d4','#0f3460','#10b981','#f59e0b','#8b5cf6','#ef4444'];

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function EmptyChart({ message = 'No data available yet' }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-2">
      <TrendingUp className="w-10 h-10" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [revenue,   setRevenue]   = useState([]);
  const [topProds,  setTopProds]  = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [userTrend, setUserTrend] = useState([]);
  const [summary,   setSummary]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [months,    setMonths]    = useState(6);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [r1, r2, r3, r4, r5] = await Promise.allSettled([
          API.get(`/admin/dashboard/revenue?months=${months}`),
          API.get('/admin/dashboard/top-products?limit=8'),
          API.get('/admin/dashboard/order-breakdown'),
          API.get('/admin/dashboard/user-trend?days=30'),
          API.get('/admin/dashboard/sales-report'),
        ]);

        if (r1.status === 'fulfilled') {
          const raw = r1.value.data?.data || [];
          setRevenue(raw.map(d => ({
            label: `${MONTH_LABELS[d._id.month]} ${d._id.year}`,
            revenue: d.revenue,
            orders: d.orders,
          })));
        }
        if (r2.status === 'fulfilled') {
          setTopProds(r2.value.data?.data || []);
        }
        if (r3.status === 'fulfilled') {
          setBreakdown((r3.value.data?.data || []).map(d => ({
            name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
            value: d.count,
            status: d._id,
            revenue: d.revenue,
          })));
        }
        if (r4.status === 'fulfilled') {
          const raw = r4.value.data?.data || [];
          setUserTrend(raw.map(d => ({
            label: `${d._id.day}/${d._id.month}`,
            users: d.count,
          })));
        }
        if (r5.status === 'fulfilled') {
          setSummary(r5.value.data?.summary || null);
        }
      } catch {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [months]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-500">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p>{error}</p>
      <button onClick={() => setLoading(true)}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-semibold hover:bg-cyan-700">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  const totalOrders   = breakdown.reduce((s, d) => s + d.value, 0);
  const totalRevenue  = summary?.totalRevenue  ?? 0;
  const avgOrder      = summary?.avgOrderValue ?? 0;
  const totalDiscount = summary?.totalDiscount ?? 0;

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
              Analytics
            </h1>
          </div>

          {/* Revenue period selector */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {[3, 6, 12].map(m => (
              <button key={m} onClick={() => setMonths(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  months === m ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}>
                {m}M
              </button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard icon={DollarSign}   label="Total Revenue (paid)"  value={`${Number(totalRevenue).toFixed(0)} SAR`}  color="bg-cyan-500" />
          <KpiCard icon={ShoppingCart} label="Total Orders"          value={totalOrders}                               color="bg-emerald-500" />
          <KpiCard icon={TrendingUp}   label="Avg Order Value"       value={avgOrder ? `${Number(avgOrder).toFixed(0)} SAR` : '—'} color="bg-purple-500" />
          <KpiCard icon={Package}      label="Coupon Discounts"      value={totalDiscount ? `${Number(totalDiscount).toFixed(0)} SAR` : '—'} color="bg-amber-500" />
        </div>

        {/* Revenue Chart + Order Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Revenue over time */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Revenue Over Time</h2>
            {revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${v} SAR`} width={70} />
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(2)} SAR`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2}
                    fill="url(#revGrad)" dot={{ r: 3, fill: '#06b6d4' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No paid orders in this period yet" />
            )}
          </div>

          {/* Order status donut */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Order Status</h2>
            {breakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={breakdown} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      paddingAngle={3}>
                      {breakdown.map(d => (
                        <Cell key={d.status} fill={STATUS_COLORS[d.status] || '#9ca3af'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, name) => [v, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {breakdown.map(d => (
                    <div key={d.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[d.status] || '#9ca3af' }} />
                        <span className="text-gray-600">{d.name}</span>
                      </div>
                      <span className="font-semibold text-gray-700">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyChart message="No orders yet" />
            )}
          </div>
        </div>

        {/* Top Products + User Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Top Products (last 30 days)</h2>
            {topProds.length > 0 ? (
              <div className="space-y-3">
                {topProds.map((p, i) => {
                  const maxQty = topProds[0]?.totalQuantity || 1;
                  const pct = Math.round((p.totalQuantity / maxQty) * 100);
                  return (
                    <div key={p._id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-700 truncate flex-1 pr-2">
                          <span className="font-bold text-gray-400 mr-1">{i + 1}.</span>
                          {p.name}
                        </p>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-800">{p.totalQuantity} units</span>
                          <span className="text-xs text-gray-400 ml-1">· {Number(p.totalRevenue).toFixed(0)} SAR</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyChart message="No product sales data yet" />
            )}
          </div>

          {/* User registration trend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">New Users (last 30 days)</h2>
            {userTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={userTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={30} />
                  <Tooltip formatter={(v) => [v, 'New Users']} />
                  <Bar dataKey="users" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No new user registrations in the last 30 days" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
