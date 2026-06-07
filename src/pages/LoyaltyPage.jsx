import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Award, Zap, ChevronRight, Lock } from "lucide-react";

const TIERS = [
  { id: "bronze",   label: "Bronze",   min: 0,     max: 999,  emoji: "Bronze",   gradient: "from-orange-300 to-orange-400" },
  { id: "silver",   label: "Silver",   min: 1000,  max: 4999, emoji: "Silver",   gradient: "from-gray-300 to-gray-400" },
  { id: "gold",     label: "Gold",     min: 5000,  max: 9999, emoji: "Gold",     gradient: "from-yellow-300 to-yellow-400" },
  { id: "platinum", label: "Platinum", min: 10000, max: null, emoji: "Platinum", gradient: "from-cyan-400 to-blue-500" },
];

const REWARDS = [
  { id: 1, title: "5 SAR Discount",  points: 500,  icon: Gift },
  { id: 2, title: "10 SAR Discount", points: 1000, icon: Gift },
  { id: 3, title: "Free Delivery",   points: 750,  icon: Zap },
  { id: 4, title: "25 SAR Discount", points: 2500, icon: Award },
];

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const [points] = useState(0);

  const currentTier = TIERS.find(function(t) {
    return points >= t.min && (t.max === null || points <= t.max);
  }) || TIERS[0];

  const currentIndex = TIERS.indexOf(currentTier);
  const nextTier = TIERS[currentIndex + 1] || null;
  const progress = nextTier
    ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

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
          <h1 className="text-xl font-bold text-gray-900">Loyalty Points</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={"bg-gradient-to-br " + currentTier.gradient + " rounded-2xl p-6 mb-5 text-white shadow-lg"}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Current Tier</p>
              <p className="text-2xl font-bold">{currentTier.label}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Your Points</p>
              <p className="text-3xl font-bold">{points}</p>
            </div>
          </div>

          {nextTier && (
            <div>
              <div className="flex justify-between text-xs opacity-80 mb-1">
                <span>{points} pts</span>
                <span>{nextTier.min} pts to {nextTier.label}</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: progress + "%" }}
                />
              </div>
            </div>
          )}

          {!nextTier && (
            <p className="text-sm opacity-80 mt-2">You have reached the highest tier!</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 mb-5"
        >
          <h2 className="font-bold text-gray-900 mb-4">Membership Tiers</h2>
          <div className="grid grid-cols-4 gap-2">
            {TIERS.map(function(tier) {
              var isActive = tier.id === currentTier.id;
              return (
                <div
                  key={tier.id}
                  className={"rounded-xl p-3 text-center " + (isActive ? "bg-gradient-to-br " + tier.gradient + " text-white shadow-md" : "bg-gray-50")}
                >
                  <p className={"text-xs font-semibold mt-1 " + (isActive ? "text-white" : "text-gray-600")}>{tier.label}</p>
                  <p className={"text-xs mt-0.5 " + (isActive ? "text-white opacity-80" : "text-gray-400")}>
                    {tier.min >= 1000 ? (tier.min / 1000) + "k" : tier.min}+
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-gray-900 mb-3">Redeem Rewards</h2>
          <div className="space-y-3">
            {REWARDS.map(function(reward, i) {
              var Icon = reward.icon;
              var canRedeem = points >= reward.points;
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={"bg-white rounded-2xl border p-4 flex items-center justify-between " + (canRedeem ? "border-gray-100" : "border-gray-100 opacity-60")}
                >
                  <div className="flex items-center gap-3">
                    <div className={"p-2.5 rounded-xl " + (canRedeem ? "bg-cyan-50" : "bg-gray-50")}>
                      <Icon className={"w-5 h-5 " + (canRedeem ? "text-cyan-500" : "text-gray-400")} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{reward.title}</p>
                      <p className="text-xs text-gray-400">{reward.points} points required</p>
                    </div>
                  </div>
                  <button
                    disabled={!canRedeem}
                    className={"flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all " + (canRedeem ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed")}
                  >
                    {canRedeem
                      ? <><ChevronRight className="w-4 h-4" /> Redeem</>
                      : <><Lock className="w-3.5 h-3.5" /> Locked</>
                    }
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
