import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Package, ThumbsUp } from "lucide-react";

const FILTERS = ["All", "5 Stars", "4 Stars", "3 Stars", "Low Rated"];

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [reviews] = useState([]);

  const filtered = reviews.filter(function(r) {
    if (filter === "All") return true;
    if (filter === "5 Stars") return r.rating === 5;
    if (filter === "4 Stars") return r.rating === 4;
    if (filter === "3 Stars") return r.rating === 3;
    if (filter === "Low Rated") return r.rating <= 2;
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce(function(s, r) { return s + r.rating; }, 0) / reviews.length).toFixed(1)
    : 0;

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
            <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </motion.div>

        {/* Stats */}
        {reviews.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-5 mb-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Average Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-4xl font-bold">{avgRating}</p>
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-100 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold mt-1">{reviews.length}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {FILTERS.map(function(f) {
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={"px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                  (filter === f ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50")}>
                {f}
              </button>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-yellow-300" />
            </div>
            <p className="text-gray-500 font-medium">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-1">Rate your orders to help others</p>
          </motion.div>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {filtered.map(function(review, i) {
            return (
              <motion.div key={review.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{review.productName}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(function(s) {
                      return (
                        <Star key={s}
                          className={"w-4 h-4 " + (s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")} />
                      );
                    })}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>
                )}
                {review.helpful > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{review.helpful} people found this helpful</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
