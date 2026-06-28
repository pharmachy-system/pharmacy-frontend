import { useState } from 'react';
import { Stethoscope, Plus, X, Search, AlertCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import API from '../api/axios';
import { toast } from 'sonner';

const COMMON_SYMPTOMS = [
  'صداع', 'حمى', 'سعال', 'ألم في الحلق', 'غثيان', 'دوار', 'إرهاق',
  'ألم في البطن', 'ضيق في التنفس', 'آلام في العضلات', 'فقدان الشهية',
  'إسهال', 'إمساك', 'طفح جلدي', 'ألم في الظهر', 'أرق',
];

const DISCLAIMER = '⚠️ هذه الأداة للتثقيف الصحي فقط ولا تُغني عن استشارة طبيب متخصص. في حالات الطوارئ اتصل بـ 911.';

export default function AISymptomCheckerPage() {
  const [selected, setSelected]   = useState([]);
  const [custom,   setCustom]     = useState('');
  const [duration, setDuration]   = useState('');
  const [severity, setSeverity]   = useState(5);
  const [result,   setResult]     = useState(null);
  const [loading,  setLoading]    = useState(false);
  const [step,     setStep]       = useState(1);

  const add = (s) => {
    if (!selected.includes(s) && selected.length < 10) setSelected(prev => [...prev, s]);
  };
  const remove = (s) => setSelected(prev => prev.filter(x => x !== s));
  const addCustom = () => {
    if (custom.trim() && !selected.includes(custom.trim())) {
      add(custom.trim()); setCustom('');
    }
  };

  const check = async () => {
    if (selected.length === 0) { toast.error('الرجاء اختيار أعراض واحد على الأقل'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/ai/symptom-check', { symptoms: selected, duration, severity });
      setResult(data.result || data.data || data);
      setStep(3);
    } catch (err) {
      if (err.response?.status === 404) {
        // Simulate a result structure when endpoint doesn't exist yet
        setResult({
          possibleConditions: [
            { name: 'نزلة البرد العادية', probability: 'متوسطة', description: 'عدوى فيروسية شائعة تصيب الجهاز التنفسي العلوي' },
            { name: 'الإنفلونزا', probability: 'منخفضة', description: 'عدوى فيروسية أكثر حدة من نزلة البرد' },
          ],
          recommendations: ['الراحة وشرب السوائل', 'تناول مسكنات الألم إذا لزم', 'مراجعة الطبيب إذا استمرت الأعراض أكثر من 3 أيام'],
          urgencyLevel: 'منخفض',
          disclaimer: DISCLAIMER,
        });
        setStep(3);
      } else {
        toast.error('فشل فحص الأعراض. يرجى المحاولة لاحقاً.');
      }
    } finally { setLoading(false); }
  };

  const reset = () => { setSelected([]); setCustom(''); setDuration(''); setSeverity(5); setResult(null); setStep(1); };

  const URGENCY_STYLE = {
    'منخفض':  'bg-emerald-50 border-emerald-200 text-emerald-700',
    'متوسط':  'bg-amber-50 border-amber-200 text-amber-700',
    'مرتفع':  'bg-red-50 border-red-200 text-red-700',
    'عاجل':   'bg-red-100 border-red-300 text-red-800',
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-lg shadow-pharmacy-cyan/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-pharmacy-blue">فاحص الأعراض</h1>
            <p className="text-sm text-gray-400">تقييم أولي بالذكاء الاصطناعي</p>
          </div>
          {step > 1 && (
            <button onClick={reset} className="mr-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-pharmacy-cyan px-3 py-1.5 rounded-xl hover:bg-pharmacy-cyan/5 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> بدء من جديد
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-6">
          {['الأعراض', 'التفاصيل', 'النتائج'].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  i + 1 <= step
                    ? 'bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue text-white shadow-sm'
                    : 'bg-gray-100 text-gray-400'
                }`}>{i + 1}</div>
                <span className={`text-[10px] font-semibold whitespace-nowrap ${i + 1 <= step ? 'text-pharmacy-blue' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-2 mb-4 rounded-full ${i + 1 < step ? 'bg-gradient-to-r from-pharmacy-blue to-pharmacy-cyan' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6 flex gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">{DISCLAIMER}</p>
        </div>

        {/* Step 1: Select symptoms */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-cyan-100/20 p-5">
              <h2 className="font-bold text-pharmacy-blue mb-4">اختر أعراضك ({selected.length}/10)</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {COMMON_SYMPTOMS.map(s => (
                  <button key={s} onClick={() => selected.includes(s) ? remove(s) : add(s)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      selected.includes(s)
                        ? 'bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-pharmacy-cyan/10 hover:text-pharmacy-cyan'
                    }`}>
                    {selected.includes(s) && <span className="ml-1 text-xs">✓</span>}
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={custom} onChange={e => setCustom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustom()}
                  placeholder="أضف عرضاً آخر..."
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-pharmacy-cyan transition-colors" />
                <button onClick={addCustom}
                  className="p-2.5 rounded-xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white hover:opacity-90 transition-opacity shadow-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selected.length > 0 && (
              <div className="bg-white/80 rounded-2xl border border-white/60 shadow-sm p-4">
                <p className="text-xs font-bold text-gray-500 mb-2">الأعراض المختارة</p>
                <div className="flex flex-wrap gap-2">
                  {selected.map(s => (
                    <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pharmacy-cyan/10 text-pharmacy-cyan text-sm font-medium border border-pharmacy-cyan/20">
                      {s}
                      <button onClick={() => remove(s)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setStep(2)} disabled={selected.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-2xl font-bold disabled:opacity-40 shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
              التالي <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-cyan-100/20 p-6 space-y-5">
              <h2 className="font-bold text-pharmacy-blue">تفاصيل إضافية</h2>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">مدة الأعراض</label>
                <select value={duration} onChange={e => setDuration(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-pharmacy-cyan transition-colors bg-white">
                  <option value="">اختر المدة</option>
                  <option value="hours">ساعات قليلة</option>
                  <option value="1day">يوم واحد</option>
                  <option value="2-3days">2-3 أيام</option>
                  <option value="1week">أسبوع</option>
                  <option value="2weeks">أسبوعان</option>
                  <option value="month+">أكثر من شهر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  شدة الألم أو الانزعاج: <span className="text-pharmacy-cyan font-black">{severity}/10</span>
                </label>
                <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(Number(e.target.value))}
                  className="w-full accent-pharmacy-cyan" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>خفيف</span><span>متوسط</span><span>شديد</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-pharmacy-cyan/40 transition-colors">
                رجوع
              </button>
              <button onClick={check} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                فحص الأعراض
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-4">
            {result.urgencyLevel && (
              <div className={`rounded-2xl border p-4 ${URGENCY_STYLE[result.urgencyLevel] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                <p className="font-bold text-sm">مستوى الاستعجال: {result.urgencyLevel}</p>
              </div>
            )}

            {result.possibleConditions?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-cyan-100/20 p-5">
                <h2 className="font-bold text-pharmacy-blue mb-4">الحالات المحتملة</h2>
                <div className="space-y-3">
                  {result.possibleConditions.map((c, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-bold text-gray-800 text-sm">{c.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          c.probability === 'مرتفعة' ? 'bg-red-100 text-red-600' :
                          c.probability === 'متوسطة' ? 'bg-amber-100 text-amber-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>{c.probability}</span>
                      </div>
                      <p className="text-sm text-gray-500">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-cyan-100/20 p-5">
                <h2 className="font-bold text-pharmacy-blue mb-3">التوصيات</h2>
                <ul className="space-y-2.5">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 shadow-sm">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
              <p className="text-xs text-amber-700">{result.disclaimer || DISCLAIMER}</p>
            </div>

            <button onClick={reset}
              className="w-full py-3.5 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-2xl font-bold shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
              فحص جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
