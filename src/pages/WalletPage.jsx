import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Clock } from "lucide-react";

const FILTERS = ["All", "Top Up", "Spent", "Refund"];

const typeConfig = {
  topup:  { icon: ArrowDownLeft, color: "text-green-500", bg: "bg-green-50", sign: "+" },
  spent:  { icon: ArrowUpRight,  color: "text-red-500",   bg: "bg-red-50",   sign: "-" },
  refund: { icon: ArrowDownLeft, color: "text-blue-500",  bg: "bg-blue-50",  sign: "+" },
};

export default function WalletPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [transactions] = useState([]);
  const balance = 0.00;

  const filtered = transactions.filter(t =>
    filter === "All" ? true :
    filter === "Top Up" ? t.type === "topup" :
    filter === "Spent" ? t.type === "spent" :
    t.type === "refund"
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
          <h1 className="text-xl font-bold text-gray-900">My Wallet</h1>
        </motion.div>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 mb-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">Ansar Wallet</span>
          </div>
          <p className="text-cyan-100 text-sm mb-1">Available Balance</p>
          <p className="text-4xl font-bold">{balance.toFixed(2)} <span className="text-xl font-normal text-cyan-200">SAR</span></p>
          <button className="mt-5 w-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-xl py-2.5 flex items-center justify-center gap-2 font-semibold text-sm">
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <ArrowDownLeft className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Added</p>
              <p className="font-bold text-gray-900">0.00 SAR</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Spent</p>
              <p className="font-bold text-gray-900">0.00 SAR</p>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Transactions</h2>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={"px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                  (filter === f ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50")}>
                {f}
              </button>
            ))}
          </div>

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-gray-400 text-sm mt-1">Your transaction history will appear here</p>
            </div>
          )}

          {/* List */}
          <div className="space-y-2">
            {filtered.map((tx) => {
              const cfg = typeConfig[tx.type] || typeConfig.spent;
              const Icon = cfg.icon;
              return (
                <div key={tx.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={"p-2.5 rounded-xl " + cfg.bg}>
                      <Icon className={"w-5 h-5 " + cfg.color} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{tx.title}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <p className={"font-bold " + cfg.color}>{cfg.sign}{tx.amount.toFixed(2)} SAR</p>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
