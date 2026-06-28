import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, TrendingUp, Package, AlertTriangle, Loader2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { reportsApi } from '../../api/reports';
import { toast } from 'sonner';

const TABS = [
  { key: 'sales',     label: 'المبيعات',      icon: TrendingUp },
  { key: 'inventory', label: 'المخزون',        icon: Package },
  { key: 'revenue',   label: 'الإيرادات',      icon: BarChart2 },
  { key: 'lowstock',  label: 'نقص المخزون',    icon: AlertTriangle },
];

export default function AdminReportsPage() {
  const [tab,     setTab]     = useState('sales');
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let res;
        switch (tab) {
          case 'sales':     res = await reportsApi.sales({ days: period }); break;
          case 'inventory': res = await reportsApi.inventory(); break;
          case 'revenue':   res = await reportsApi.revenue({ days: period }); break;
          case 'lowstock':  res = await reportsApi.lowStock(); break;
          default: res = null;
        }
        setData(res);
      } catch { toast.error('فشل تحميل التقرير'); }
      finally { setLoading(false); }
    };
    load();
  }, [tab, period]);

  const downloadCSV = () => {
    toast.info('جاري تجهيز الملف…');
    // Future: real CSV export
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
              <span>/</span><span className="text-gray-600 font-medium">التقارير</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-cyan-600" /> التقارير
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {['sales','revenue'].includes(tab) && (
              <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                {[7,30,90].map(d => (
                  <button key={d} onClick={() => setPeriod(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period===d?'bg-cyan-600 text-white':'text-gray-500 hover:bg-gray-50'}`}>
                    {d} يوم
                  </button>
                ))}
              </div>
            )}
            <button onClick={downloadCSV}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> تصدير
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 p-1 w-fit shadow-sm">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab===key?'bg-cyan-600 text-white shadow-sm':'text-gray-500 hover:bg-gray-100'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
        ) : (
          <div className="space-y-6">
            {/* Sales Tab */}
            {tab === 'sales' && data && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'إجمالي المبيعات', value: `${Number(data.summary?.totalRevenue ?? 0).toFixed(0)} ر.س` },
                    { label: 'عدد الطلبات',    value: data.summary?.totalOrders ?? 0 },
                    { label: 'متوسط الطلب',    value: `${Number(data.summary?.avgOrderValue ?? 0).toFixed(0)} ر.س` },
                    { label: 'إجمالي الخصومات', value: `${Number(data.summary?.totalDiscount ?? 0).toFixed(0)} ر.س` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <p className="text-2xl font-bold text-gray-800">{value}</p>
                      <p className="text-sm text-gray-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                {(data.topMedicines || data.data)?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-4">أكثر المنتجات مبيعاً</h2>
                    <div className="divide-y divide-gray-50">
                      {(data.topMedicines || data.data || []).slice(0,10).map((m,i) => (
                        <div key={m._id || i} className="flex items-center gap-4 py-3">
                          <span className="w-6 text-xs font-bold text-gray-400 text-center">{i+1}</span>
                          <p className="flex-1 text-sm text-gray-800 truncate">{m.name}</p>
                          <span className="text-sm font-semibold text-gray-800">{m.totalSold ?? m.totalQuantity ?? 0} مبيع</span>
                          <span className="text-sm text-gray-500">{Number(m.revenue ?? m.totalRevenue ?? 0).toFixed(0)} ر.س</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Revenue Tab */}
            {tab === 'revenue' && data && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4">الإيرادات عبر الوقت</h2>
                {(data.data || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.data || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v} ر.س`} width={70} />
                      <Tooltip formatter={v => [`${Number(v).toFixed(0)} ر.س`, 'الإيرادات']} />
                      <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-16 text-gray-400">لا توجد بيانات إيرادات في هذه الفترة</div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {tab === 'inventory' && data && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'إجمالي المنتجات', value: data.summary?.totalItems ?? 0 },
                  { label: 'إجمالي المخزون',  value: data.summary?.totalStock ?? 0 },
                  { label: 'قيمة المخزون',    value: `${Number(data.summary?.totalValue ?? 0).toFixed(0)} ر.س` },
                  { label: 'منخفض المخزون',   value: data.summary?.lowStock ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Low Stock Tab */}
            {tab === 'lowstock' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">منتجات منخفضة المخزون</h2>
                </div>
                {(data?.medicines || data?.data || []).length === 0 ? (
                  <div className="text-center py-16 text-gray-400">المخزون بمستوى جيد</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {(data.medicines || data.data || []).slice(0, 30).map(m => (
                      <div key={m._id} className="flex items-center gap-4 px-5 py-3.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                        </div>
                        <span className={`text-sm font-bold ${(m.stock??0)===0?'text-red-500':'text-amber-500'}`}>
                          {m.stock ?? 0} وحدة
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
