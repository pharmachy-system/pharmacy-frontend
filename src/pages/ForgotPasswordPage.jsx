// src/pages/ForgotPasswordPage.jsx
// صفحة استعادة كلمة المرور

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await forgotPassword({ email });
    setLoading(false);
    if (result.success) setSent(true);
    else setError(result.error);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50" dir="rtl">
      <div className="absolute top-10 -right-20 w-72 h-72 bg-pharmacy-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pharmacy-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center mb-4">
              <img src="/logo.png" alt="Ansar" className="h-14 w-auto" />
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-100/50 border border-white/60 p-6 sm:p-8">
            {!sent ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mb-3">
                    <KeyRound className="w-8 h-8 text-pharmacy-cyan" />
                  </div>
                  <h1 className="text-2xl font-bold text-pharmacy-blue">نسيت كلمة المرور؟</h1>
                  <p className="text-gray-600 mt-2 text-sm">
                    أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@email.com"
                        dir="ltr"
                        className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all text-left"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        إرسال الرابط
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-pharmacy-blue mb-2">تم الإرسال!</h2>
                <p className="text-gray-600 mb-6">
                  أرسلنا رابط إعادة تعيين كلمة المرور إلى
                  <br />
                  <span className="font-bold text-pharmacy-blue" dir="ltr">
                    {email}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  تحقق من بريدك الإلكتروني واتبع التعليمات
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-pharmacy-cyan hover:text-pharmacy-blue font-semibold"
                >
                  العودة لتسجيل الدخول
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}
          </div>

          {!sent && (
            <p className="text-center mt-6">
              <Link to="/login" className="text-sm text-gray-600 hover:text-pharmacy-blue">
                ← العودة لتسجيل الدخول
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
