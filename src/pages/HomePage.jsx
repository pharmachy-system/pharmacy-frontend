import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import useSEO from '../hooks/useSEO';
import {
  ArrowLeft, Shield, Truck, RefreshCw, Headphones,
  ChevronLeft, ChevronRight, CheckCircle2, Sparkles,
  Bot, FlaskConical, Stethoscope, Star, Package,
} from 'lucide-react';
import BestDealsSection from '../components/BestDealsSection';
import FlashSalesSection from '../components/FlashSalesSection';
import HealthConcernsSection from '../components/HealthConcernsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import MedicineRecommendations from '../components/MedicineRecommendations';

/* ─── Data ─── */
const heroSlides = [
  {
    id: 1,
    eyebrow: 'صيدلية معتمدة · مرخّصة من وزارة الصحة',
    title: 'صحتك تبدأ\nمن هنا.',
    desc: 'آلاف الأدوية والمستلزمات الطبية بضغطة واحدة — موثوقة، سريعة، وبأسعار تنافسية',
    cta: 'تسوّق الآن',
    ctaLink: '/products',
    secondary: 'تصفح المنتجات',
    secondaryLink: '/products',
    badge: ['مرخّصة وزارة الصحة', 'دفع آمن 100٪', 'استرجاع 7 أيام'],
  },
  {
    id: 2,
    eyebrow: 'أكثر من 5,000 منتج متوفر',
    title: 'كل ما تحتاجه\nفي مكان واحد.',
    desc: 'أدوية، فيتامينات، مستحضرات تجميل طبية، وأجهزة رعاية صحية لكل العائلة',
    cta: 'تصفح المنتجات',
    ctaLink: '/products',
    secondary: 'إنشاء حساب',
    secondaryLink: '/register',
    badge: ['5,000+ منتج', 'أسعار تنافسية', 'توصيل سريع'],
  },
  {
    id: 3,
    eyebrow: 'توصيل سريع خلال ساعتين',
    title: 'موثوقية وأمان\nفي كل طلب.',
    desc: 'جميع منتجاتنا معتمدة وصيادلتنا متاحون 24/7 للإجابة على استفساراتك',
    cta: 'ابدأ الآن',
    ctaLink: '/register',
    secondary: 'تعرّف علينا',
    secondaryLink: '/about',
    badge: ['توصيل خلال ساعتين', 'صيادلة 24/7', 'جودة مضمونة'],
  },
];

const trustItems = [
  { icon: Truck,      label: 'شحن مجاني',       sub: 'فوق 200 ريال' },
  { icon: RefreshCw,  label: 'استرجاع 7 أيام',   sub: 'بدون أسئلة' },
  { icon: Shield,     label: 'دفع آمن 100٪',      sub: 'مشفّر ومحمي' },
  { icon: Headphones, label: 'دعم طبي 24/7',      sub: 'صيادلة معتمدون' },
];

const categories = [
  { name: 'أدوية مزمنة',    icon: '💊', count: '1,200+', color: 'from-cyan-50 to-blue-50',    border: 'hover:border-cyan-300'   },
  { name: 'فيتامينات',      icon: '🌿', count: '400+',   color: 'from-emerald-50 to-green-50', border: 'hover:border-emerald-300' },
  { name: 'تجميل طبي',     icon: '✨', count: '800+',   color: 'from-purple-50 to-pink-50',   border: 'hover:border-purple-300'  },
  { name: 'أجهزة طبية',    icon: '🩺', count: '300+',   color: 'from-orange-50 to-amber-50',  border: 'hover:border-orange-300'  },
  { name: 'صحة الأطفال',   icon: '👶', count: '500+',   color: 'from-yellow-50 to-lime-50',   border: 'hover:border-yellow-300'  },
  { name: 'مكملات غذائية', icon: '💪', count: '600+',   color: 'from-indigo-50 to-blue-50',   border: 'hover:border-indigo-300'  },
];

const whyUs = [
  { num: '01', icon: '🏥', title: 'منتجات معتمدة',      body: 'جميع منتجاتنا مرخّصة رسمياً من وزارة الصحة السعودية ومخزّنة بظروف مثالية.' },
  { num: '02', icon: '🚀', title: 'توصيل خلال ساعتين', body: 'نوصّل طلبك لباب بيتك خلال ساعتين — بتبريد كامل للأدوية الحساسة.' },
  { num: '03', icon: '👨‍⚕️', title: 'صيادلة في خدمتك',  body: 'فريق من الصيادلة المعتمدين جاهز 24/7 للإجابة على أي استفسار طبي.' },
];

