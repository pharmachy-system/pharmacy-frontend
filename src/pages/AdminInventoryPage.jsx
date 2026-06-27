import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Boxes, AlertTriangle, CalendarX, Activity, ChevronLeft, ChevronRight,
  Loader2, Check, AlertCircle, RefreshCw, Package, Edit2,
  ToggleRight, ToggleLeft, Search, X,
} from 'lucide-react';
import API from '../api/axios';

const TABS = [
  { key: 'summary',   label: 'Summary',   icon: Boxes },
  { key: 'lowstock',  label: 'Low Stock', icon: AlertTriangle },
  { key: 'expiry',    label: 'Expiry',    icon: CalendarX },
  { key: 'movement',  label: 'Movement',  icon: Activity },
];

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm ${accent}`}>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function StockEditCell({ med, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(med.stock ?? 0);
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await API.patch(`/medicines/${med._id}/stock`, {
        quantity: Number(val), operation: 'set',
      });
      onSaved(med._id, data.medicine?.stock ?? Number(val));
      setEditing(false);
    } catch {
      // keep editing open so user can retry
    } finally {
      setSaving(false);
    }
  };

  if (editing) return (
    <div className="flex items-center gap-1">
      <input type="number" min="0" value={val}
        onChange={e => setVal(e.target.value)}
        className="w-20 px-2 py-1 rounded-lg border border-cyan-400 text-sm outline-none text-center"
        autoFocus
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
      />
      <button onClick={save} disabled={saving}
        className="p-1 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50">
        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
      </button>
      <button onClick={() => setEditing(false)}
        className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
        <X className="w-3 h-3" />
      </button>
    </div>
  );

  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm font-semibold ${(med.stock ?? 0) === 0 ? 'text-red-500' : (med.stock ?? 0) <= (med.lowStockThreshold ?? 10) ? 'text-amber-500' : 'text-gray-700'}`}>
        {med.stock ?? 0}
      </span>
      <button onClick={() => { setVal(med.stock ?? 0); setEditing(true); }}
        className="p-1 rounded-lg text-gray-300 hover:text-cyan-500 hover:bg-cyan-50 transition-colors">
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [tab,      setTab]      = useState('summary');
  const [summary,  setSummary]  = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [lsPage,   setLsPage]   = useState(1);
  const [lsSearch, setLsSearch] = useState('');
  const [lsQuery,  setLsQuery]  = useState('');
  const [expiring, setExpiring] = useState([]);
  const [expired,  setExpired]  = useState([]);
  const [movement, setMovement] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [toast, setToast]       = useState(null);
  const LS_PER_PAGE = 20;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [r1, r2, r3, r4] = await Promise.allSettled([
          API.get('/admin/inventory/summary'),
          API.get('/admin/inventory/low-stock'),
          API.get('/admin/inventory/expiry?days=60'),
          API.get('/admin/inventory/movement?days=30'),
        ]);
        if (r1.status === 'fulfilled') {
          setSummary(r1.value.data?.summary || {});
          setByCategory(r1.value.data?.byCategory || []);
        }
        if (r2.status === 'fulfilled') {
          setLowStock(r2.value.data?.medicines || []);
        }
        if (r3.status === 'fulfilled') {
          setExpiring(r3.value.data?.expiring || []);
          setExpired(r3.value.data?.expired || []);
        }
        if (r4.status === 'fulfilled') {
          setMovement(r4.value.data?.data || []);
        }
      } catch {
        showToast('Failed to load inventory data', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStockSaved = useCallback((id, newStock) => {
    setLowStock(prev => prev.map(m => m._id === id ? { ...m, stock: newStock } : m));
    showToast('Stock updated');
  }, []);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const visible = filteredLs.slice((lsPage - 1) * LS_PER_PAGE, lsPage * LS_PER_PAGE);
    const allSelected = visible.every(m => selected.has(m._id));
    setSelected(prev => {
      const next = new Set(prev);
      visible.forEach(m => allSelected ? next.delete(m._id) : next.add(m._id));
      return next;
    });
  };

  const bulkActivate = async (isActive) => {
    if (selected.size === 0) return;
    setBulkSaving(true);
    try {
      const { data } = await API.post('/admin/inventory/bulk-status', {
        medicineIds: [...selected], isActive,
      });
      showToast(`${data.updated} products ${isActive ? 'activated' : 'deactivated'}`);
      setLowStock(prev => prev.map(m =>
        selected.has(m._id) ? { ...m, isActive } : m
      ));
      setSelected(new Set());
    } catch (err) {
      showToast(err.response?.data?.message || 'Bulk update failed', 'error');
    } finally {
      setBulkSaving(false);
    }
  };

  const filteredLs = lsQuery
    ? lowStock.filter(m => m.name.toLowerCase().includes(lsQuery.toLowerCase()))
    : lowStock;
  const lsPages = Math.ceil(filteredLs.length / LS_PER_PAGE);
  const lsSlice = filteredLs.slice((lsPage - 1) * LS_PER_PAGE, lsPage * LS_PER_PAGE);

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/admin" className="hover:text-cyan-600">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-600" />
            Inventory
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 p-1 w-fit shadow-sm">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === key ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
              {key === 'lowstock' && lowStock.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'}`}>
                  {lowStock.length}
                </span>
              )}
              {key === 'expiry' && (expiring.length + expired.length) > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-white/20 text-white' : 'bg-red-100 text-red-500'}`}>
                  {expiring.length + expired.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Summary Tab ── */}
        {tab === 'summary' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <KpiCard label="Total Products"  value={(summary?.totalItems  ?? 0).toLocaleString()} accent="border-gray-100" />
              <KpiCard label="Total Stock"     value={(summary?.totalStock  ?? 0).toLocaleString()} sub="units" accent="border-gray-100" />
              <KpiCard label="Inventory Value" value={`${Number(summary?.totalValue ?? 0).toFixed(0)} SAR`} accent="border-cyan-100" />
              <KpiCard label="Avg Price"       value={`${Number(summary?.avgPrice ?? 0).toFixed(2)} SAR`} accent="border-gray-100" />
              <KpiCard label="Low Stock"       value={(summary?.lowStock   ?? 0).toLocaleString()} sub="need restocking" accent="border-amber-100" />
              <KpiCard label="Out of Stock"    value={(summary?.outOfStock ?? 0).toLocaleString()} sub="zero units" accent="border-red-100" />
            </div>

            {byCategory.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4">By Category</h2>
                <div className="divide-y divide-gray-50">
                  {byCategory.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-700">{c.name || 'Uncategorised'}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">{c.count.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-2">{c.totalStock.toLocaleString()} units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Low Stock Tab ── */}
        {tab === 'lowstock' && (
          <div>
            {/* Search + bulk actions */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <form onSubmit={e => { e.preventDefault(); setLsQuery(lsSearch); setLsPage(1); }}
                className="flex gap-2 flex-1 max-w-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={lsSearch} onChange={e => setLsSearch(e.target.value)}
                    placeholder="Search low-stock…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500 bg-white" />
                </div>
                <button type="submit" className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Go</button>
                {lsQuery && <button type="button" onClick={() => { setLsSearch(''); setLsQuery(''); setLsPage(1); }}
                  className="px-2 py-2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
              </form>

              {selected.size > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">{selected.size} selected</span>
                  <button onClick={() => bulkActivate(true)} disabled={bulkSaving}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50">
                    {bulkSaving ? <Loader2 className="w-3 h-3 animate-spin inline" /> : 'Activate'}
                  </button>
                  <button onClick={() => bulkActivate(false)} disabled={bulkSaving}
                    className="px-3 py-1.5 rounded-lg bg-red-400 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-50">
                    Deactivate
                  </button>
                  <button onClick={() => setSelected(new Set())}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded accent-cyan-600"
                    checked={lsSlice.length > 0 && lsSlice.every(m => selected.has(m._id))}
                    onChange={selectAll} />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</span>
                </div>
                <span className="text-xs text-gray-400">{filteredLs.length} items</span>
              </div>

              <div className="divide-y divide-gray-50">
                {lsSlice.map(med => (
                  <div key={med._id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors ${selected.has(med._id) ? 'bg-cyan-50/30' : ''}`}>
                    <input type="checkbox" className="rounded accent-cyan-600 flex-shrink-0"
                      checked={selected.has(med._id)} onChange={() => toggleSelect(med._id)} />
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {med.images?.[0]?.url || med.images?.[0]
                        ? <img src={med.images?.[0]?.url || med.images?.[0]} alt="" className="w-full h-full object-cover" />
                        : <Package className="w-4 h-4 text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{med.name}</p>
                      <p className="text-xs text-gray-400">
                        {med.dosageForm || '—'}
                        {med.manufacturer ? ` · ${med.manufacturer}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center w-20">
                        <StockEditCell med={med} onSaved={handleStockSaved} />
                        <p className="text-xs text-gray-400">threshold: {med.lowStockThreshold ?? 10}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        med.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-400 border-red-200'
                      }`}>{med.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {lsPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                  <span className="text-xs text-gray-500">Page {lsPage} of {lsPages}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setLsPage(p => Math.max(1, p - 1))} disabled={lsPage <= 1}
                      className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <button onClick={() => setLsPage(p => Math.min(lsPages, p + 1))} disabled={lsPage >= lsPages}
                      className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40">
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Expiry Tab ── */}
        {tab === 'expiry' && (
          <div className="space-y-6">
            {[
              { label: 'Expired', items: expired, accent: 'border-red-200 bg-red-50/30', badge: 'bg-red-100 text-red-600' },
              { label: 'Expiring within 60 days', items: expiring, accent: 'border-amber-200 bg-amber-50/30', badge: 'bg-amber-100 text-amber-600' },
            ].map(({ label, items, accent, badge }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">{label}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge}`}>{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <CalendarX className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">None</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {items.map(med => (
                      <div key={med._id} className={`flex items-center gap-4 px-5 py-3.5 ${accent}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{med.name}</p>
                          <p className="text-xs text-gray-400">{med.dosageForm || '—'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-gray-700">{med.stock ?? 0} units</p>
                          <p className="text-xs text-gray-400">Exp: {fmt(med.expiryDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Movement Tab ── */}
        {tab === 'movement' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Stock Movement — last 30 days</h2>
              <span className="text-xs text-gray-400">{movement.length} products sold</span>
            </div>
            {movement.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No sales movement in the last 30 days</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {movement.map((item, i) => (
                  <div key={item._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50">
                    <span className="w-6 text-xs font-bold text-gray-400 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800">{item.totalSold} sold</p>
                      <p className="text-xs text-gray-400">{Number(item.revenue).toFixed(2)} SAR</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
