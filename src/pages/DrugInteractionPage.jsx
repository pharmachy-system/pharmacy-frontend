import { useState, useRef } from "react";
import {
  AlertTriangle, CheckCircle2, XCircle, Search,
  Plus, X, Zap, Shield, Info, Loader2, ChevronDown
} from "lucide-react";

/* ─── Severity config ─── */
const SEVERITY = {
  severe: {
    label: "خطير — تجنّب التزامن",
    labelEn: "SEVERE",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: XCircle,
    pulse: true,
  },
  moderate: {
    label: "متوسط — استشر طبيبك",
    labelEn: "MODERATE",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: AlertTriangle,
    pulse: false,
  },
  minor: {
    label: "خفيف — مراقبة فقط",
    labelEn: "MINOR",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    icon: Info,
    pulse: false,
  },
  none: {
    label: "لا تداخل مكتشف",
    labelEn: "SAFE",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: CheckCircle2,
    pulse: false,
  },
};

/* ─── System prompt for Claude ─── */
const SYSTEM_PROMPT = `أنت صيدلاني ذكاء اصطناعي متخصص في فحص التداخلات الدوائية.
عند إعطائك قائمة أدوية، قيّم التداخلات بينها وأعد JSON فقط بهذا الشكل بالضبط (بدون أي نص خارج JSON):
{
  "pairs": [
    {
      "drug1": "اسم الدواء الأول",
      "drug2": "اسم الدواء الثاني",
      "severity": "severe|moderate|minor|none",
      "mechanism": "آلية التداخل بالعربية (جملة واحدة)",
      "effect": "التأثير السريري بالعربية",
      "recommendation": "التوصية للمريض بالعربية",
      "source": "FDA|WHO|عام"
    }
  ],
  "summary": "ملخص قصير جداً بالعربية",
  "overallRisk": "severe|moderate|minor|none"
}
إذا لم يكن هناك تداخل بين زوج ما، اذكره مع severity: "none".
كن دقيقاً طبياً وواضحاً للمريض العادي.`;

