import { useState } from 'react';
import { Settings, Bell, Globe, Shield, Smartphone, Loader2, Check } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/user';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { lang, setLang, isRTL } = useLang();
  const { user } = useAuth();
  const [pwForm,   setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [notifs,   setNotifs]   = useState({
    orderUpdates: true, promotions: true, lowStockAlerts: false, systemNews: false,
  });

  const dir = isRTL ? 'rtl' : 'ltr';

  const changePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('يرجى ملء جميع الحقول'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('كلمتا المرور غير متطابقتين'); return; }
    if (pwForm.newPassword.length < 8) { toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }
    setPwSaving(true);
    try {
      await userApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('تم تغيير كلمة المرور بنجاح');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تغيير كلمة المرور');
    } finally { setPwSaving(false); }
  };

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-600" />
          {isRTL ? 'الإعدادات' : 'Settings'}
        </h1>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-pharmacy-cyan" />
            {isRTL ? 'اللغة' : 'Language'}
          </h2>
          <div className="flex gap-3">
            {[['ar', 'العربية', 'RTL'], ['en', 'English', 'LTR']].map(([l, label, dir]) => (
              <button key={l} onClick={() => setLang(l)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-colors ${
                  lang === l ? 'border-pharmacy-cyan bg-pharmacy-cyan/5 text-pharmacy-blue' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {label}
                <span className="block text-xs font-normal opacity-60">{dir}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-pharmacy-cyan" />
            {isRTL ? 'الإشعارات' : 'Notifications'}
          </h2>
          <div className="space-y-3">
            {[
              { key: 'orderUpdates', ar: 'تحديثات الطلبات', en: 'Order Updates' },
              { key: 'promotions',   ar: 'العروض والتخفيضات', en: 'Promotions & Offers' },
              { key: 'lowStockAlerts', ar: 'تنبيهات المخزون', en: 'Low Stock Alerts' },
              { key: 'systemNews',   ar: 'أخبار النظام', en: 'System News' },
            ].map(({ key, ar, en }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-sm text-gray-700">{isRTL ? ar : en}</span>
                <div onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key] ? 'bg-pharmacy-cyan' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifs[key] ? (isRTL ? 'translate-x-0' : 'translate-x-5') : (isRTL ? 'translate-x-5' : 'translate-x-0.5')}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-pharmacy-cyan" />
            {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
          </h2>
          <div className="space-y-3">
            {[
              { key: 'currentPassword', label: isRTL ? 'كلمة المرور الحالية' : 'Current Password' },
              { key: 'newPassword',     label: isRTL ? 'كلمة المرور الجديدة' : 'New Password' },
              { key: 'confirmPassword', label: isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                <input type="password" value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-pharmacy-cyan" />
              </div>
            ))}
            <button onClick={changePassword} disabled={pwSaving}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-sm hover:-translate-y-0.5 transition-all">
              {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-pharmacy-cyan" />
            {isRTL ? 'معلومات الحساب' : 'Account Info'}
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: isRTL ? 'الاسم' : 'Name', value: user?.name },
              { label: isRTL ? 'البريد' : 'Email', value: user?.email },
              { label: isRTL ? 'الجوال' : 'Phone', value: user?.phone || '—' },
              { label: isRTL ? 'الدور' : 'Role', value: user?.role },
              { label: isRTL ? 'حالة البريد' : 'Email Status', value: user?.isEmailVerified ? (isRTL ? 'مُتحقَّق' : 'Verified') : (isRTL ? 'غير مُتحقَّق' : 'Unverified') },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="font-medium text-gray-800">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
