import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: "By accessing and using Ansar Pharmacy platform, you accept and agree to be bound by the terms and provision of this agreement."
  },
  {
    title: "Use of Service",
    content: "You agree to use our platform only for lawful purposes. You must not use our service in any way that breaches any applicable local, national, or international law or regulation."
  },
  {
    title: "Account Responsibility",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
  },
  {
    title: "Orders and Payments",
    content: "All orders are subject to availability and confirmation. We reserve the right to refuse any order. Payment must be completed before order processing begins."
  },
  {
    title: "Prescription Medications",
    content: "Prescription medications require a valid prescription from a licensed healthcare provider. We reserve the right to verify prescriptions before dispensing."
  },
  {
    title: "Delivery",
    content: "Delivery times are estimates only. We are not responsible for delays caused by circumstances beyond our control. Risk of loss passes to you upon delivery."
  },
  {
    title: "Returns and Refunds",
    content: "Due to the nature of pharmaceutical products, returns are only accepted for damaged or incorrect items. Please contact support within 24 hours of receiving your order."
  },
  {
    title: "Limitation of Liability",
    content: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our service."
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms."
  },
];

export default function TermsPage() {
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
            <h1 className="text-xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last updated: June 2026</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Terms of Service</p>
              <p className="text-blue-100 text-sm">Please read these terms carefully before using our platform.</p>
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
