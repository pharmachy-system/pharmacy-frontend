import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Pill, RefreshCw, Mic } from 'lucide-react';
import API from '../api/axios';
import { toast } from 'sonner';

const SUGGESTIONS = [
  'ما هي أعراض نزلة البرد؟',
  'ما الفرق بين الباراسيتامول والإيبوبروفين؟',
  'كيف أعرف إذا كنت بحاجة لمضاد حيوي؟',
  'ما هي الجرعة الآمنة من الفيتامين C؟',
  'ما أعراض ارتفاع ضغط الدم؟',
];

const DISCLAIMER = 'تنبيه: هذا المساعد للأغراض التثقيفية فقط ولا يُغني عن استشارة الطبيب.';

export default function AIMedicalChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: 'مرحباً! أنا مساعدك الطبي الذكي. يمكنني مساعدتك في الأسئلة المتعلقة بالأدوية والصحة العامة. كيف يمكنني مساعدتك اليوم؟',
      time: new Date().toISOString(),
    }
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
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
      // Call the AI endpoint (backend can proxy to Anthropic/OpenAI)
      const { data } = await API.post('/ai/chat', {
        message: msg,
        history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      });
      const reply = data.reply || data.message || data.content || 'عذراً، لم أتمكن من الإجابة الآن.';
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, time: new Date().toISOString() }]);
    } catch (err) {
      // Graceful fallback — show a helpful offline response
      const fallbacks = [
        `شكراً على سؤالك عن "${msg}". للحصول على معلومات دقيقة، يُنصح باستشارة صيدلي أو طبيب مختص. يمكنك أيضاً استخدام أداة التفاعلات الدوائية في تطبيقنا.`,
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

  const fmt = (iso) => new Date(iso).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-800">المساعد الطبي الذكي</h1>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> متصل
          </p>
        </div>
        <button onClick={reset} className="mr-auto p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-700">{DISCLAIMER}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-cyan-600' : 'bg-gray-100'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-500" />}
            </div>
            <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-sm'
                  : msg.isError
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 rounded-tl-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 px-1">{fmt(msg.time)}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-500" />
            </div>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2">أسئلة مقترحة:</p>
          <div className="flex gap-2 flex-wrap">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-cyan-400 transition-colors px-4 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="اكتب سؤالك الطبي..."
              rows={1}
              className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none leading-relaxed placeholder-gray-400"
              style={{ maxHeight: '100px' }}
            />
          </div>
          <button onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          مدعوم بالذكاء الاصطناعي • للأغراض التعليمية فقط
        </p>
      </div>
    </div>
  );
}
