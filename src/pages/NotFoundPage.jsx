import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, ArrowLeft, Pill } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-pharmacy-blue to-slate-900 flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pharmacy-cyan/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-md">
        {/* Animated pill icon */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex w-24 h-24 rounded-3xl bg-white/5 border border-white/10 items-center justify-center mb-8 backdrop-blur-sm">
          <Pill className="w-12 h-12 text-pharmacy-cyan" />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[120px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-pharmacy-cyan to-blue-400 mb-0">
          404
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-black text-white mb-3">الصفحة غير موجودة</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            عذراً، الصفحة التي تبحث عنها لم تعد موجودة أو ربما تغيّر رابطها.
            يمكنك العودة للرئيسية أو تصفح منتجاتنا.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center">
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-pharmacy-cyan text-white font-bold text-sm shadow-xl shadow-pharmacy-cyan/30 hover:-translate-y-0.5 hover:shadow-pharmacy-cyan/50 transition-all">
            <Home className="w-4 h-4" /> الرئيسية
          </Link>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/20 text-white font-semibold text-sm hover:bg-white/8 transition-all">
            <ShoppingBag className="w-4 h-4" /> تصفح المنتجات
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap gap-4 justify-center">
          {[['حسابي', '/account'], ['طلباتي', '/orders'], ['الدعم', '/support']].map(([label, to]) => (
            <Link key={to} to={to}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-pharmacy-cyan transition-colors">
              <ArrowLeft className="w-3 h-3" /> {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
