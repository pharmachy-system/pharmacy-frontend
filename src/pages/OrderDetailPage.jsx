import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, CheckCircle, Clock, ArrowRight,
  MapPin, Phone, Copy, ChevronDown, ChevronUp,
  RotateCcw, AlertCircle, Receipt, Loader2, XCircle,
} from "lucide-react";
import { getOrderById, cancelOrder } from "../api/orders";

const STATUS_MAP = {
  pending:    { label: "قيد الانتظار",  color: "text-yellow-600", bg: "bg-yellow-50",  icon: Clock },
  confirmed:  { label: "مؤكد",          color: "text-cyan-600",   bg: "bg-cyan-50",    icon: CheckCircle },
  processing: { label: "جاري التحضير",  color: "text-blue-600",   bg: "bg-blue-50",    icon: Package },
  shipped:    { label: "في الطريق",     color: "text-purple-600", bg: "bg-purple-50",  icon: Truck },
  delivered:  { label: "تم التسليم",    color: "text-green-600",  bg: "bg-green-50",   icon: CheckCircle },
  cancelled:  { label: "ملغي",          color: "text-red-600",    bg: "bg-red-50",     icon: AlertCircle },
};

const PAYMENT_LABELS = { card: "بطاقة بنكية", cash: "الدفع عند الاستلام", wallet: "محفظة" };

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showItems, setShowItems] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order || data.data?.order || null);
      } catch (err) {
        setError(err.response?.data?.message || "فشل تحميل تفاصيل الطلب");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    setCancelling(true);
    setCancelError("");
    try {
      const data = await cancelOrder(id, "إلغاء بطلب العميل");
      setOrder(data.order || data.data?.order || { ...order, status: "cancelled" });
    } catch (err) {
      setCancelError(err.response?.data?.message || "فشل إلغاء الطلب");
    } finally {
      setCancelling(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(order?.orderNumber || id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-[#1FB5C9]" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
      <XCircle className="w-12 h-12 text-red-400" />
      <p className="text-gray-600">{error || "الطلب غير موجود"}</p>
      <button onClick={() => navigate("/orders")}
        className="px-6 py-2.5 rounded-xl text-white font-bold text-sm"
        style={{ background: "linear-gradient(135deg,#0f3460,#1FB5C9)" }}>
        العودة لطلباتي
      </button>
    </div>
  );

  const cfg = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const StatusIcon = cfg.icon;
  const addr = order.shippingAddress || {};
  const canCancel = ["pending", "confirmed"].includes(order.status);

  return (
    <div className="min-h-screen bg-[#f7f9fc]" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/orders")}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#0f3460]">تفاصيل الطلب</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500 font-mono">
                {order.orderNumber || id.slice(-8).toUpperCase()}
              </span>
              <button onClick={copyId} className="text-[#1FB5C9] hover:text-[#0f3460]">
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-xs text-green-500">نُسخ!</span>}
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={"rounded-2xl p-5 mb-4 " + cfg.bg}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <StatusIcon className={"w-6 h-6 " + cfg.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500">حالة الطلب</p>
                <p className={"text-lg font-black " + cfg.color}>{cfg.label}</p>
              </div>
            </div>
            <Link to={"/orders/" + id + "/tracking"}
              className="flex items-center gap-1 text-sm text-[#1FB5C9] font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <Truck className="w-4 h-4" />
              تتبع
            </Link>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
          <button onClick={() => setShowItems(!showItems)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#1FB5C9]" />
              <span className="font-black text-[#0f3460]">المنتجات ({order.items?.length || 0})</span>
            </div>
            {showItems ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          <AnimatePresence>
            {showItems && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3">
                  {order.items?.map((item) => {
                    const med = typeof item.medicine === "object" ? item.medicine : null;
                    const img = item.image || med?.images?.[0] || null;
                    return (
                      <div key={item._id}
                        className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg,#e0f7fa,#e3f2fd)" }}>
                          {img
                            ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
                            : <Package className="w-5 h-5 text-[#1FB5C9]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0f3460] truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                        </div>
                        <p className="font-black text-sm text-[#1FB5C9] flex-shrink-0">
                          {(item.price * item.quantity).toFixed(2)} ريال
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Price Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="w-5 h-5 text-[#1FB5C9]" />
            <span className="font-black text-[#0f3460]">ملخص الدفع</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي</span>
              <span>{Number(order.subtotal || 0).toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>رسوم التوصيل</span>
              <span>{Number(order.deliveryFee || 0).toFixed(2)} ريال</span>
            </div>
            {order.vatAmount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>ضريبة القيمة المضافة</span>
                <span>{Number(order.vatAmount).toFixed(2)} ريال</span>
              </div>
            )}
            {(order.discount > 0 || order.couponDiscount > 0) && (
              <div className="flex justify-between text-green-600">
                <span>الخصم</span>
                <span>- {Number((order.discount || 0) + (order.couponDiscount || 0)).toFixed(2)} ريال</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-black text-[#0f3460] text-base">
              <span>الإجمالي</span>
              <span className="text-[#1FB5C9]">{Number(order.total || 0).toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between text-gray-500 text-xs pt-1">
              <span>طريقة الدفع</span>
              <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#1FB5C9]" />
            <span className="font-black text-[#0f3460]">عنوان التوصيل</span>
          </div>
          <p className="text-sm font-semibold text-[#0f3460] mb-1">{addr.fullName}</p>
          <p className="text-sm text-gray-600 mb-2">
            {[addr.street, addr.city, addr.country].filter(Boolean).join("، ")}
          </p>
          {addr.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span dir="ltr">{addr.phone}</span>
            </div>
          )}
          {order.notes && (
            <p className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">{order.notes}</p>
          )}
        </motion.div>

        {/* Cancel error */}
        {cancelError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {cancelError}
          </div>
        )}

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3">
          <Link to="/products"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg,#0f3460,#1FB5C9)", boxShadow: "0 4px 14px rgba(31,181,201,0.3)" }}>
            <RotateCcw className="w-4 h-4" />
            تسوق مجدداً
          </Link>
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-60">
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              إلغاء الطلب
            </button>
          )}
        </motion.div>

      </div>
    </div>
  );
}
