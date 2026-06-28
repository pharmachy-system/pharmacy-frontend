import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, Check, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../utils/axiosClient";

const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 18 - i);
const MONTHS = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", gender: "", day: "", month: "", year: "",
  });

  useEffect(() => {
    if (!authUser) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
      return;
    }
    (async () => {
      try {
        const { data } = await axiosClient.get("/users/me");
        const u = data.user || data.data?.user || {};
        let day = "", month = "", year = "";
        const dob = u.dateOfBirth || u.birthDate;
        if (dob) {
          const d = new Date(dob);
          day = d.getDate();
          month = d.getMonth() + 1;
          year = d.getFullYear();
        }
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          gender: u.gender || "",
          day, month, year,
        });
      } catch {
        // Fall back to auth context data
        setForm(f => ({ ...f, name: authUser.name || "", phone: authUser.phone || "" }));
      } finally {
        setLoading(false);
      }
    })();
  }, [authUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.gender) payload.gender = form.gender;
      if (form.year && form.month && form.day) {
        const mm = String(form.month).padStart(2, "0");
        const dd = String(form.day).padStart(2, "0");
        payload.birthDate = `${form.year}-${mm}-${dd}`;
      }
      await axiosClient.put("/users/me", payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "فشل حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/10 transition-all";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-pharmacy-cyan" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <h1 className="text-xl font-black text-pharmacy-blue">تعديل الملف الشخصي</h1>
        </motion.div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-xl shadow-pharmacy-cyan/25">
            <User className="w-11 h-11 text-white" />
          </div>
          <p className="text-sm font-bold text-pharmacy-blue mt-3">{form.name || authUser?.name}</p>
          <p className="text-xs text-gray-400">{authUser?.email}</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 p-6 space-y-5 mb-5 shadow-xl shadow-cyan-100/30">

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">الاسم</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="أدخل اسمك"
                className={inputClass + " pr-9"}
                style={{ fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={authUser?.email || ""} readOnly
                className={inputClass + " pr-9 bg-gray-50 text-gray-400 cursor-not-allowed"}
                style={{ fontFamily: "inherit", direction: "ltr", textAlign: "right" }} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">رقم الجوال</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="05xxxxxxxx" type="tel"
                className={inputClass + " pr-9"}
                style={{ fontFamily: "inherit", direction: "ltr", textAlign: "right" }} />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">الجنس</label>
            <div className="flex gap-2">
              {[["male", "ذكر"], ["female", "أنثى"]].map(([val, label]) => (
                <button key={val} onClick={() => set("gender", form.gender === val ? "" : val)}
                  className={"flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all " +
                    (form.gender === val
                      ? "border-pharmacy-cyan bg-pharmacy-cyan/5 text-pharmacy-blue"
                      : "border-gray-200 text-gray-400 hover:border-gray-300")}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">تاريخ الميلاد</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "day",   placeholder: "اليوم",  options: DAYS.map(d => [d, d]) },
                { key: "month", placeholder: "الشهر",  options: MONTHS.map((m, i) => [i + 1, m]) },
                { key: "year",  placeholder: "السنة",  options: YEARS.map(y => [y, y]) },
              ].map(({ key, placeholder, options }) => (
                <select key={key} value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1FB5C9] bg-white text-gray-700"
                  style={{ fontFamily: "inherit" }}>
                  <option value="">{placeholder}</option>
                  {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Save Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={handleSave} disabled={saving || saved}
            className={`w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg ${
              saved ? "bg-emerald-500 shadow-emerald-200" : "bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue shadow-pharmacy-cyan/25 hover:-translate-y-0.5"
            }`}>
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ...</>
              : saved
              ? <><Check className="w-5 h-5" />تم الحفظ!</>
              : "حفظ التغييرات"}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