const stats = [
  { value: '50,000+', label: 'عميل سعيد',         icon: Star },
  { value: '5,000+',  label: 'منتج متوفر',         icon: Package },
  { value: '2 ساعة',  label: 'متوسط التوصيل',      icon: Truck },
  { value: '99٪',     label: 'نسبة الرضا',          icon: CheckCircle2 },
];

const aiFeatures = [
  { icon: Bot,           title: 'المساعد الطبي',    desc: 'اسأل عن الأدوية والجرعات مباشرة',   to: '/ai/chat' },
  { icon: Stethoscope,   title: 'فاحص الأعراض',    desc: 'صف أعراضك واحصل على توجيه فوري',    to: '/ai/symptom-checker' },
  { icon: FlaskConical,  title: 'تفاعلات دوائية',  desc: 'تحقق من التعارضات بين الأدوية',      to: '/drug-interactions' },
];

/* ─── Reusable section header ─── */
function SectionLabel({ eyebrow, title, sub }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-3">{eyebrow}</span>
      <h2 className="text-3xl sm:text-4xl font-black text-pharmacy-blue leading-tight mb-3">{title}</h2>
      {sub && <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">{sub}</p>}
    </div>
  );
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  useSEO({ title: 'الرئيسية', description: 'صيدلية الأنصار — أدويتك وفيتاميناتك ومستلزماتك الطبية بأفضل الأسعار مع توصيل سريع' });
  const { user } = useAuth();
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const timer = useRef(null);

  const go = (i) => {
    setVisible(false);
    setTimeout(() => { setSlide(i); setVisible(true); }, 260);
    clearInterval(timer.current);
    timer.current = setInterval(tick, 6000);
  };

  const tick = () => {
    setVisible(false);
    setTimeout(() => { setSlide(s => (s + 1) % heroSlides.length); setVisible(true); }, 260);
  };

  useEffect(() => {
    timer.current = setInterval(tick, 6000);
    return () => clearInterval(timer.current);
  }, []);

  const s = heroSlides[slide];

  return (
    <div dir="rtl" className="bg-white text-gray-900 overflow-x-hidden">

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-pharmacy-blue to-slate-900">
        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pharmacy-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pharmacy-cyan/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
              <p className="text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-5">{s.eyebrow}</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.06] whitespace-pre-line mb-6">
                {s.title}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg mb-10">{s.desc}</p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to={s.ctaLink}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm bg-pharmacy-cyan text-white shadow-lg shadow-pharmacy-cyan/30 hover:shadow-pharmacy-cyan/50 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                  {s.cta} <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link to={s.secondaryLink}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-sm border border-white/20 text-white hover:bg-white/8 transition-all">
                  {s.secondary}
                </Link>
              </div>

              <div className="flex flex-wrap gap-5">
                {s.badge.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-pharmacy-cyan flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visual side */}
          <div className="hidden lg:flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.45 }}
                className="relative w-80 h-80">
                {/* Center circle */}
                <div className="absolute inset-0 rounded-full border border-white/8 bg-gradient-to-br from-white/5 to-pharmacy-cyan/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">💊</div>
                    <p className="text-white font-black text-lg">صيدلية الأنصار</p>
                    <p className="text-pharmacy-cyan text-xs font-semibold tracking-widest uppercase mt-1">ALANSAR PHARMACY</p>
                  </div>
                </div>
                {/* Floating cards */}
                {[
                  { pos: 'top-0 -right-14', emoji: '🚀', text: 'توصيل ساعتين', delay: 0 },
                  { pos: 'bottom-8 -left-14', emoji: '⭐', text: 'تقييم 4.9/5', delay: 0.15 },
                  { pos: 'top-1/2 -right-20 -translate-y-1/2', emoji: '🔒', text: 'دفع آمن', delay: 0.3 },
                ].map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + c.delay, duration: 0.4 }}
                    className={`absolute ${c.pos} flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/60 text-sm font-semibold text-pharmacy-blue whitespace-nowrap`}>
                    <span className="text-base">{c.emoji}</span> {c.text}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`rounded-full border-0 cursor-pointer transition-all duration-300 ${
                i === slide ? 'w-8 h-2.5 bg-pharmacy-cyan' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`} />
          ))}
        </div>

        {/* Arrow nav */}
        <button onClick={() => go((slide - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={() => go((slide + 1) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </section>

      {/* ════════════════ TRUST BAR ════════════════ */}
      <section className="bg-gradient-to-r from-pharmacy-blue to-slate-900 py-0">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4">
          {trustItems.map((t, i) => (
            <div key={i} className={`flex items-center gap-4 py-6 px-5 ${i < 3 ? 'border-l border-white/10' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-pharmacy-cyan/15 flex items-center justify-center flex-shrink-0">
                <t.icon className="w-5 h-5 text-pharmacy-cyan" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ CATEGORIES ════════════════ */}
      <section className="py-24 px-6 max-w-screen-xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-2 block">الفئات</span>
              <h2 className="text-3xl sm:text-4xl font-black text-pharmacy-blue leading-tight">تسوّق حسب الفئة</h2>
              <p className="text-gray-500 mt-2 text-sm">كل ما تحتاجه في يوم صحي مثالي</p>
            </div>
            <Link to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pharmacy-blue border-b-2 border-pharmacy-blue pb-0.5 hover:text-pharmacy-cyan hover:border-pharmacy-cyan transition-colors">
              عرض كل المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <Link to="/products"
                className={`group flex flex-col items-center justify-center py-8 px-4 rounded-2xl bg-gradient-to-br ${cat.color} border border-transparent ${cat.border} hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer`}>
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-sm font-bold text-pharmacy-blue text-center mb-1">{cat.name}</span>
                <span className="text-xs text-pharmacy-cyan font-semibold">{cat.count} منتج</span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════ RECOMMENDATIONS ════════════════ */}
      <MedicineRecommendations />

      {/* ════════════════ BEST DEALS / FLASH SALES ════════════════ */}
      <BestDealsSection />
      <FlashSalesSection />

      {/* ════════════════ AI FEATURES STRIP ════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-950 via-pharmacy-blue to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pharmacy-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-screen-xl mx-auto text-center mb-12">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-3">
              <Sparkles className="w-3.5 h-3.5" /> ذكاء اصطناعي طبي
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">مساعدك الطبي الذكي</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">احصل على إجابات طبية دقيقة فوراً — بدون انتظار</p>
          </FadeIn>
        </div>
        <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {aiFeatures.map((f, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Link to={f.to}
                className="group bg-white/8 hover:bg-white/14 backdrop-blur-sm border border-white/12 hover:border-pharmacy-cyan/40 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-pharmacy-cyan/20 flex items-center justify-center mb-4 group-hover:bg-pharmacy-cyan/30 transition-colors">
                  <f.icon className="w-6 h-6 text-pharmacy-cyan" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════ WHY US ════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeIn>
              <span className="text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-4 block">لماذا تختارنا</span>
              <h2 className="text-3xl sm:text-4xl font-black text-pharmacy-blue leading-tight mb-5">
                خدمة استثنائية<br />في كل خطوة
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-sm sm:text-base">
                نجمع بين التقنية الحديثة والرعاية الصيدلانية المتخصصة لنقدّم لك تجربة تسوق طبي لا مثيل لها.
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white shadow-lg shadow-pharmacy-cyan/20 hover:shadow-pharmacy-cyan/40 hover:-translate-y-0.5 transition-all">
                تسوّق الآن <ArrowLeft className="w-4 h-4" />
              </Link>
            </FadeIn>
            <div className="grid grid-cols-1 gap-5">
              {whyUs.map((w, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pharmacy-cyan/30 transition-all group">
                    <div className="text-3xl">{w.icon}</div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">{w.num}</span>
                      <h3 className="font-bold text-pharmacy-blue mt-1 mb-1.5">{w.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{w.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS ════════════════ */}
      <section className="py-16 border-y border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-0">
          {stats.map((st, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`text-center py-8 px-4 ${i < 3 ? 'border-l border-gray-100' : ''}`}>
                <div className="inline-flex w-11 h-11 rounded-xl bg-pharmacy-cyan/10 items-center justify-center mb-4">
                  <st.icon className="w-5 h-5 text-pharmacy-cyan" />
                </div>
                <p className="text-4xl font-black text-pharmacy-blue mb-2">{st.value}</p>
                <p className="text-sm text-gray-400 font-medium">{st.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════ HEALTH CONCERNS + TESTIMONIALS ════════════════ */}
      <HealthConcernsSection />
      <TestimonialsSection />

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden bg-gradient-to-br from-slate-950 via-pharmacy-blue to-slate-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pharmacy-cyan/8 rounded-full blur-[100px]" />
        </div>
        <FadeIn className="relative max-w-2xl mx-auto text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-pharmacy-cyan mb-4 block">صيادلة في خدمتك</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            ابدأ رحلتك نحو<br />صحة أفضل.
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            صيادلتنا المعتمدون متاحون 24/7 — توصيل سريع لباب بيتك بأمان تام
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-pharmacy-cyan text-white shadow-xl shadow-pharmacy-cyan/30 hover:shadow-pharmacy-cyan/50 hover:-translate-y-0.5 transition-all">
              تصفح المنتجات <ArrowLeft className="w-4 h-4" />
            </Link>
            {!user && (
              <Link to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border border-white/20 text-white hover:bg-white/8 transition-all">
                إنشاء حساب مجاناً
              </Link>
            )}
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
