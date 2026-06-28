import { useState, useEffect } from 'react';
import { Star, Gift, Zap, Award, Loader2, Lock } from 'lucide-react';
import { userApi } from '../api/user';
import { toast } from 'sonner';

const TIERS = [
  { id: 'bronze',   label: 'برونزي', min: 0,     max: 999,  color: 'from-orange-300 to-orange-400', badge: '🥉' },
  { id: 'silver',   label: 'فضي',    min: 1000,  max: 4999, color: 'from-gray-300 to-gray-400',     badge: '🥈' },
  { id: 'gold',     label: 'ذهبي',   min: 5000,  max: 9999, color: 'from-yellow-300 to-yellow-400', badge: '🥇' },
  { id: 'platinum', label: 'بلاتيني',min: 10000, max: null, color: 'from-cyan-400 to-blue-500',     badge: '💎' },
];

const REWARDS = [
  { id: 1, title: 'خصم 5 ريال',   points: 500,   icon: Gift },
  { id: 2, title: 'خصم 10 ريال',  points: 1000,  icon: Gift },
  { id: 3, title: 'توصيل مجاني',  points: 750,   icon: Zap  },
  { id: 4, title: 'خصم 25 ريال',  points: 2500,  icon: Award},
  { id: 5, title: 'خصم 50 ريال',  points: 5000,  icon: Award},
  { id: 6, title: 'خصم 100 ريال', points: 10000, icon: Award},
];

export default function LoyaltyPage() {
  const [loyalty,   setLoyalty]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    userApi.getLoyalty()
      .then(d => setLoyalty(d.loyalty || d.data || d))
      .catch(() => toast.error('فشل تحميل نقاط الولاء'))
      .finally(() => setLoading(false));
  }, []);

  const points       = loyalty?.points ?? 0;
  const currentTier  = TIERS.find(t => points >= t.min && (t.max === null || points <= t.max)) || TIERS[0];
  const nextTier     = TIERS[TIERS.indexOf(currentTier) + 1] || null;
  const progress     = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const redeem = (reward) => {
    if (points < reward.points) { toast.error(`تحتاج ${reward.points - points} نقطة إضافية`); return; }
    // Points are deducted automatically at checkout when you enable "استخدام نقاط الولاء"
    // during order placement — there is no standalone redeem endpoint.
    toast.info(
      `لاستخدام ${reward.title}، فعّل خيار "استخدام نقاط الولاء" عند إتمام طلبك القادم وسيُخصم المبلغ تلقائياً.`,
      { duration: 6000 }
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-8">
      <div className={`bg-gradient-to-br ${currentTier.color} px-4 pt-8 pb-20`}>
        <div className="max-w-lg mx-auto text-white">
          <p className="text-sm opacity-80 mb-1">مستوى عضويتك</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{currentTier.badge}</span>
            <div>
              <h1 className="text-2xl font-black">{currentTier.label}</h1>
              {nextTier && <p className="text-sm opacity-80">{nextTier.min - points} نقطة للترقية إلى {nextTier.label}</p>}
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl p-5">
            <p className="text-sm opacity-80 mb-1">رصيد نقاطك</p>
            <p className="text-4xl font-black">{points.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-1">نقطة ولاء</p>
            {nextTier && (
              <div className="mt-4">
                <div className="flex justify-between text-xs opacity-80 mb-1">
                  <span>{points.toLocaleString()} / {nextTier.min.toLocaleString()}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 space-y-4">
        {/* Tiers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-800 mb-3">مستويات العضوية</h2>
          <div className="flex items-start gap-2">
            {TIERS.map(t => (
              <div key={t.id} className="flex-1 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm mb-1 ${
                  points >= t.min
                    ? `bg-gradient-to-br ${t.color} text-white shadow-sm`
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {t.badge}
                </div>
                <p className={`text-[10px] font-bold ${points >= t.min ? 'text-gray-800' : 'text-gray-400'}`}>{t.label}</p>
                <p className="text-[9px] text-gray-400">{t.min >= 1000 ? `${t.min/1000}k` : t.min}+</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-800 mb-3">استبدل نقاطك</h2>
          <div className="grid grid-cols-2 gap-3">
            {REWARDS.map(r => {
              const Icon = r.icon;
              const can = points >= r.points;
              return (
                <button key={r.id} onClick={() => redeem(r)} disabled={!can || redeeming===r.id}
                  className={`p-4 rounded-xl border-2 text-right transition-all ${
                    can ? 'border-cyan-200 bg-cyan-50 hover:border-cyan-400 hover:shadow-sm'
                        : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${can ? 'bg-cyan-100' : 'bg-gray-100'}`}>
                    {can ? <Icon className="w-4 h-4 text-cyan-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{r.title}</p>
                  <p className="text-xs text-cyan-600 font-semibold mt-0.5">{r.points.toLocaleString()} نقطة</p>
                  {!can && <p className="text-[10px] text-red-400 mt-0.5">ناقص {(r.points-points).toLocaleString()}</p>}
                </button>
              );
            })}
          </div>
        </div>

        {/* How to earn */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-800 mb-3">كيف تكسب نقاطاً؟</h2>
          <div className="space-y-2">
            {[
              { text: '1 نقطة لكل ريال تنفقه',    pts: '1 نقطة/ريال' },
              { text: 'إحالة صديق جديد للتطبيق',  pts: '200 نقطة'    },
              { text: 'مراجعة منتج بعد الشراء',    pts: '50 نقطة'     },
              { text: 'تأكيد البريد الإلكتروني',   pts: '100 نقطة'    },
            ].map(({ text, pts }) => (
              <div key={text} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm text-gray-700">{text}</p>
                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">{pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
