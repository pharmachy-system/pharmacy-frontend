import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Loader2, Plus, RefreshCw } from 'lucide-react';
import { walletApi } from '../api/wallet';
import { toast } from 'sonner';

const FILTERS = ['الكل', 'إيداع', 'سحب', 'استرداد'];

const TYPE_CFG = {
  credit: { icon: ArrowDownLeft, color: 'text-emerald-600', bg: 'bg-emerald-50', sign: '+', label: 'إيداع'   },
  debit:  { icon: ArrowUpRight,  color: 'text-red-500',     bg: 'bg-red-50',     sign: '-', label: 'سحب'     },
  refund: { icon: ArrowDownLeft, color: 'text-blue-500',    bg: 'bg-blue-50',    sign: '+', label: 'استرداد' },
  topup:  { icon: ArrowDownLeft, color: 'text-emerald-600', bg: 'bg-emerald-50', sign: '+', label: 'إيداع'   },
  spent:  { icon: ArrowUpRight,  color: 'text-red-500',     bg: 'bg-red-50',     sign: '-', label: 'إنفاق'   },
};

export default function WalletPage() {
  const [wallet, setWallet]             = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('الكل');

  const load = async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.allSettled([walletApi.get(), walletApi.transactions()]);
      if (r1.status === 'fulfilled') setWallet(r1.value.wallet || r1.value.data || r1.value);
      if (r2.status === 'fulfilled') setTransactions(r2.value.transactions || r2.value.data || []);
    } catch { toast.error('فشل تحميل المحفظة'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = transactions.filter(t => {
    if (filter === 'الكل')    return true;
    if (filter === 'إيداع')   return t.type === 'credit' || t.type === 'topup';
    if (filter === 'سحب')     return t.type === 'debit'  || t.type === 'spent';
    if (filter === 'استرداد') return t.type === 'refund';
    return true;
  });

  const balance = wallet?.balance ?? 0;
  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 px-4 pt-8 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5" /> المحفظة
            </h1>
            <button onClick={load} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-3xl p-6 text-white">
            {loading ? (
              <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> جاري التحميل...</div>
            ) : (
              <>
                <p className="text-sm opacity-80 mb-1">الرصيد المتاح</p>
                <p className="text-4xl font-black mb-4">{Number(balance).toFixed(2)} <span className="text-xl">ر.س</span></p>
                <div className="flex gap-2 flex-wrap text-sm">
                  <div className="bg-white/10 rounded-xl px-3 py-2">إجمالي الإيداع: <strong>{Number(wallet?.totalCredit||0).toFixed(0)} ر.س</strong></div>
                  <div className="bg-white/10 rounded-xl px-3 py-2">إجمالي الإنفاق: <strong>{Number(wallet?.totalDebit||0).toFixed(0)} ر.س</strong></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-10 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button disabled className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-violet-600 text-white font-semibold text-sm shadow-sm opacity-60 cursor-not-allowed">
            <Plus className="w-4 h-4" /> إيداع رصيد
          </button>
          <button onClick={load} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm shadow-sm hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex gap-1 p-3 border-b border-gray-100">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter===f ? 'bg-violet-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {f}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">لا توجد معاملات</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((t, i) => {
                const cfg = TYPE_CFG[t.type] || TYPE_CFG.credit;
                const Icon = cfg.icon;
                return (
                  <div key={t._id||i} className="flex items-center gap-3 px-4 py-3.5">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{t.description || cfg.label}</p>
                      <p className="text-xs text-gray-400">{fmt(t.createdAt)}</p>
                    </div>
                    <span className={`font-bold text-sm ${cfg.color}`}>{cfg.sign}{Number(t.amount||0).toFixed(2)} ر.س</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
