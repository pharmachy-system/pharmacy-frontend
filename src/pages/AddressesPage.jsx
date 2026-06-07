import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, MapPin, Plus, Edit2, Trash2,
  Home, Briefcase, Check
} from "lucide-react";

const ADDRESS_TYPES = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "other", label: "Other", icon: MapPin },
];

export default function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    type: "home", label: "", street: "", city: "", district: "", phone: "", isDefault: false
  });

  const resetForm = () => {
    setForm({ type: "home", label: "", street: "", city: "", district: "", phone: "", isDefault: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.street || !form.city) return;
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...form, id: editingId } : a));
    } else {
      const newAddr = { ...form, id: Date.now() };
      if (form.isDefault) {
        setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newAddr]);
      } else {
        setAddresses(prev => [...prev, newAddr]);
      }
    }
    resetForm();
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-sm text-gray-500">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </motion.div>

        {/* Empty State */}
        {addresses.length === 0 && !showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-cyan-300" />
            </div>
            <p className="text-gray-500 font-medium">No addresses saved yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your delivery address</p>
            <button onClick={() => setShowForm(true)}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
              Add Address
            </button>
          </motion.div>
        )}

        {/* Address List */}
        <div className="space-y-3 mb-4">
          <AnimatePresence>
            {addresses.map((addr) => {
              const TypeIcon = ADDRESS_TYPES.find(t => t.id === addr.type)?.icon || MapPin;
              return (
                <motion.div key={addr.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className={"bg-white rounded-2xl border p-4 " + (addr.isDefault ? "border-cyan-300 shadow-sm" : "border-gray-100")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={"p-2 rounded-xl " + (addr.isDefault ? "bg-cyan-50" : "bg-gray-50")}>
                        <TypeIcon className={"w-5 h-5 " + (addr.isDefault ? "text-cyan-500" : "text-gray-400")} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 capitalize">{addr.label || addr.type}</p>
                          {addr.isDefault && (
                            <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full font-medium">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{addr.street}</p>
                        <p className="text-sm text-gray-500">{addr.district}{addr.district && addr.city ? ", " : ""}{addr.city}</p>
                        {addr.phone && <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-all">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleEdit(addr)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(addr.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">{editingId ? "Edit Address" : "New Address"}</h2>

              {/* Type */}
              <div className="flex gap-2 mb-4">
                {ADDRESS_TYPES.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
                      className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-all " +
                        (form.type === t.id ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Address label (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
                <input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                  placeholder="Street address *"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    placeholder="District"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="City *"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
                </div>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="Phone number"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isDefault}
                    onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))}
                    className="w-4 h-4 accent-cyan-500" />
                  <span className="text-sm text-gray-600">Set as default address</span>
                </label>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={resetForm}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all">
                  {editingId ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
