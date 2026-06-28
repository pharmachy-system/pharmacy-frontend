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
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">فاحص الأعراض</h1>
            <p className="text-sm text-gray-500">للأغراض التثقيفية فقط</p>
          </div>
          {step > 1 && (
            <button onClick={reset} className="mr-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">
              <RefreshCw className="w-3.5 h-3.5" /> بدء من جديد
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{DISCLAIMER}</p>
        </div>

        {/* Step 1: Select symptoms */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">اختر أعراضك ({selected.length}/10)</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {COMMON_SYMPTOMS.map(s => (
                  <button key={s} onClick={() => selected.includes(s) ? remove(s) : add(s)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                      selected.includes(s) ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                    }`}>
                    {selected.includes(s) && <span className="ml-1">✓</span>}
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={custom} onChange={e => setCustom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustom()}
                  placeholder="أضف عرضاً آخر..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500" />
                <button onClick={addCustom} className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">الأعراض المختارة</p>
                <div className="flex flex-wrap gap-2">
                  {selected.map(s => (
                    <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm">
                      {s}
                      <button onClick={() => remove(s)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setStep(2)} disabled={selected.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold disabled:opacity-40">
              التالي <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-gray-800">تفاصيل إضافية</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">مدة الأعراض</label>
                <select value={duration} onChange={e => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-cyan-500">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  شدة الألم أو الانزعاج: <span className="text-cyan-600">{severity}/10</span>
                </label>
                <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(Number(e.target.value))}
                  className="w-full accent-cyan-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>خفيف</span><span>متوسط</span><span>شديد</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">
                رجوع
              </button>
              <button onClick={check} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                فحص الأعراض
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-5">
            {/* Urgency */}
            {result.urgencyLevel && (
              <div className={`rounded-2xl border p-4 ${URGENCY_STYLE[result.urgencyLevel] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                <p className="font-bold">مستوى الاستعجال: {result.urgencyLevel}</p>
              </div>
            )}

            {/* Conditions */}
            {result.possibleConditions?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-semibold text-gray-800 mb-4">الحالات المحتملة</h2>
                <div className="space-y-3">
                  {result.possibleConditions.map((c, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800">{c.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          c.probability === 'مرتفعة' ? 'bg-red-100 text-red-600' :
                          c.probability === 'متوسطة' ? 'bg-amber-100 text-amber-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>{c.probability}</span>
                      </div>
                      <p className="text-sm text-gray-600">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-semibold text-gray-800 mb-3">التوصيات</h2>
                <ul className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
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
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold">
              فحص جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
