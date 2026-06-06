import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowRight, Shield, Truck, Clock, Award,
  Search, ChevronLeft, ChevronRight,
  Star, CheckCircle2, Package, RefreshCw, Headphones
} from "lucide-react";
import BestDealsSection from '../components/BestDealsSection';
import FlashSalesSection from '../components/FlashSalesSection';
import HealthConcernsSection from '../components/HealthConcernsSection';
import TestimonialsSection from '../components/TestimonialsSection';

/* ─── DATA ─── */
const heroSlides = [
  {
    id: 1,
    eyebrow: "صيدلية معتمدة · مرخّصة من وزارة الصحة",
    title: "صحتك تبدأ\nمن هنا.",
    desc: "آلاف الأدوية والمستلزمات الطبية بضغطة واحدة — موثوقة، سريعة، وبأسعار تنافسية",
    cta: "تسوّق الآن",
    ctaLink: "/products",
    secondary: "تصفح المنتجات",
    secondaryLink: "/products",
  },
  {
    id: 2,
    eyebrow: "أكثر من 5,000 منتج متوفر",
    title: "كل ما تحتاجه\nفي مكان واحد.",
    desc: "أدوية، فيتامينات، مستحضرات تجميل طبية، وأجهزة رعاية صحية لكل العائلة",
    cta: "تصفح المنتجات",
    ctaLink: "/products",
    secondary: "إنشاء حساب",
    secondaryLink: "/register",
  },
  {
    id: 3,
    eyebrow: "توصيل سريع خلال ساعتين",
    title: "موثوقية وأمان\nفي كل طلب.",
    desc: "جميع منتجاتنا معتمدة وصيادلتنا متاحون 24/7 للإجابة على استفساراتك",
    cta: "ابدأ الآن",
    ctaLink: "/register",
    secondary: "تعرّف علينا",
    secondaryLink: "/products",
  },
];

const trustBar = [
  { icon: Truck,       label: "شحن مجاني",         sub: "على الطلبات فوق 200 ريال" },
  { icon: RefreshCw,   label: "استرجاع 7 أيام",     sub: "بدون أسئلة" },
  { icon: Shield,      label: "دفع آمن 100%",       sub: "مشفّر ومحمي" },
  { icon: Headphones,  label: "دعم طبي 24/7",       sub: "صيادلة معتمدون" },
];

const categories = [
  { name: "أدوية مزمنة",    icon: "💊", count: "1,200+", bg: "#f0fafb" },
  { name: "فيتامينات",      icon: "🌿", count: "400+",   bg: "#f0fbf4" },
  { name: "تجميل طبي",     icon: "✨", count: "800+",   bg: "#fdf5ff" },
  { name: "أجهزة طبية",    icon: "🩺", count: "300+",   bg: "#fff8f0" },
  { name: "صحة الأطفال",   icon: "👶", count: "500+",   bg: "#fffbf0" },
  { name: "مكملات غذائية", icon: "💪", count: "600+",   bg: "#f5f0ff" },
];

const whyUs = [
  {
    num: "01",
    title: "منتجات معتمدة",
    body: "جميع منتجاتنا مرخّصة رسمياً من وزارة الصحة السعودية ومخزّنة بظروف مثالية.",
  },
  {
    num: "02",
    title: "توصيل خلال ساعتين",
    body: "نوصّل طلبك لباب بيتك خلال ساعتين — بتبريد كامل للأدوية الحساسة.",
  },
  {
    num: "03",
    title: "صيادلة في خدمتك",
    body: "فريق من الصيادلة المعتمدين جاهز 24/7 للإجابة على أي استفسار طبي.",
  },
];

const stats = [
  { value: "50,000+", label: "عميل سعيد" },
  { value: "5,000+",  label: "منتج متوفر" },
  { value: "2 ساعة",  label: "متوسط التوصيل" },
  { value: "99%",     label: "نسبة الرضا" },
];

