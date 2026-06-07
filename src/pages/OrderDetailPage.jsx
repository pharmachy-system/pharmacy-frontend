import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, CheckCircle, Clock, ArrowRight,
  MapPin, Phone, Copy, ChevronDown, ChevronUp,
  RotateCcw, MessageCircle, Star, AlertCircle, Receipt
} from "lucide-react";

const statusConfig = {
  pending:    { label: "Pending",    color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
  processing: { label: "Processing", color: "text-blue-600",   bg: "bg-blue-50",   icon: Package },
  shipped:    { label: "Shipped",    color: "text-purple-600", bg: "bg-purple-50", icon: Truck },
  delivered:  { label: "Delivered",  color: "text-green-600",  bg: "bg-green-50",  icon: CheckCircle },
  cancelled:  { label: "Cancelled",  color: "text-red-600",    bg: "bg-red-50",    icon: AlertCircle },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showItems, setShowItems] = useState(true);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="ltr">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No order found</p>
          <button onClick={() => navigate("/orders")}
            className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition-all">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;
  const subtotal = order.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500">{order.id}</span>
              <button onClick={copyOrderId} className="text-cyan-500 hover:text-cyan-600">
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-xs text-green-500">Copied!</span>}
            </div>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={"rounded-2xl p-5 mb-4 " + cfg.bg}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <StatusIcon className={"w-6 h-6 " + cfg.color} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className={"text-lg font-bold " + cfg.color}>{cfg.label}</p>
              </div>
            </div>
            <Link to={"/orders/" + order.id + "/tracking"}
              className="flex items-center gap-1 text-sm text-cyan-600 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <Truck className="w-4 h-4" />
              Track
            </Link>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
          <button onClick={() => setShowItems(!showItems)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-500" />
              <span className="font-semibold text-gray-900">Items ({order.items?.length || 0})</span>
            </div>
            {showItems ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          <AnimatePresence>
            {showItems && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3">
                  {order.items?.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
                          <Package className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{(item.price * item.qty).toFixed(2)} SAR</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Price Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="w-5 h-5 text-cyan-500" />
            <span className="font-semibold text-gray-900">Payment Summary</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{subtotal.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span><span>{(order.deliveryFee || 0).toFixed(2)} SAR</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>- {order.discount.toFixed(2)} SAR</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>{(order.total || 0).toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-gray-500 text-xs">
              <span>Payment Method</span><span>{order.paymentMethod}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-cyan-500" />
            <span className="font-semibold text-gray-900">Delivery Info</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{order.address}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="w-4 h-4" />
            <span>{order.phone}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-l from-cyan-500 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
            <RotateCcw className="w-4 h-4" />
            Reorder
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
            <MessageCircle className="w-4 h-4" />
            Support
          </button>
          {order.status === "delivered" && (
            <button className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold hover:bg-yellow-100 transition-all">
              <Star className="w-4 h-4" />
              Rate Order
            </button>
          )}
        </motion.div>

      </div>
    </div>
  );
}
