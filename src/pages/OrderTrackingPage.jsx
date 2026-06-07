import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package, CheckCircle, Truck, Phone, MessageCircle } from "lucide-react";

const STEPS = [
  { id: 1, title: "Order Confirmed", desc: "Your order has been received", icon: CheckCircle },
  { id: 2, title: "Preparing", desc: "Pharmacist is preparing your order", icon: Package },
  { id: 3, title: "On the Way", desc: "Driver is heading to you", icon: Truck },
  { id: 4, title: "Delivered", desc: "Order delivered successfully", icon: CheckCircle },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
            <p className="text-sm text-gray-500">{id}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-5 mb-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Estimated Delivery</p>
              <p className="text-3xl font-bold mt-1">-- min</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-4 bg-white bg-opacity-10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-cyan-100">Driver</p>
                <p className="text-sm font-semibold">--</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all">
                <Phone className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all">
                <MessageCircle className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-6"
        >
          <h2 className="font-bold text-gray-900 mb-5">Order Progress</h2>
          <div>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === STEPS.length - 1;
              const isDone = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 " + (isDone ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md" : "bg-gray-100")}>
                      <Icon className={"w-5 h-5 " + (isDone ? "text-white" : "text-gray-400")} />
                    </div>
                    {!isLast && (
                      <div className={"w-0.5 h-10 mt-1 " + (isDone ? "bg-cyan-400" : "bg-gray-200")} />
                    )}
                  </div>
                  <div className={"pb-6 " + (isLast ? "pb-0" : "")}>
                    <div className="flex items-center gap-2">
                      <p className={"font-semibold " + (isDone ? "text-gray-900" : "text-gray-400")}>{step.title}</p>
                      {isCurrent && (
                        <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full font-medium">Now</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to={"/orders/" + id}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            <Package className="w-4 h-4" />
            View Order Details
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
