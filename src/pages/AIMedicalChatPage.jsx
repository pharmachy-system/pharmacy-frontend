import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';

const SUGGESTIONS = [
  'ما هي أعراض نزلة البرد؟',
  'ما الفرق بين الباراسيتامول والإيبوبروفين؟',
  'كيف أعرف إذا كنت بحاجة لمضاد حيوي؟',
  'ما هي الجرعة الآمنة من الفيتامين C؟',
  'ما أعراض ارتفاع ضغط الدم؟',
];

export default function AIMedicalChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: 'مرحباً! أنا مساعدك الطبي الذكي. يمكنني مساعدتك في الأسئلة المتعلقة بالأدوية والصحة العامة. كيف يمكنني مساعدتك اليوم؟',
      time: new Date().toISOString(),
    }
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', content: msg, time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const { data } = await API.post('/ai/chat', {
        message: msg,
        history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      });
      const reply = data.reply || data.message || data.content || 'عذراً، لم أتمكن من الإجابة الآن.';
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, time: new Date().toISOString() }]);
    } catch (err) {
      const fallbacks = [
        `شكراً على سؤالك عن "${msg}". للحصول على معلومات دقيقة، يُنصح باستشارة صيدلي أو طبيب مختص.`,
        'خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى المحاولة لاحقاً أو التواصل مع صيدلانينا مباشرة.',
      ];
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: err.response?.status === 404 ? fallbacks[0] : fallbacks[1],
        time: new Date().toISOString(),
        isError: err.response?.status !== 404,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const reset = () => {
    setMessages([{
      id: Date.now(), role: 'assistant',
      content: 'تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟',
      time: new Date().toISOString(),
    }]);
  };

  const fmt = iso => new Date(iso).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50/30">

      {/* Header */}
      <div className="bg-gradient-to-l from-pharmacy-blue to-slate-900 px-4 py-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
          <Bot className="w-5 h-5 text-pharmacy-cyan" />
        </div>
        <div>
          <h1 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pharmacy-cyan" /> المساعد الطبي الذكي
          </h1>
          <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> متاح دائماً
          </p>
        </div>
        <button onClick={reset} className="mr-auto p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50/80 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-700">تنبيه: هذا المساعد للأغراض التثقيفية فقط ولا يُغني عن استشارة الطبيب.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-pharmacy-cyan to-pharmacy-blue shadow-sm'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-pharmacy-cyan" />
                }
              </div>
              <div className={`max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white rounded-tr-sm shadow-md shadow-pharmacy-cyan/20'
                    : msg.isError
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 rounded-tl-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 px-1">{fmt(msg.time)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Bot className="w-4 h-4 text-pharmacy-cyan" />
            </div>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3.5">
              <div className="flex gap-1.5 items-center">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-pharmacy-cyan/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2 font-medium">أسئلة مقترحة:</p>
          <div className="flex gap-2 flex-wrap">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-pharmacy-cyan hover:text-pharmacy-cyan transition-colors shadow-sm">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="flex gap-2 items-end max-w-2xl mx-auto">
          <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-pharmacy-cyan focus-within:bg-white transition-all px-4 py-2.5">
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="اكتب سؤالك الطبي..."
              rows={1} className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none leading-relaxed placeholder-gray-400"
              style={{ maxHeight: '100px' }} />
          </div>
          <button onClick={() => send()} disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:-translate-y-0.5 transition-all shadow-md shadow-pharmacy-cyan/20">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">مدعوم بالذكاء الاصطناعي • للأغراض التعليمية فقط</p>
      </div>
    </div>
  );
}
