// src/pages/ResetPasswordPage.jsx
// صفحة تعيين كلمة مرور جديدة

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const checks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /\d/.test(password),
    match: password && password === confirm,
  };
  const valid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!valid) {
      setError('كلمة المرور لا تستوفي الشروط');
      return;
    }
    setLoading(true);
    const result = await resetPassword({ token, password });
    setLoading(false);
    if (result.success) {
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setError(result.error);
    }
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
            {!done ? (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-pharmacy-blue">تعيين كلمة مرور جديدة</h1>
                  <p className="text-gray-600 mt-2 text-sm">اختر كلمة مرور قوية وآمنة</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pr-11 pl-11 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-2 space-y-1">
                        <Check2 label="8 أحرف على الأقل" passed={checks.length} />
                        <Check2 label="حرف واحد على الأقل" passed={checks.letter} />
                        <Check2 label="رقم واحد على الأقل" passed={checks.number} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all"
                      />
                    </div>
                    {confirm && (
                      <div className="mt-2">
                        <Check2 label="كلمتا المرور متطابقتان" passed={checks.match} />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !valid}
                    className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        تعيين كلمة المرور
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
                <h2 className="text-2xl font-bold text-pharmacy-blue mb-2">تم بنجاح!</h2>
                <p className="text-gray-600 mb-4">تم تغيير كلمة المرور بنجاح</p>
                <p className="text-sm text-gray-500">جاري تحويلك لتسجيل الدخول...</p>
                <Loader2 className="w-5 h-5 animate-spin mx-auto mt-3 text-pharmacy-cyan" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Check2({ label, passed }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-gray-400'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-gray-100'}`}>
        <Check className="w-3 h-3" />
      </div>
      {label}
    </div>
  );
}
