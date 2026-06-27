import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Loader2, X, Check, AlertCircle, Save,
} from 'lucide-react';
import API from '../api/axios';

const DOSAGE_FORMS = ['tablet','capsule','syrup','injection','cream','drops','inhaler','patch','other'];

const emptyForm = {
  name: '', nameAr: '', price: '', stock: '', description: '',
  dosageForm: '', strength: '', manufacturer: '', requiresPrescription: false, isActive: true,
};

export default function AdminProductsPage() {
  const [medicines, setMedicines]   = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [query, setQuery]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast]           = useState(null);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [showAdd, setShowAdd]       = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (query) params.search = query;
      const { data } = await API.get('/medicines', { params });
      setMedicines(data.medicines || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const toggleActive = async (med) => {
    setTogglingId(med._id);
    try {
      const { data } = await API.put(`/medicines/${med._id}`, { isActive: !med.isActive });
      setMedicines(prev => prev.map(m => m._id === med._id ? { ...m, ...data.medicine } : m));
      showToast(`${data.medicine?.isActive ? 'Activated' : 'Deactivated'} successfully`);
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/medicines/${id}`);
      setMedicines(prev => prev.filter(m => m._id !== id));
      showToast('Product deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const openEdit = (med) => {
    setEditItem(med);
    setForm({
      name: med.name || '',
      nameAr: med.nameAr || '',
      price: med.price ?? '',
      stock: med.stock ?? '',
      description: med.description || '',
      dosageForm: med.dosageForm || '',
      strength: med.strength || '',
      manufacturer: med.manufacturer || '',
      requiresPrescription: med.requiresPrescription ?? false,
      isActive: med.isActive ?? true,
    });
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowAdd(true);
  };

  const closeModal = () => { setEditItem(null); setShowAdd(false); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        price:       Number(form.price),
        stock:       Number(form.stock),
        isActive:    form.isActive,
        requiresPrescription: form.requiresPrescription,
      };
      if (form.nameAr)       payload.nameAr       = form.nameAr;
      if (form.description)  payload.description  = form.description;
      if (form.dosageForm)   payload.dosageForm   = form.dosageForm;
      if (form.strength)     payload.strength     = form.strength;
      if (form.manufacturer) payload.manufacturer = form.manufacturer;

      if (editItem) {
        const { data } = await API.put(`/medicines/${editItem._id}`, payload);
        setMedicines(prev => prev.map(m => m._id === editItem._id ? { ...m, ...data.medicine } : m));
        showToast('Product updated');
      } else {
        const { data } = await API.post('/medicines', payload);
        setMedicines(prev => [data.medicine, ...prev]);
        showToast('Product created');
      }
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isModalOpen = !!editItem || showAdd;
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link to="/admin" className="hover:text-cyan-600">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">Products</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-6 h-6 text-cyan-600" />
              Products
            </h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 bg-white"
            />
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
          <div className="px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
            <span>Product</span>
            <span>{pagination.total.toLocaleString()} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-cyan-500" />
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {medicines.map(med => {
                const price = med.finalPrice ?? med.price ?? 0;
                const img   = med.images?.[0]?.url || med.images?.[0] || null;
                return (
                  <div key={med._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    {/* Image */}
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-200">
                      {img
                        ? <img src={img} alt="" className="w-full h-full object-cover" />
                        : <Package className="w-5 h-5 text-gray-300" />}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{med.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">{med.dosageForm || '—'}</span>
                        {med.requiresPrescription && (
                          <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full border border-purple-200">Rx</span>
                        )}
                        {!med.isActive && (
                          <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full border border-red-200">Inactive</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right w-24 flex-shrink-0">
                      <p className="font-semibold text-gray-800 text-sm">{Number(price).toFixed(2)} SAR</p>
                      <p className="text-xs text-gray-400">stock: {med.stock ?? 0}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Toggle active */}
                      <button onClick={() => toggleActive(med)} disabled={!!togglingId}
                        title={med.isActive ? 'Deactivate' : 'Activate'}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
                        {togglingId === med._id
                          ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          : med.isActive
                            ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                            : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                      </button>

                      {/* Edit */}
                      <button onClick={() => openEdit(med)}
                        className="p-2 rounded-lg hover:bg-cyan-50 text-cyan-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button onClick={() => setConfirmDelete(med._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
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

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">{editItem ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Name (EN) *</label>
                    <input value={form.name} onChange={e => setF('name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Name (AR)</label>
                    <input value={form.nameAr} onChange={e => setF('nameAr', e.target.value)} dir="rtl"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price (SAR) *</label>
                    <input type="number" min="0" step="0.01" value={form.price}
                      onChange={e => setF('price', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Stock *</label>
                    <input type="number" min="0" step="1" value={form.stock}
                      onChange={e => setF('stock', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>

                {/* Dosage form & Strength */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Dosage Form</label>
                    <select value={form.dosageForm} onChange={e => setF('dosageForm', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500 bg-white">
                      <option value="">— select —</option>
                      {DOSAGE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Strength</label>
                    <input value={form.strength} onChange={e => setF('strength', e.target.value)}
                      placeholder="e.g. 500mg"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Manufacturer</label>
                  <input value={form.manufacturer} onChange={e => setF('manufacturer', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setF('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-cyan-500 resize-none" />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.requiresPrescription}
                      onChange={e => setF('requiresPrescription', e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-600" />
                    <span className="text-sm text-gray-700">Requires Prescription</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setF('isActive', e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-600" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>

                {showAdd && !editItem && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Note: new products require a category. If you see a validation error, a category must exist in the database first.
                  </p>
                )}
              </div>

              <div className="flex gap-3 p-5 border-t border-gray-100">
                <button onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !form.name || form.price === '' || form.stock === ''}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editItem ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDelete)} disabled={!!deletingId}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
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
