import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Tag, Copy, Check, Clock, Zap, Shield, Gift } from "lucide-react";

const FILTERS = ["All", "Discounts", "Free Delivery", "Flash Sales"];

const typeConfig = {
  discount: { icon: Tag,    bg: "from-orange-400 to-red-500" },
  delivery: { icon: Zap,    bg: "from-cyan-400 to-blue-500" },
  flash:    { icon: Clock,  bg: "from-purple-400 to-pink-500" },
  gift:     { icon: Gift,   bg: "from-green-400 to-emerald-500" },
};

export default function OffersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [offers] = useState([]);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = offers.filter(o =>
    filter === "All" ? true :
    filter === "Discounts" ? o.type === "discount" :
    filter === "Free Delivery" ? o.type === "delivery" :
    o.type === "flash"
  );

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
            <h1 className="text-xl font-bold text-gray-900">Offers & Coupons</h1>
            <p className="text-sm text-gray-500">{offers.length} available offers</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={"px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                (filter === f ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50")}>
              {f}
            </button>
          ))}
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-orange-300" />
            </div>
            <p className="text-gray-500 font-medium">No offers available</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for new deals</p>
          </motion.div>
        )}

        {/* Offers List */}
        <div className="space-y-4">
          {filtered.map((offer, i) => {
            const cfg = typeConfig[offer.type] || typeConfig.discount;
            const Icon = cfg.icon;
            const isCopied = copiedId === offer.id;
            return (
              <motion.div key={offer.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className={"bg-gradient-to-r " + cfg.bg + " p-4 flex items-center justify-between"}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{offer.discount}</p>
                      <p className="text-white text-opacity-80 text-xs">{offer.title}</p>
                    </div>
                  </div>
                  {offer.badge && (
                    <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{offer.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-1.5">
                      <span className="text-sm font-mono font-bold text-gray-700">{offer.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{offer.expiry}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(offer.id, offer.code)}
                        className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all " +
                          (isCopied ? "bg-green-500 text-white" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm")}>
                        {isCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
