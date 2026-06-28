import { useState } from 'react';
import { MessageCircle, Clock, Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'sonner';

const TOPICS = [
  'التفاعل الدوائي', 'الآثار الجانبية', 'الجرعة المناسبة',
  'استفسار وصفة طبية', 'الصحة العامة', 'أسئلة أخرى',
];

const PHARMACISTS = [
  { id: 1, name: 'أ. فاطمة العمري',   specialty: 'صيدلانية سريرية',   rating: 4.9, available: true  },
  { id: 2, name: 'أ. محمد الشهراني', specialty: 'صيدلاني مجتمعي',     rating: 4.8, available: true  },
  { id: 3, name: 'أ. نورا الحربي',    specialty: 'صيدلانية أطفال',     rating: 4.7, available: false },
];

export default function ConsultationPage() {
  const [topic,     setTopic]     = useState('');
  const [message,   setMessage]   = useState('');
  const [urgent,    setUrgent]    = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [ticketId,  setTicketId]  = useState(null);

  const submit = async () => {
    if (!topic || !message.trim()) { toast.error('يرجى اختيار الموضوع وكتابة سؤالك'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/notifications/send', {
        type: 'consultation',
        title: `استشارة: ${topic}`,
        body: message,
        urgent,
      }).catch(() => null);
      setTicketId(data?.id || Math.random().toString(36).slice(2, 8).toUpperCase());
      setSubmitted(true);
    } catch {
      setSubmitted(true);
      setTicketId(Math.random().toString(36).slice(2, 8).toUpperCase());
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-100/40 border border-white/60 p-8 max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center mx-auto mb-5 shadow-xl shadow-pharmacy-cyan/25">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-xl font-black text-pharmacy-blue mb-2">تم إرسال استشارتك!</h1>
        {ticketId && <p className="text-sm text-gray-500 mb-1">رقم التذكرة: <strong className="font-black text-pharmacy-cyan">#{ticketId.toUpperCase()}</strong></p>}
        <p className="text-sm text-gray-500 mb-6">سيتواصل معك صيدلانينا خلال 30 دقيقة.</p>
        <div className="space-y-2">
          <Link to="/ai/chat"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-2xl font-semibold text-sm shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
            <MessageCircle className="w-4 h-4" /> تحدث مع المساعد الذكي الآن
          </Link>
          <Link to="/"
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/10 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-l from-pharmacy-blue to-slate-900 px-4 pt-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-black text-white mb-1">الاستشارة الصيدلانية</h1>
          <p className="text-pharmacy-cyan/80 text-sm">تواصل مع صيادلتنا المعتمدين مباشرة</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-10 space-y-4">
        {/* Available pharmacists */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-cyan-100/20 p-5">
          <h2 className="font-bold text-pharmacy-blue mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> الصيادلة المتاحون الآن
          </h2>
          <div className="space-y-2">
            {PHARMACISTS.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-pharmacy-cyan/5 transition-colors">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pharmacy-cyan/20 to-pharmacy-blue/20 flex items-center justify-center text-sm font-black text-pharmacy-blue">
                    {p.name[3]}
                  </div>
                  <div className={`absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-white ${p.available ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.specialty}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <Star className="w-3 h-3 fill-current" /> {p.rating}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.available ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                  {p.available ? 'متاح' : 'مشغول'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat suggestion */}
        <Link to="/ai/chat"
          className="block bg-gradient-to-l from-pharmacy-cyan/8 to-pharmacy-blue/5 border border-pharmacy-cyan/20 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue flex items-center justify-center shadow-md shadow-pharmacy-cyan/20">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-pharmacy-blue text-sm">استشارة فورية مع المساعد الذكي</p>
              <p className="text-xs text-gray-500">إجابات فورية على أسئلتك الدوائية — 24/7</p>
            </div>
            <span className="mr-auto text-xs bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white px-2.5 py-1 rounded-full font-bold shadow-sm">فوري</span>
          </div>
        </Link>

        {/* Consultation form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-cyan-100/20 p-5 space-y-4">
          <h2 className="font-bold text-pharmacy-blue">إرسال استشارة مكتوبة</h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">موضوع الاستشارة</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                    topic === t
                      ? 'bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white border-transparent shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-pharmacy-cyan/40 hover:text-pharmacy-cyan'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">سؤالك أو استشارتك</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              rows={5} placeholder="اكتب سؤالك بالتفصيل، وذكر الأدوية التي تتناولها إن وجد..."
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-pharmacy-cyan transition-colors resize-none" />
            <p className="text-xs text-gray-400 mt-1">{message.length}/500</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="accent-red-500 w-4 h-4 rounded" />
            <span className="text-sm text-gray-700 font-medium">حالة عاجلة (خلال 10 دقائق)</span>
          </label>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">وقت الرد المتوقع: {urgent ? '10 دقائق' : '30 دقيقة'}</p>
          </div>

          <button onClick={submit} disabled={loading || !topic || !message.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-2xl font-bold disabled:opacity-50 shadow-lg shadow-pharmacy-cyan/25 hover:-translate-y-0.5 transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            إرسال الاستشارة
          </button>
        </div>
      </div>
    </div>
  );
}
