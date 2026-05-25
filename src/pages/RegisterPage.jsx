// src/pages/RegisterPage.jsx
// صفحة إنشاء حساب جديد

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Phone,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Password strength check
  const passwordChecks = {
    length: form.password.length >= 8,
    number: /\d/.test(form.password),
    letter: /[a-zA-Z]/.test(form.password),
  };
  const passwordStrong = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (!passwordStrong) {
      setError('كلمة المرور لا تستوفي الشروط');
      return;
    }
    if (!form.agree) {
      setError('يرجى الموافقة على الشروط والأحكام');
      return;
    }
    if (!/^(05|9665|\+9665)\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('يرجى إدخال رقم جوال سعودي صحيح');
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
    setLoading(false);

    if (result.success) {
      navigate('/verify-otp', { state: { email: form.email, phone: form.phone } });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50" dir="rtl">
      <div className="absolute top-10 -right-20 w-72 h-72 bg-pharmacy-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pharmacy-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4">
              <img src="/logo.png" alt="Ansar" className="h-14 w-auto" />
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pharmacy-blue to-pharmacy-cyan bg-clip-text text-transparent">
              أهلاً بك في الأنصار
            </h1>
            <p className="text-gray-600 mt-2 text-sm">أنشئ حسابك واستمتع بأفضل العروض</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-100/50 border border-white/60 p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    minLength={2}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    placeholder="example@email.com"
                    dir="ltr"
                    className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  رقم الجوال
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    required
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pr-11 pl-11 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password strength indicators */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <PasswordCheck label="8 أحرف على الأقل" passed={passwordChecks.length} />
                    <PasswordCheck label="حرف واحد على الأقل" passed={passwordChecks.letter} />
                    <PasswordCheck label="رقم واحد على الأقل" passed={passwordChecks.number} />
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
                    value={form.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => updateField('agree', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-pharmacy-cyan"
                />
                <span className="text-gray-600">
                  أوافق على{' '}
                  <Link to="/terms" className="text-pharmacy-cyan font-semibold">
                    الشروط والأحكام
                  </Link>{' '}
                  و{' '}
                  <Link to="/privacy" className="text-pharmacy-cyan font-semibold">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    إنشاء حساب
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>بياناتك محمية وآمنة</span>
            </div>
          </div>

          <p className="text-center mt-6 text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-pharmacy-cyan hover:text-pharmacy-blue font-bold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ label, passed }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs ${
        passed ? 'text-green-600' : 'text-gray-400'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          passed ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        <Check className="w-3 h-3" />
      </div>
      {label}
    </div>
  );
}
