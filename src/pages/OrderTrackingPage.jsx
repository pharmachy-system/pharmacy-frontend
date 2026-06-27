import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, CheckCircle, Truck, Clock, AlertCircle, Loader2, XCircle } from "lucide-react";
import { trackOrder } from "../api/orders";

const STATUS_STEPS = [
  { key: "pending",    title: "تم استلام الطلب",    desc: "جاري مراجعة طلبك",            icon: CheckCircle },
  { key: "confirmed",  title: "تم تأكيد الطلب",     desc: "طلبك مؤكد لدى الصيدلية",      icon: CheckCircle },
  { key: "processing", title: "جاري التحضير",        desc: "الصيدلاني يجهّز طلبك",         icon: Package },
  { key: "shipped",    title: "في الطريق إليك",      desc: "المندوب في طريقه",             icon: Truck },
  { key: "delivered",  title: "تم التسليم",          desc: "تم تسليم الطلب بنجاح",         icon: CheckCircle },
];

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await trackOrder(id);
        setTracking(data.tracking || data.data?.tracking || null);
      } catch (err) {
        setError(err.response?.data?.message || "فشل تحميل بيانات التتبع");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-[#1FB5C9]" />
    </div>
  );

  if (error || !tracking) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
      <XCircle className="w-12 h-12 text-red-400" />
      <p className="text-gray-600">{error || "بيانات التتبع غير متاحة"}</p>
      <Link to={"/orders/" + id}
        className="px-6 py-2.5 rounded-xl text-white font-bold text-sm"
        style={{ background: "linear-gradient(135deg,#0f3460,#1FB5C9)" }}>
        تفاصيل الطلب
      </Link>
    </div>
  );

  const currentIdx = STATUS_ORDER.indexOf(tracking.status);
  const isCancelled = tracking.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#f7f9fc]" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/orders/" + id)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#0f3460]">تتبع الطلب</h1>
            <p className="text-sm text-gray-500 font-mono">{tracking.orderNumber || id}</p>
          </div>
        </motion.div>

        {/* Status Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 mb-6 text-white"
          style={{ background: isCancelled ? "#ef4444" : "linear-gradient(135deg,#0f3460,#1FB5C9)", boxShadow: "0 4px 20px rgba(31,181,201,0.3)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">حالة الطلب</p>
              <p className="text-2xl font-black">
                {isCancelled ? "ملغي" : STATUS_STEPS[currentIdx]?.title || tracking.status}
              </p>
              {tracking.estimatedArrival && (
                <p className="text-white/80 text-sm mt-1">
                  الوصول المتوقع: {new Date(tracking.estimatedArrival).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              {isCancelled ? <AlertCircle className="w-8 h-8 text-white" /> : <Truck className="w-8 h-8 text-white" />}
            </div>
          </div>
          {tracking.driver && (
            <div className="mt-4 rounded-xl p-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div>
                <p className="text-xs text-white/60">المندوب</p>
                <p className="text-sm font-bold">{tracking.driver.name || "—"}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Progress Steps */}
        {!isCancelled && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h2 className="font-black text-[#0f3460] mb-5">مراحل الطلب</h2>
            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isDone = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const isLast = i === STATUS_STEPS.length - 1;
              const historyEntry = tracking.timeline?.find(t => t.status === step.key);
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 " +
                      (isDone ? "text-white" : "bg-gray-100")}
                      style={isDone ? { background: "linear-gradient(135deg,#0f3460,#1FB5C9)" } : {}}>
                      <Icon className={"w-5 h-5 " + (isDone ? "text-white" : "text-gray-300")} />
                    </div>
                    {!isLast && (
                      <div className={"w-0.5 h-10 mt-1 rounded-full " + (isDone ? "bg-[#1FB5C9]" : "bg-gray-200")} />
                    )}
                  </div>
                  <div className={"pb-6 " + (isLast ? "pb-0" : "")}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={"font-bold text-sm " + (isDone ? "text-[#0f3460]" : "text-gray-400")}>{step.title}</p>
                      {isCurrent && (
                        <span className="text-xs bg-cyan-100 text-[#1FB5C9] px-2 py-0.5 rounded-full font-bold">الآن</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                    {historyEntry?.timestamp && (
                      <p className="text-xs text-gray-300 mt-0.5">
                        {new Date(historyEntry.timestamp).toLocaleString("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link to={"/orders/" + id}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-gray-200 text-[#0f3460] font-bold hover:bg-gray-50 transition-all text-sm">
            <Package className="w-4 h-4" />
            تفاصيل الطلب
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
