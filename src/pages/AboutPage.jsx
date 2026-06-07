import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, Award, Heart, Users, Package } from "lucide-react";

const STATS = [
  { label: "Products",     value: "10,000+", icon: Package },
  { label: "Customers",    value: "50,000+", icon: Users },
  { label: "Cities",       value: "15+",     icon: Truck },
  { label: "Satisfaction", value: "98%",     icon: Heart },
];

const VALUES = [
  { icon: Shield, title: "Trust & Safety",   desc: "All products are sourced from licensed suppliers and verified pharmaceutical distributors." },
  { icon: Award,  title: "Quality First",    desc: "We maintain the highest standards of quality in every product we offer." },
  { icon: Heart,  title: "Patient Care",     desc: "Your health and wellbeing is our top priority in everything we do." },
  { icon: Truck,  title: "Fast Delivery",    desc: "Same-day delivery available across major cities in Saudi Arabia." },
];

export default function AboutPage() {
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
          <h1 className="text-xl font-bold text-gray-900">About Us</h1>
        </motion.div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Ansar Pharmacy</h2>
          <p className="text-cyan-100 text-sm leading-relaxed">
            Saudi Arabia's leading AI-powered digital pharmacy platform. We connect patients with trusted medications, health products, and pharmaceutical  all in one place.expertise 
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6">
          {STATS.map(function(stat, i) {
            var Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="p-2.5 bg-cyan-50 rounded-xl">
                  <Icon className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Our Mission</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To make quality healthcare accessible to every Saudi household through technology, trust, and innovation. We leverage AI to personalize your health journey and ensure you get the right products at the right time.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-bold text-gray-900 mb-3">Our Values</h2>
          <div className="space-y-3">
            {VALUES.map(function(val, i) {
              var Icon = val.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
                  <div className="p-2.5 bg-cyan-50 rounded-xl flex-shrink-0">
                    <Icon className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{val.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{val.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
