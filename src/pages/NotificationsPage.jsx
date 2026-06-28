import { useEffect, useState } from 'react';
import { Bell, Package, Tag, Info, Truck, Trash2, CheckCheck, Loader2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = [
  { id: 'all',    label: 'الكل'   },
  { id: 'order',  label: 'الطلبات' },
  { id: 'offer',  label: 'العروض'  },
  { id: 'system', label: 'النظام'  },
];

const TYPE_CFG = {
  order:    { icon: Package, bg: 'bg-blue-50',    color: 'text-blue-500'    },
  delivery: { icon: Truck,   bg: 'bg-emerald-50', color: 'text-emerald-500' },
  offer:    { icon: Tag,     bg: 'bg-amber-50',   color: 'text-amber-500'   },
  system:   { icon: Info,    bg: 'bg-gray-50',    color: 'text-gray-500'    },
};

export default function NotificationsPage() {
  const { notifications, loading, fetchNotifications, markRead, markAllRead, deleteNotification, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchNotifications(); }, []);

  const filtered = notifications.filter(n => {
    if (filter === 'all')    return true;
    if (filter === 'order')  return n.type === 'order' || n.type === 'delivery';
    if (filter === 'offer')  return n.type === 'offer';
    if (filter === 'system') return n.type === 'system' || !n.type;
    return true;
  });

  const unread = notifications.filter(n => !n.read).length;

  const fmtTime = iso => {
    if (!iso) return '';
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60)    return 'الآن';
    if (diff < 3600)  return `${Math.floor(diff/60)} دقيقة`;
    if (diff < 86400) return `${Math.floor(diff/3600)} ساعة`;
    return new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-white via-cyan-50/10 to-blue-50/5 pb-8">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-pharmacy-cyan" />
            الإشعارات
            {unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-pharmacy-cyan hover:underline">
                <CheckCheck className="w-3.5 h-3.5" /> قراءة الكل
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-400 hover:underline">
                <Trash2 className="w-3.5 h-3.5" /> مسح الكل
              </button>
            )}
          </div>
        </div>
        <div className="max-w-lg mx-auto mt-3 flex gap-1 bg-gray-100 rounded-xl p-1">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter===f.id ? 'bg-white text-pharmacy-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">لا توجد إشعارات</p>
            <p className="text-sm mt-1">ستظهر هنا إشعارات طلباتك وعروضك</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map(n => {
                const cfg = TYPE_CFG[n.type] || TYPE_CFG.system;
                const Icon = cfg.icon;
                return (
                  <motion.div key={n._id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                    onClick={() => !n.read && markRead(n._id)}
                    className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${n.read ? 'bg-white border-gray-100' : 'bg-pharmacy-cyan/5 border-pharmacy-cyan/15'}`}>
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold leading-snug ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-pharmacy-cyan flex-shrink-0 mt-1" />}
                      </div>
                      {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-gray-400 mt-1">{fmtTime(n.createdAt)}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteNotification(n._id); }}
                      className="p-1 rounded-lg text-gray-300 hover:text-red-400 flex-shrink-0 self-start">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
