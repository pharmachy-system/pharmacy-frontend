import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, ChevronLeft, ChevronRight, Loader2,
  X, Check, AlertCircle, Shield, ShieldOff, ToggleLeft,
  ToggleRight, ChevronDown, User, Mail, Phone, Calendar,
} from 'lucide-react';
import { getAllUsers, updateUserRole, updateUserStatus } from '../api/admin';

const ROLES = ['all', 'customer', 'admin', 'pharmacist', 'delivery'];

const ROLE_META = {
  customer:   { label: 'Customer',   color: 'bg-gray-100 text-gray-600 border-gray-200' },
  admin:      { label: 'Admin',      color: 'bg-red-50 text-red-600 border-red-200' },
  pharmacist: { label: 'Pharmacist', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  delivery:   { label: 'Delivery',   color: 'bg-blue-50 text-blue-600 border-blue-200' },
};

const ASSIGNABLE_ROLES = ['customer', 'pharmacist', 'delivery', 'admin'];

function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.customer;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${m.color}`}>
      {m.label}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers]           = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage]             = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch]         = useState('');
  const [query, setQuery]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast]           = useState(null);

  // Role change modal
  const [roleModal, setRoleModal] = useState(null); // { user }
  const [newRole, setNewRole]     = useState('');
  const [roleSaving, setRoleSaving] = useState(false);

  // User detail drawer
  const [detailUser, setDetailUser] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (query) params.search = query;
      const data = await getAllUsers(params);
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, query]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const toggleStatus = async (user) => {
    setTogglingId(user._id);
    try {
      const data = await updateUserStatus(user._id, !user.isActive);
      const updated = data.user || data.data?.user;
      if (updated) {
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: updated.isActive } : u));
        if (detailUser?._id === user._id) setDetailUser(d => ({ ...d, isActive: updated.isActive }));
      }
      showToast((!user.isActive ? 'Activated' : 'Deactivated') + ' successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const openRoleModal = (user) => {
    setRoleModal({ user });
    setNewRole(user.role);
  };

  const handleRoleChange = async () => {
    if (!roleModal || newRole === roleModal.user.role) { setRoleModal(null); return; }
    setRoleSaving(true);
    try {
      const data = await updateUserRole(roleModal.user._id, newRole);
      const updated = data.user || data.data?.user;
      if (updated) {
        setUsers(prev => prev.map(u => u._id === roleModal.user._id ? { ...u, role: updated.role } : u));
        if (detailUser?._id === roleModal.user._id) setDetailUser(d => ({ ...d, role: updated.role }));
      }
      showToast(`Role updated to "${newRole}"`);
      setRoleModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error');
    } finally {
      setRoleSaving(false);
    }
  };

  const fmt = (iso) => iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div dir="ltr" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/admin" className="hover:text-cyan-600">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Users</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            Users
          </h1>
        </div>

        {/* Role filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ROLES.map(r => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors border ${
                roleFilter === r
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {r === 'all' ? 'All' : ROLE_META[r]?.label || r}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
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
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User</span>
            <span className="text-xs text-gray-400">{pagination.total} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-cyan-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {users.map(user => (
                <div key={user._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    {user.avatar
                      ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      : (user.name?.[0] || '?').toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-sm text-gray-800 truncate">{user.name}</span>
                      <RoleBadge role={user.role} />
                      {!user.isActive && (
                        <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full border border-red-200">Inactive</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.phone || '—'} · Joined {fmt(user.createdAt)}</p>
                  </div>

                  {/* Loyalty points */}
                  <div className="text-right w-20 flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-semibold text-gray-700">{user.loyaltyPoints ?? 0}</p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* View detail */}
                    <button onClick={() => setDetailUser(user)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      View
                    </button>

                    {/* Change role */}
                    <button onClick={() => openRoleModal(user)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                      Role
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Toggle active */}
                    <button onClick={() => toggleStatus(user)} disabled={!!togglingId}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
                      {togglingId === user._id
                        ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        : user.isActive
                          ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                          : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                    </button>
                  </div>
                </div>
              ))}
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

      {/* User Detail Drawer */}
      <AnimatePresence>
        {detailUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setDetailUser(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">User Detail</h2>
                <button onClick={() => setDetailUser(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
                    {detailUser.avatar
                      ? <img src={detailUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      : (detailUser.name?.[0] || '?').toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-800">{detailUser.name}</h3>
                  <div className="mt-1"><RoleBadge role={detailUser.role} /></div>
                </div>

                {/* Fields */}
                <div className="space-y-3">
                  {[
                    { icon: Mail,     label: 'Email',   value: detailUser.email },
                    { icon: Phone,    label: 'Phone',   value: detailUser.phone || '—' },
                    { icon: Calendar, label: 'Joined',  value: fmt(detailUser.createdAt) },
                    { icon: Calendar, label: 'Last Login', value: fmt(detailUser.lastLoginAt) },
                    { icon: User,     label: 'Logins',  value: detailUser.loginCount ?? 0 },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-gray-700 truncate">{String(value)}</p>
                      </div>
                    </div>
                  ))}

                  {/* Verification */}
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400 mb-2">Verification</p>
                    <div className="flex gap-3 flex-wrap">
                      {[
                        { label: 'Email', verified: detailUser.isEmailVerified },
                        { label: 'Phone', verified: detailUser.isPhoneVerified },
                        { label: 'Nafath', verified: detailUser.nafathVerified },
                      ].map(({ label, verified }) => (
                        <span key={label}
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            verified
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                          }`}>
                          {verified ? '✓' : '✗'} {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Loyalty */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                    <p className="text-xs text-amber-600">Loyalty Points</p>
                    <p className="text-2xl font-bold text-amber-700">{detailUser.loyaltyPoints ?? 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-2">
                  <button onClick={() => { openRoleModal(detailUser); setDetailUser(null); }}
                    className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> Change Role
                  </button>
                  <button onClick={() => toggleStatus(detailUser)}
                    disabled={!!togglingId}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${
                      detailUser.isActive
                        ? 'border border-red-200 text-red-500 hover:bg-red-50'
                        : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}>
                    {togglingId === detailUser._id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : detailUser.isActive
                        ? <><ShieldOff className="w-4 h-4" /> Deactivate</>
                        : <><Shield className="w-4 h-4" /> Activate</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Role Change Modal */}
      <AnimatePresence>
        {roleModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setRoleModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            >
              <h2 className="font-bold text-gray-800 mb-1">Change Role</h2>
              <p className="text-xs text-gray-400 mb-4">{roleModal.user.name} · {roleModal.user.email}</p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {ASSIGNABLE_ROLES.map(r => (
                  <button key={r} onClick={() => setNewRole(r)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold capitalize transition-colors ${
                      newRole === r
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}>
                    {ROLE_META[r]?.label || r}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setRoleModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleRoleChange} disabled={roleSaving || newRole === roleModal.user.role}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {roleSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
