import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, Camera, Check } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 60 }, (_, i) => 2006 - i);

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", gender: "",
    day: "", month: "", year: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 bg-white text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all">
              <Camera className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">Tap to change photo</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">First Name</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="First name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Last name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.email} type="email" onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email address"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.phone} type="tel" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Phone number"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Gender</label>
            <div className="flex gap-2">
              {["Male", "Female", "Prefer not to say"].map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                  className={"flex-1 py-2 rounded-xl border text-sm font-medium transition-all " +
                    (form.gender === g ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Date of Birth</label>
            <div className="grid grid-cols-3 gap-2">
              <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} className={selectClass}>
                <option value="">Day</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} className={selectClass}>
                <option value="">Month</option>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className={selectClass}>
                <option value="">Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-5">
          <button onClick={handleSave}
            className={"w-full py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 " +
              (saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg")}>
            {saved ? <><Check className="w-5 h-5" /> Saved!</> : "Save Changes"}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
