import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Filter, ChevronLeft, ChevronRight,
  Loader2, X, Check, AlertCircle, Clock, CheckCircle,
  Truck, Package, XCircle, RefreshCw, ChevronDown,
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../api/admin';

const STATUSES = ['all','pending','confirmed','processing','shipped','delivered','cancelled'];

const NEXT_STATUS = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
};

const STATUS_META = {
  pending:    { label: 'Pending',    color: 'bg-blue-50 text-blue-600 border-blue-200',      icon: Clock },
  confirmed:  { label: 'Confirmed',  color: 'bg-cyan-50 text-cyan-600 border-cyan-200',       icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-amber-50 text-amber-600 border-amber-200',    icon: Package },
  shipped:    { label: 'Shipped',    color: 'bg-purple-50 text-purple-600 border-purple-200', icon: Truck },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-50 text-red-600 border-red-200',          icon: XCircle },
  refunded:   { label: 'Refunded',   color: 'bg-gray-50 text-gray-500 border-gray-200',       icon: RefreshCw },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${m.color}`}>
      <Icon className="w-3 h-3" />
      {m.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders]         = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage]             = useState(1);
  const [statusFilter, setStatus]   = useState('all');
  const [search, setSearch]         = useState('');
  const [query, setQuery]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  // Status update modal
  const [updateModal, setUpdateModal] = useState(null); // { order }
  const [nextStatus, setNextStatus]   = useState('');
  const [note, setNote]               = useState('');
  const [updating, setUpdating]       = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (query) params.search = query;
      const data = await getAllOrders(params);
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, query]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const openUpdateModal = (order) => {
    const nexts = NEXT_STATUS[order.status] || [];
    if (nexts.length === 0) return;
    setUpdateModal({ order });
    setNextStatus(nexts[0]);
    setNote('');
  };

  const handleStatusUpdate = async () => {
    if (!updateModal || !nextStatus) return;
    setUpdating(true);
    try {
      const data = await updateOrderStatus(updateModal.order._id, nextStatus, note || undefined);
      const updated = data.order || data.data?.order;
      if (updated) {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, status: updated.status } : o));
      }
      showToast(`Order updated to "${nextStatus}"`);
      setUpdateModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/admin" className="hover:text-cyan-600">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Orders</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-cyan-600" />
            Orders
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors border ${
                statusFilter === s
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {s === 'all' ? 'All' : STATUS_META[s]?.label || s}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by order number or customer…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 bg-white" />
          </div>
          <button type="submit"
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Search
          </button>
          {query && (
            <button type="button" onClick={() => { setSearch(''); setQuery(''); setPage(1); }}
              className="px-3 py-2.5 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</span>
            <span className="text-xs text-gray-400">{pagination.total} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-cyan-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map(order => {
                const nexts = NEXT_STATUS[order.status] || [];
                const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                });
                return (
                  <div key={order._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">

                    {/* Order info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <Link to={`/orders/${order._id}`}
                          className="font-semibold text-sm text-gray-800 hover:text-cyan-600 font-mono">
                          #{order.orderNumber?.slice(-12) || order._id.slice(-8).toUpperCase()}
                        </Link>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.user?.name || '—'} · {order.user?.email || ''}
                      </p>
                      <p className="text-xs text-gray-400">{date} · {order.items?.length || 0} item(s)</p>
                    </div>

                    {/* Total + payment */}
                    <div className="text-right w-28 flex-shrink-0">
                      <p className="font-bold text-gray-800 text-sm">{Number(order.total || 0).toFixed(2)} SAR</p>
                      <p className="text-xs text-gray-400 capitalize">{order.paymentMethod} · {order.paymentStatus}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/orders/${order._id}`}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                        View
                      </Link>
                      {nexts.length > 0 && (
                        <button onClick={() => openUpdateModal(order)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors flex items-center gap-1">
                          Update
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <span className="text-xs text-gray-500">Page {pagination.page} of {pagination.pages}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || loading}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages || loading}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {updateModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setUpdateModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            >
              <h2 className="font-bold text-gray-800 mb-1">Update Order Status</h2>
              <p className="text-xs text-gray-400 mb-4 font-mono">
                #{updateModal.order.orderNumber?.slice(-12) || updateModal.order._id.slice(-8).toUpperCase()}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={updateModal.order.status} />
                <span className="text-gray-400 text-xs">→</span>
                <div className="flex gap-2 flex-wrap">
                  {(NEXT_STATUS[updateModal.order.status] || []).map(s => (
                    <button key={s} onClick={() => setNextStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                        nextStatus === s
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}>
                      {STATUS_META[s]?.label || s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Note (optional)</label>
                <input value={note} onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Dispatched via courier"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setUpdateModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleStatusUpdate} disabled={updating || !nextStatus}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
