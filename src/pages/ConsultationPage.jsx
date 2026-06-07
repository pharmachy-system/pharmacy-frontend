import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Clock, Star, Send, Paperclip } from "lucide-react";

const TOPICS = [
  "Drug Interaction",
  "Side Effects",
  "Dosage Question",
  "Prescription Inquiry",
  "General Health",
  "Other",
];

export default function ConsultationPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!topic || !message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="ltr">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-gray-500 text-sm mb-6">Our pharmacist will respond within 30 minutes</p>
          <button onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-md">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-gray-900">Pharmacy Consultation</h1>
            <p className="text-sm text-gray-500">Ask our licensed pharmacists</p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Clock,          label: "Response",  value: "~30 min" },
            { icon: Star,           label: "Rating",    value: "4.9/5" },
            { icon: MessageCircle,  label: "Available", value: "24/7" },
          ].map(function(item, i) {
            var Icon = item.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
                <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                  <Icon className="w-4 h-4 text-cyan-500" />
                </div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">New Consultation Request</h2>

          {/* Topic */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 mb-2 block">Topic</label>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map(function(t) {
                return (
                  <button key={t} onClick={() => setTopic(t)}
                    className={"px-3 py-2 rounded-xl border text-sm font-medium transition-all text-left " +
                      (topic === t ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Your Question</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your question in detail..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 resize-none"
            />
          </div>

          {/* Attachment */}
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-500 transition-all mb-5">
            <Paperclip className="w-4 h-4" />
            Attach prescription or photo (optional)
          </button>

          <button onClick={handleSubmit}
            disabled={!topic || !message.trim()}
            className={"w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 " +
              (topic && message.trim()
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed")}>
            <Send className="w-4 h-4" />
            Submit Request
          </button>
        </motion.div>

      </div>
    </div>
  );
}