export default function DrugInteractionChecker() {
  const [drugs, setDrugs]       = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState(null);
  const inputRef = useRef();

  /* add drug chip */
  const addDrug = () => {
    const val = input.trim();
    if (!val || drugs.includes(val) || drugs.length >= 8) return;
    setDrugs(d => [...d, val]);
    setInput("");
    setResult(null);
    setError("");
    inputRef.current?.focus();
  };

  const removeDrug = (d) => {
    setDrugs(prev => prev.filter(x => x !== d));
    setResult(null);
  };

  /* call Claude API */
  const check = async () => {
    if (drugs.length < 2) { setError("أضف دواءين على الأقل للفحص"); return; }
    setLoading(true); setError(""); setResult(null); setExpanded(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{
            role: "user",
            content: `Analyze drug interactions for: ${drugs.join(", ")}`
          }]
        })
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("حدث خطأ أثناء الفحص، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  const overall = result ? SEVERITY[result.overallRisk] || SEVERITY.none : null;

  return (
    <div dir="rtl" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, background: "rgba(31,181,201,0.08)", border: "1px solid rgba(31,181,201,0.22)", color: "#0e8a9e", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 18 }}>
          <Zap style={{ width: 14, height: 14 }} /> مدعوم بالذكاء الاصطناعي
        </div>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(1.7rem,3vw,2.4rem)", color: "#07111f", marginBottom: 10, lineHeight: 1.15 }}>
          فاحص التداخلات الدوائية
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: 480, margin: "0 auto" }}>
          أضف الأدوية التي تتناولها وسيكتشف الذكاء الاصطناعي أي تداخلات محتملة بينها فوراً
        </p>
      </div>

      {/* ── Input Area ── */}
      <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1.5px solid #e8f4f8", marginBottom: 20, boxShadow: "0 4px 24px rgba(31,181,201,0.07)" }}>

        {/* drug chips */}
        {drugs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {drugs.map(d => (
              <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: "rgba(31,181,201,0.09)", border: "1px solid rgba(31,181,201,0.25)", color: "#0e6e82", fontWeight: 700, fontSize: "0.85rem" }}>
                💊 {d}
                <button onClick={() => removeDrug(d)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#94a3b8", padding: 0, marginRight: 2 }}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* input row */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#94a3b8" }} />
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addDrug()}
              placeholder="اكتب اسم الدواء واضغط Enter أو +"
              style={{ width: "100%", padding: "13px 46px 13px 14px", borderRadius: 14, border: "1.5px solid #dde8f0", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", color: "#07111f", background: "#f8fbfd", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#1FB5C9"}
              onBlur={e => e.target.style.borderColor = "#dde8f0"}
            />
          </div>
          <button onClick={addDrug} disabled={!input.trim() || drugs.length >= 8}
            style={{ width: 48, height: 48, borderRadius: 14, background: input.trim() ? "linear-gradient(135deg,#1FB5C9,#0d8498)" : "#e2e8f0", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            <Plus style={{ width: 20, height: 20, color: input.trim() ? "#fff" : "#94a3b8" }} />
          </button>
        </div>

        {drugs.length > 0 && drugs.length < 2 && (
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 10, marginBottom: 0 }}>أضف دواء آخر على الأقل للبدء بالفحص</p>
        )}
      </div>

      {/* error */}
      {error && (
        <div style={{ padding: "12px 18px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.88rem", fontWeight: 600, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* CHECK BUTTON */}
      {drugs.length >= 2 && !loading && (
        <button onClick={check}
          style={{ width: "100%", padding: "16px", borderRadius: 16, background: "linear-gradient(135deg,#1FB5C9,#0d8498)", border: "none", color: "#fff", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 8px 28px rgba(31,181,201,0.32)", transition: "transform 0.2s", fontFamily: "inherit", marginBottom: 24 }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          <Shield style={{ width: 20, height: 20 }} />
          فحص التداخلات الآن
        </button>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", marginBottom: 24 }}>
          <Loader2 style={{ width: 40, height: 40, color: "#1FB5C9", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>يتحقق الذكاء الاصطناعي من قاعدة بيانات الأدوية…</p>
        </div>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <div>

          {/* Overall status banner */}
          <div style={{ padding: "18px 24px", borderRadius: 18, background: overall.bg, border: `1.5px solid ${overall.border}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
            {overall.pulse ? (
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${overall.color}22`, animation: "ripple 1.5s ease-out infinite", position: "absolute", inset: -6 }} />
                <overall.icon style={{ width: 30, height: 30, color: overall.color, position: "relative", zIndex: 1 }} />
              </div>
            ) : (
              <overall.icon style={{ width: 28, height: 28, color: overall.color, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: "1.05rem", color: overall.color }}>{overall.label}</div>
              <div style={{ fontSize: "0.88rem", color: "#475569", marginTop: 3 }}>{result.summary}</div>
            </div>
            <span style={{ padding: "4px 12px", borderRadius: 99, background: overall.color, color: "#fff", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.08em", flexShrink: 0 }}>
              {overall.labelEn}
            </span>
          </div>

          {/* Pairs list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.pairs?.map((pair, i) => {
              const sev = SEVERITY[pair.severity] || SEVERITY.none;
              const isOpen = expanded === i;
              return (
                <div key={i} style={{ background: "#fff", borderRadius: 18, border: `1.5px solid ${isOpen ? sev.border : "#eef2f7"}`, overflow: "hidden", transition: "border-color 0.2s", boxShadow: isOpen ? `0 4px 20px ${sev.color}18` : "none" }}>

                  {/* pair header */}
                  <button onClick={() => setExpanded(isOpen ? null : i)}
                    style={{ width: "100%", padding: "16px 20px", background: isOpen ? sev.bg : "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, fontFamily: "inherit", transition: "background 0.2s" }}>
                    <sev.icon style={{ width: 22, height: 22, color: sev.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#07111f" }}>
                        {pair.drug1} <span style={{ color: "#94a3b8", fontWeight: 600 }}>+</span> {pair.drug2}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: sev.color, fontWeight: 700, marginTop: 2 }}>{sev.label}</div>
                    </div>
                    <ChevronDown style={{ width: 18, height: 18, color: "#94a3b8", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }} />
                  </button>

                  {/* expanded details */}
                  {isOpen && (
                    <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${sev.border}` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                        {[
                          { label: "⚗️ آلية التداخل", value: pair.mechanism },
                          { label: "🩺 التأثير السريري", value: pair.effect },
                        ].map((item, j) => (
                          <div key={j} style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fbfc", border: "1px solid #eef2f7" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>{item.label}</div>
                            <div style={{ fontSize: "0.87rem", color: "#1e293b", fontWeight: 600, lineHeight: 1.55 }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                      {/* recommendation */}
                      <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, background: sev.bg, border: `1px solid ${sev.border}` }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: sev.color, marginBottom: 6, letterSpacing: "0.04em" }}>✅ توصيتنا</div>
                        <div style={{ fontSize: "0.9rem", color: "#1e293b", fontWeight: 700, lineHeight: 1.6 }}>{pair.recommendation}</div>
                      </div>
                      {pair.source && (
                        <div style={{ marginTop: 8, fontSize: "0.72rem", color: "#94a3b8", textAlign: "left" }}>
                          المصدر: {pair.source}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* disclaimer */}
          <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 14, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Info style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              هذه النتائج للإرشاد فقط ولا تُغني عن استشارة الصيدلاني أو الطبيب المختص. صيدلية الأنصار غير مسؤولة عن قرارات طبية مبنية على هذه الأداة وحدها.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes ripple { 0% { transform:scale(1); opacity:.6 } 100% { transform:scale(2.4); opacity:0 } }
      `}</style>
    </div>
  );
}