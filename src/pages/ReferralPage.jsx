import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, Star, Loader2 } from 'lucide-react';
import { referralsApi } from '../api/referrals';
import { toast } from 'sonner';

export default function ReferralPage() {
  const [referral,      setReferral]      = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [copied,        setCopied]        = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [r1, r2] = await Promise.allSettled([
          referralsApi.getMy(),
          referralsApi.getReferredUsers(),
        ]);
        if (r1.status === 'fulfilled') setReferral(r1.value.referral || r1.value.data || r1.value);
        if (r2.status === 'fulfilled') setReferredUsers(r2.value.users || r2.value.data || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const copy = async () => {
    if (!referral?.code) return;
    try {
      await navigator.clipboard.writeText(referral.code);
      setCopied(true);
      toast.success('تم نسخ الكود');
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error('فشل النسخ'); }
  };

  const shareLink = async () => {
    const url = `${window.location.origin}/register?ref=${referral?.code}`;
    if (navigator.share) {
      await navigator.share({ title: 'صيدلية الأنصار', text: 'سجّل وابدأ تسوقك من صيدلية الأنصار!', url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('تم نسخ الرابط');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Gift className="w-6 h-6 text-cyan-600" /> برنامج الإحالة
        </h1>
        <p className="text-gray-500 mb-6">شارك كودك مع أصدقائك واكسب نقاطاً لكل إحالة ناجحة</p>

        {/* Code Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg mb-6">
          <p className="text-sm opacity-80 mb-2">كود الإحالة الخاص بك</p>
          <div className="flex items-center gap-3 bg-white/20 rounded-2xl px-4 py-3">
            <code className="text-2xl font-black tracking-widest flex-1">{referral?.code || '——'}</code>
            <button onClick={copy} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{referral?.totalReferrals || 0}</p>
              <p className="text-xs opacity-80">إجمالي الإحالات</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{referral?.successfulReferrals || 0}</p>
              <p className="text-xs opacity-80">ناجحة</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{referral?.totalEarned || 0}</p>
              <p className="text-xs opacity-80">نقاط مكتسبة</p>
            </div>
          </div>
          <button onClick={shareLink}
            className="w-full mt-4 py-3 rounded-2xl bg-white text-cyan-600 font-bold text-sm hover:bg-cyan-50 transition-colors">
            مشاركة الرابط
          </button>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">كيف يعمل البرنامج؟</h2>
          <div className="space-y-3">
            {[
              { step: '1', text: 'شارك كودك مع أصدقائك' },
              { step: '2', text: 'يسجل صديقك باستخدام كودك' },
              { step: '3', text: 'يحصل صديقك على خصم على أول طلب' },
              { step: '4', text: 'تحصل أنت على نقاط ولاء فور إتمام طلبه' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-600 flex-shrink-0">
                  {step}
                </div>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referred users */}
        {referredUsers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" /> أشخاص أحلتهم ({referredUsers.length})
            </h2>
            <div className="divide-y divide-gray-50">
              {referredUsers.map(u => (
                <div key={u._id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-sm font-bold text-cyan-700 flex-shrink-0">
                    {u.name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{u.name || 'مستخدم'}</p>
                    <p className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                  {u.hasOrdered && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" /> طلب ناجح
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
