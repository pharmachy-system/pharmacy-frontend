import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";

const CONTACT_INFO = [
  { icon: Phone,  label: "Phone",    value: "+966 50 000 0000",        color: "text-green-500",  bg: "bg-green-50" },
  { icon: Mail,   label: "Email",    value: "support@ansar.com.sa",    color: "text-blue-500",   bg: "bg-blue-50" },
  { icon: MapPin, label: "Address",  value: "Madinah, Saudi Arabia",   color: "text-red-500",    bg: "bg-red-50" },
  { icon: Clock,  label: "Hours",    value: "Sat-Thu: 8AM - 12AM",     color: "text-orange-500", bg: "bg-orange-50" },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSend = () => {
    if (!form.name || !form.message) return;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

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
            <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
            <p className="text-sm text-gray-500">We would love to hear from you</p>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6">
          {CONTACT_INFO.map(function(item, i) {
            var Icon = item.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-2 " + item.bg}>
                  <Icon className={"w-5 h-5 " + item.color} />
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Send a Message</h2>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
              <input value={form.email} type="email" onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Your email"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="How can we help you?"
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 resize-none" />
            </div>
          </div>

          <button onClick={handleSend}
            className={"w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 " +
              (sent ? "bg-green-500 text-white" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg")}>
            {sent ? <><Check className="w-4 h-4" /> Message Sent!</> : <><Send className="w-4 h-4" /> Send Message</>}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
