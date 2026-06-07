import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bell, Package, Tag, Info, Truck, Check, Trash2 } from "lucide-react";

const FILTERS = ["All", "Orders", "Offers", "System"];

const typeConfig = {
  order:  { icon: Package, bg: "bg-blue-50",   color: "text-blue-500" },
  offer:  { icon: Tag,     bg: "bg-orange-50", color: "text-orange-500" },
  system: { icon: Info,    bg: "bg-gray-50",   color: "text-gray-500" },
  delivery: { icon: Truck, bg: "bg-green-50",  color: "text-green-500" },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);

  const filtered = notifications.filter(n =>
    filter === "All" ? true :
    filter === "Orders" ? n.type === "order" || n.type === "delivery" :
    filter === "Offers" ? n.type === "offer" :
    n.type === "system"
  );

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteOne = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-cyan-500 font-medium">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm text-cyan-600 font-medium bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-all">
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={"px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all " +
                (filter === f ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50")}>
              {f}
            </button>
          ))}
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">You are all caught up!</p>
          </motion.div>
        )}

        {/* List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notif) => {
              const cfg = typeConfig[notif.type] || typeConfig.system;
              const Icon = cfg.icon;
              return (
                <motion.div key={notif.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                  onClick={() => markRead(notif.id)}
                  className={"bg-white rounded-2xl border p-4 cursor-pointer transition-all " +
                    (!notif.read ? "border-cyan-200 shadow-sm" : "border-gray-100")}>
                  <div className="flex items-start gap-3">
                    <div className={"p-2.5 rounded-xl flex-shrink-0 " + cfg.bg}>
                      <Icon className={"w-5 h-5 " + cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={"text-sm font-semibold " + (!notif.read ? "text-gray-900" : "text-gray-600")}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notif.read && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                          <button onClick={e => { e.stopPropagation(); deleteOne(notif.id); }}
                            className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
