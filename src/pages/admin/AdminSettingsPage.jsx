import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Server, Loader2, Check, Database, Globe, Bell } from 'lucide-react';
import API from '../../api/axios';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [notifForm,  setNotifForm]  = useState({ title: '', body: '', targetRole: 'all' });
  const [sending,    setSending]    = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await API.get('/admin/system').then(r => r.data);
        setSystemInfo(data);
      } catch { /* non-critical */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const sendNotif = async () => {
    if (!notifForm.title || !notifForm.body) { toast.error('العنوان والمحتوى مطلوبان'); return; }
    setSending(true);
    try {
      await API.post('/notifications/send', notifForm);
      toast.success('تم إرسال الإشعار');
      setNotifForm({ title: '', body: '', targetRole: 'all' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل الإرسال');
    } finally { setSending(false); }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link to="/admin" className="hover:text-cyan-600">لوحة التحكم</Link>
            <span>/</span><span className="text-gray-600 font-medium">الإعدادات</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-600" /> إعدادات النظام
          </h1>
        </div>

        <div className="space-y-6">
          {/* System Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-500" /> معلومات النظام
            </h2>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...</div>
            ) : systemInfo ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'إصدار التطبيق', value: systemInfo.version || '—' },
                  { label: 'بيئة التشغيل',   value: systemInfo.environment || 'development' },
                  { label: 'قاعدة البيانات', value: systemInfo.database?.status || '—' },
                  { label: 'وقت التشغيل',    value: `${Math.floor((systemInfo.uptimeSeconds||0)/3600)} ساعة` },
                  { label: 'RAM المستخدم',   value: `${systemInfo.memory?.heapUsedMB || 0} MB` },
                  { label: 'إجمالي RAM',      value: `${systemInfo.memory?.heapTotalMB || 0} MB` },
                  { label: 'استجابة DB',      value: systemInfo.database?.pingMs ? `${systemInfo.database.pingMs} ms` : '—' },
                  { label: 'Redis',            value: systemInfo.redis?.status || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">تعذر تحميل معلومات النظام</p>
            )}
          </div>

          {/* Send Notification */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-500" /> إرسال إشعار
            </h2>
            <div className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">الجمهور المستهدف</label>
                <select value={notifForm.targetRole} onChange={e => setNotifForm(f => ({ ...f, targetRole: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500">
                  <option value="all">الجميع</option>
                  <option value="customer">العملاء</option>
                  <option value="pharmacist">الصيادلة</option>
                  <option value="delivery">مناديب التوصيل</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">عنوان الإشعار</label>
                <input value={notifForm.title} onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="عنوان الإشعار"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">محتوى الإشعار</label>
                <textarea value={notifForm.body} onChange={e => setNotifForm(f => ({ ...f, body: e.target.value }))}
                  rows={3} placeholder="نص الإشعار..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500 resize-none" />
              </div>
              <button onClick={sendNotif} disabled={sending}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                إرسال الإشعار
              </button>
            </div>
          </div>

          {/* Environment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-500" /> متغيرات البيئة المُفعَّلة
            </h2>
            {systemInfo?.optionalVars && (
              <div className="flex flex-wrap gap-2">
                {systemInfo.optionalVars.map(v => (
                  <span key={v.key}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${v.set ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {v.key}: {v.set ? '✓ مُفعَّل' : '✗ غير مُفعَّل'}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-700 font-medium">
                💡 لتفعيل الميزات (البريد، SMS، Firebase)، أضف المتغيرات المناسبة في ملف .env ثم أعد تشغيل الخادم.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
