import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Send, Package, CreditCard, Truck, RotateCcw, HelpCircle } from "lucide-react";

const FAQS = [
  { q: "How do I track my order?", a: "Go to My Orders and tap on your order to see real-time tracking updates." },
  { q: "Can I cancel my order?", a: "You can cancel your order within 15 minutes of placing it. Go to My Orders and tap Cancel." },
  { q: "How do I upload a prescription?", a: "Go to My Prescriptions and tap the upload button to take a photo or choose from your gallery." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, Apple Pay, STC Pay, and Ansar Wallet." },
  { q: "How long does delivery take?", a: "Standard delivery takes 2-4 hours. Express delivery is available within 1 hour in select areas." },
];

const TOPICS = [
  { id: "order",    label: "Order Issue",    icon: Package },
  { id: "payment",  label: "Payment",        icon: CreditCard },
  { id: "delivery", label: "Delivery",       icon: Truck },
  { id: "return",   label: "Return/Refund",  icon: RotateCcw },
  { id: "other",    label: "Other",          icon: HelpCircle },
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTopic("");
    setTimeout(() => setSent(false), 3000);
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
            <h1 className="text-xl font-bold text-gray-900">Support</h1>
            <p className="text-sm text-gray-500">We are here to help</p>
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: MessageCircle, label: "Live Chat",  color: "text-cyan-500",   bg: "bg-cyan-50" },
            { icon: Phone,         label: "Call Us",    color: "text-green-500",  bg: "bg-green-50" },
            { icon: Mail,          label: "Email",      color: "text-blue-500",   bg: "bg-blue-50" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all">
                <div className={"p-3 rounded-xl " + item.bg}>
                  <Icon className={"w-5 h-5 " + item.color} />
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-50 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left transition-all">
                <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Send a Message</h2>

          <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-3">
            {TOPICS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTopic(t.id)}
                  className={"flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all " +
                    (topic === t.id ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe your issue..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 resize-none mb-4"
          />

          <button onClick={handleSend}
            className={"w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 " +
              (sent ? "bg-green-500 text-white" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg")}>
            {sent ? "Message Sent!" : <><Send className="w-4 h-4" /> Send Message</>}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