/* ─── COMPONENT ─── */
export default function HomePage() {
  const { user } = useAuth();
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const timer = useRef(null);

  const go = (i) => {
    setVisible(false);
    setTimeout(() => { setSlide(i); setVisible(true); }, 280);
    clearInterval(timer.current);
    timer.current = setInterval(() => tick(), 6000);
  };

  const tick = () => {
    setVisible(false);
    setTimeout(() => { setSlide(s => (s + 1) % heroSlides.length); setVisible(true); }, 280);
  };

  useEffect(() => {
    timer.current = setInterval(tick, 6000);
    return () => clearInterval(timer.current);
  }, []);

  const s = heroSlides[slide];

  return (
    <div dir="rtl" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", background: "#ffffff", color: "#111" }}>

      {/* ══════════════════════════════════
          HERO — split layout, photo right
      ══════════════════════════════════ */}
      <section style={{ background: "#f8f9fa", minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>

        {/* soft radial bg */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 80% 50%, rgba(31,181,201,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}
          className="hero-grid">

          {/* LEFT — text */}
          <div style={{ transition: "opacity 0.28s ease", opacity: visible ? 1 : 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1FB5C9", marginBottom: 24 }}>
              {s.eyebrow}
            </p>
            <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.2rem)", fontWeight: 900, lineHeight: 1.08, color: "#0a1628", marginBottom: 24, whiteSpace: "pre-line" }}>
              {s.title}
            </h1>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "#64748b", maxWidth: 460, marginBottom: 40 }}>
              {s.desc}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <Link to={s.ctaLink} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: "0.95rem",
                background: "#0a1628", color: "#fff", textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(10,22,40,0.2)"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(10,22,40,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(10,22,40,0.2)"; }}>
                {s.cta} <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
              <Link to={s.secondaryLink} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 14, fontWeight: 600, fontSize: "0.92rem",
                color: "#0a1628", textDecoration: "none", border: "1.5px solid #d1d9e0",
                transition: "border-color 0.2s, background 0.2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1FB5C9"; e.currentTarget.style.background = "rgba(31,181,201,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d9e0"; e.currentTarget.style.background = ""; }}>
                {s.secondary}
              </Link>
            </div>

            {/* micro-badges */}
            <div style={{ display: "flex", gap: 20, marginTop: 36, flexWrap: "wrap" }}>
              {["مرخّصة وزارة الصحة", "دفع آمن", "استرجاع مجاني"].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: "#1FB5C9", flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — decorative visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", transition: "opacity 0.28s ease", opacity: visible ? 1 : 0 }}>
            <div style={{ position: "relative", width: 360, height: 360 }}>
              {/* main circle bg */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, rgba(31,181,201,0.12) 0%, rgba(27,61,111,0.08) 100%)" }} />
              {/* center icon */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 90, lineHeight: 1, marginBottom: 16 }}>💊</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0a1628" }}>صيدلية الأنصار</div>
                  <div style={{ fontSize: 13, color: "#1FB5C9", fontWeight: 600, marginTop: 6, letterSpacing: "0.08em" }}>ALANSAR PHARMACY</div>
                </div>
              </div>
              {/* floating stat cards */}
              {[
                { top: "8%",  right: "-18%", emoji: "🚀", text: "توصيل ساعتين" },
                { bottom: "12%", left: "-16%", emoji: "⭐", text: "تقييم 4.9/5" },
                { top: "42%", right: "-22%", emoji: "🔒", text: "دفع آمن" },
              ].map((card, i) => (
                <div key={i} style={{
                  position: "absolute", ...{ top: card.top, bottom: card.bottom, right: card.right, left: card.left },
                  background: "#fff", borderRadius: 14, padding: "10px 16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, fontWeight: 600, color: "#0a1628", whiteSpace: "nowrap",
                  border: "1px solid #f0f4f8"
                }}>
                  <span style={{ fontSize: 18 }}>{card.emoji}</span> {card.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* slide dots */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center", zIndex: 10 }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              borderRadius: 99, border: "none", cursor: "pointer", padding: 0,
              width: i === slide ? 28 : 10, height: 10,
              background: i === slide ? "#0a1628" : "#cbd5e1",
              transition: "all 0.3s"
            }} />
          ))}
        </div>

        {/* arrow nav */}
        {[
          { pos: "right", fn: () => go((slide - 1 + heroSlides.length) % heroSlides.length), Icon: ChevronRight },
          { pos: "left",  fn: () => go((slide + 1) % heroSlides.length),                    Icon: ChevronLeft },
        ].map(({ pos, fn, Icon }) => (
          <button key={pos} onClick={fn} style={{
            position: "absolute", [pos]: 20, top: "50%", transform: "translateY(-50%)",
            width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #e2e8f0",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)", transition: "box-shadow 0.2s"
          }}>
            <Icon style={{ width: 18, height: 18, color: "#64748b" }} />
          </button>
        ))}
      </section>

      {/* ══════════════════════════════════
          TRUST BAR
      ══════════════════════════════════ */}
      <section style={{ background: "#0a1628", padding: "0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
          className="trust-grid">
          {trustBar.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "24px 20px",
              borderLeft: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none"
            }}>
              <t.icon style={{ width: 22, height: 22, color: "#1FB5C9", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.label}</div>
                <div style={{ fontSize: 12, color: "rgba(203,213,225,0.55)", marginTop: 2 }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          SHOP BY CATEGORY
      ══════════════════════════════════ */}
      <section style={{ padding: "100px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1FB5C9", marginBottom: 10 }}>الفئات</p>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: "#0a1628", lineHeight: 1.15 }}>
              تسوّق حسب الفئة
            </h2>
            <p style={{ color: "#64748b", marginTop: 10, fontSize: "0.95rem" }}>كل ما تحتاجه في يوم صحي مثالي</p>
          </div>
          <Link to="/products" style={{
            display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.9rem", fontWeight: 600,
            color: "#0a1628", textDecoration: "none", borderBottom: "1.5px solid #0a1628", paddingBottom: 2
          }}>
            عرض كل المنتجات <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16 }} className="cat-grid">
          {categories.map((cat, i) => (
            <Link key={i} to="/products" style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "28px 16px", borderRadius: 20, textDecoration: "none",
              background: cat.bg, border: "1px solid transparent",
              transition: "all 0.25s", cursor: "pointer"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1FB5C9"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(31,181,201,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <span style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0a1628", textAlign: "center", marginBottom: 4 }}>{cat.name}</span>
              <span style={{ fontSize: 11, color: "#1FB5C9", fontWeight: 600 }}>{cat.count} منتج</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          WHY US — editorial 3-col
      ══════════════════════════════════ */}
      <section style={{ background: "#f8f9fa", padding: "100px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }} className="why-grid">
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1FB5C9", marginBottom: 14 }}>لماذا تختارنا</p>
              <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, color: "#0a1628", lineHeight: 1.15, marginBottom: 20 }}>
                خدمة استثنائية<br />في كل خطوة
              </h2>
              <p style={{ color: "#64748b", lineHeight: 1.75, fontSize: "0.92rem", marginBottom: 36 }}>
                نجمع بين التقنية الحديثة والرعاية الصيدلانية المتخصصة لنقدّم لك تجربة تسوق طبي لا مثيل لها.
              </p>
              <Link to="/products" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 26px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem",
                background: "#0a1628", color: "#fff", textDecoration: "none"
              }}>
                تسوّق الآن <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="why-cards">
              {whyUs.map((w, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", border: "1px solid #e8edf3" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color: "#cbd5e1", marginBottom: 20 }}>{w.num}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0a1628", marginBottom: 12 }}>{w.title}</h3>
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#64748b" }}>{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS STRIP
      ══════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #e8edf3", borderBottom: "1px solid #e8edf3", padding: "60px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }} className="stats-grid">
          {stats.map((st, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "0 24px",
              borderLeft: i < 3 ? "1px solid #e8edf3" : "none"
            }}>
              <div style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#0a1628", lineHeight: 1 }}>{st.value}</div>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: 8, fontWeight: 500 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA — full-bleed dark
      ══════════════════════════════════ */}
      <section style={{ background: "#0a1628", padding: "120px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(31,181,201,0.1), transparent)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1FB5C9", marginBottom: 20 }}>
            صيادلة في خدمتك
          </p>
          <h2 style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 22 }}>
            ابدأ رحلتك نحو<br />صحة أفضل.
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(203,213,225,0.72)", lineHeight: 1.75, marginBottom: 48, maxWidth: 520, margin: "0 auto 48px" }}>
            صيادلتنا المعتمدون متاحون 24/7 للإجابة على جميع أسئلتك الطبية — توصيل سريع لباب بيتك
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/products" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "15px 36px", borderRadius: 14, fontWeight: 700, fontSize: "0.95rem",
              background: "#1FB5C9", color: "#fff", textDecoration: "none",
              boxShadow: "0 0 36px rgba(31,181,201,0.35)", transition: "transform 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}>
              تصفح المنتجات <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            {!user && (
              <Link to="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 32px", borderRadius: 14, fontWeight: 600, fontSize: "0.92rem",
                color: "rgba(255,255,255,0.78)", textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.15)", transition: "background 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                إنشاء حساب مجاناً
              </Link>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid   { grid-template-columns: 1fr !important; }
          .trust-grid  { grid-template-columns: 1fr 1fr !important; }
          .cat-grid    { grid-template-columns: repeat(3,1fr) !important; }
          .why-grid    { grid-template-columns: 1fr !important; }
          .why-cards   { grid-template-columns: 1fr !important; }
          .stats-grid  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .cat-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <BestDealsSection />
      <FlashSalesSection />
      <HealthConcernsSection />
      <TestimonialsSection />
    </div>
  );
}