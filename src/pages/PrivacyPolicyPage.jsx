import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, delivery address, and payment information."
  },
  {
    title: "How We Use Your Information",
    content: "We use the information we collect to process your orders, send you order confirmations and updates, provide customer support, improve our services, and send you promotional communications (with your consent)."
  },
  {
    title: "Information Sharing",
    content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with delivery partners and payment processors solely to fulfill your orders."
  },
  {
    title: "Data Security",
    content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
  },
  {
    title: "Cookies",
    content: "We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and understand where our visitors are coming from."
  },
  {
    title: "Your Rights",
    content: "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us."
  },
  {
    title: "Contact Us",
    content: "If you have any questions about this Privacy Policy, please contact us through the support page or via our official contact channels."
  },
];

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: June 2026</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Your Privacy Matters</p>
              <p className="text-cyan-100 text-sm">We are committed to protecting your personal information.</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {SECTIONS.map((section, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
