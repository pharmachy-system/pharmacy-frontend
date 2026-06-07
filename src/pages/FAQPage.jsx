import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, Search } from "lucide-react";

const CATEGORIES = ["All", "Orders", "Delivery", "Payments", "Prescriptions", "Account"];

const FAQS = [
  { category: "Orders", q: "How do I place an order?", a: "Browse products, add them to your cart, and proceed to checkout. You can pay using multiple payment methods." },
  { category: "Orders", q: "Can I modify my order after placing it?", a: "Orders can be modified within 10 minutes of placement. Contact support immediately if you need changes." },
  { category: "Orders", q: "How do I cancel an order?", a: "Go to My Orders, select the order, and tap Cancel. Cancellation is only available within 15 minutes of placing the order." },
  { category: "Delivery", q: "How long does delivery take?", a: "Standard delivery takes 2-4 hours. Express delivery is available within 1 hour in select areas." },
  { category: "Delivery", q: "Do you deliver to my area?", a: "We currently deliver across major cities in Saudi Arabia. Enter your address at checkout to check availability." },
  { category: "Delivery", q: "How do I track my delivery?", a: "Go to My Orders and tap Track Order to see real-time updates on your delivery status." },
  { category: "Payments", q: "What payment methods do you accept?", a: "We accept credit/debit cards, Apple Pay, STC Pay, Mada, and Ansar Wallet." },
  { category: "Payments", q: "Is my payment information secure?", a: "Yes. All payment data is encrypted and processed through certified payment gateways. We never store card details." },
  { category: "Payments", q: "How do refunds work?", a: "Approved refunds are processed within 3-5 business days back to your original payment method or Ansar Wallet." },
  { category: "Prescriptions", q: "How do I upload a prescription?", a: "Go to My Prescriptions and tap Upload. Take a clear photo of your prescription and submit it for review." },
  { category: "Prescriptions", q: "How long does prescription review take?", a: "Our pharmacists review prescriptions within 30 minutes during working hours." },
  { category: "Prescriptions", q: "Can I reorder prescription medications?", a: "Yes, go to My Prescriptions and tap Reorder on any approved prescription." },
  { category: "Account", q: "How do I change my password?", a: "Go to Account Settings and tap Change Password. You will receive a verification code on your registered phone." },
  { category: "Account", q: "How do I delete my account?", a: "Contact our support team to request account deletion. All your data will be permanently removed within 30 days." },
  { category: "Account", q: "How do loyalty points work?", a: "Earn 1 point for every 1 SAR spent. Points can be redeemed for discounts and free delivery." },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = FAQS.filter(function(faq) {
    var matchCat = category === "All" || faq.category === category;
    var matchSearch = search === "" || faq.q.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FAQ</h1>
            <p className="text-sm text-gray-500">Frequently Asked Questions</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100"
          />
        </motion.div>

        {/* Categories */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {CATEGORIES.map(function(cat) {
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                className={"px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                  (category === cat ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50")}>
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-3">{filtered.length} question{filtered.length !== 1 ? "s" : ""}</p>

        {/* FAQ List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No questions found</p>
            </div>
          )}
          {filtered.map(function(faq, i) {
            var isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-all">
                  <div className="flex-1 pr-4">
                    <span className="text-xs text-cyan-500 font-medium">{faq.category}</span>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{faq.q}</p>
                  </div>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}
