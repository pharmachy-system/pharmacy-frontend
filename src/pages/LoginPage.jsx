// src/pages/LoginPage.jsx
// صفحة تسجيل الدخول الشاملة - Figma style

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Fingerprint,
  Hash,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBiometric } from '../hooks/useBiometric';
import OTPInput from '../components/auth/OTPInput';
import PinInput from '../components/auth/PinInput';

const TABS = [
  { id: 'email', label: 'البريد الإلكتروني', icon: Mail },
  { id: 'phone', label: 'الجوال', icon: Phone },
  { id: 'pin', label: 'PIN', icon: Hash },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, sendPhoneOTP, verifyPhoneOTP, verifyPin, verifyBiometric } = useAuth();
  const { isAvailable: biometricAvailable, verify: biometricVerify } = useBiometric();

  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  // Email Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // PIN state
  const [pin, setPin] = useState('');

  // ============ Email Login ============
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginWithEmail({ email, password });
    setLoading(false);
    if (result.success) redirectAfterLogin();
    else setError(result.error);
  };

  // ============ Phone OTP ============
  const handleSendPhoneOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^(05|9665|\+9665)\d{8}$/.test(phone.replace(/\s/g, ''))) {
      setError('يرجى إدخال رقم جوال سعودي صحيح (05xxxxxxxx)');
      return;
    }
    setLoading(true);
    const result = await sendPhoneOTP({ phone });
    setLoading(false);
    if (result.success) {
      setPhoneOtpSent(true);
      startCountdown();
    } else {
      setError(result.error);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    setError('');
    setLoading(true);
    const result = await verifyPhoneOTP({ phone, otp: phoneOtp });
    setLoading(false);
    if (result.success) redirectAfterLogin();
    else setError(result.error);
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  // ============ PIN ============
  const handlePinComplete = async (pinValue) => {
    setError('');
    setLoading(true);
    const result = await verifyPin({ pin: pinValue });
    setLoading(false);
    if (result.success) redirectAfterLogin();
    else setError(result.error);
  };

  // ============ Biometric ============
  const handleBiometric = async () => {
    setError('');
    setLoading(true);
    try {
      const cred = await biometricVerify({});
      const result = await verifyBiometric(cred);
      setLoading(false);
      if (result.success) redirectAfterLogin();
      else setError(result.error);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50" dir="rtl">
      {/* Floating shapes */}
      <div className="absolute top-10 -right-20 w-72 h-72 bg-pharmacy-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pharmacy-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Logo + Title */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4">
              <img src="/logo.png" alt="Ansar" className="h-14 w-auto" />
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pharmacy-blue to-pharmacy-cyan bg-clip-text text-transparent">
              أهلاً بعودتك
            </h1>
            <p className="text-gray-600 mt-2 text-sm">سجّل دخولك للمتابعة بصيدلية الأنصار</p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-100/50 border border-white/60 p-6 sm:p-8">
            {/* Tabs */}
            <div className="flex bg-gray-100/80 rounded-2xl p-1 mb-6">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-pharmacy-blue shadow-md'
                        : 'text-gray-600 hover:text-pharmacy-blue'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* ===== Email Tab ===== */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    كلمة المرور
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pharmacy-cyan"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded text-pharmacy-cyan focus:ring-pharmacy-cyan"
                    />
                    <span className="text-gray-600">تذكّرني</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-pharmacy-cyan hover:text-pharmacy-blue font-semibold"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      تسجيل الدخول
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ===== Phone Tab ===== */}
            {activeTab === 'phone' && (
              <div className="space-y-4">
                {!phoneOtpSent ? (
                  <form onSubmit={handleSendPhoneOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        رقم الجوال
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="05xxxxxxxx"
                          dir="ltr"
                          className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/15 outline-none transition-all text-left"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        سنرسل لك رمز تحقق مكوّن من 6 أرقام
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          إرسال رمز التحقق
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mb-3">
                        <Sparkles className="w-8 h-8 text-pharmacy-cyan" />
                      </div>
                      <p className="text-gray-700 font-semibold">أدخل الرمز المرسل إلى</p>
                      <p className="text-pharmacy-blue font-bold" dir="ltr">
                        {phone}
                      </p>
                    </div>

                    <OTPInput length={6} onChange={setPhoneOtp} onComplete={handleVerifyPhoneOTP} />

                    <button
                      onClick={handleVerifyPhoneOTP}
                      disabled={loading || phoneOtp.length !== 6}
                      className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تحقق ودخول'}
                    </button>

                    <div className="text-center text-sm">
                      {countdown > 0 ? (
                        <span className="text-gray-500">
                          إعادة الإرسال خلال{' '}
                          <span className="font-bold text-pharmacy-cyan">{countdown}</span> ثانية
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendPhoneOTP({ preventDefault: () => {} })}
                          className="text-pharmacy-cyan hover:text-pharmacy-blue font-semibold"
                        >
                          إعادة إرسال الرمز
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setPhoneOtpSent(false);
                        setPhoneOtp('');
                        setCountdown(0);
                      }}
                      className="w-full text-sm text-gray-500 hover:text-pharmacy-blue"
                    >
                      تغيير رقم الجوال
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ===== PIN Tab ===== */}
            {activeTab === 'pin' && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mb-3">
                    <Hash className="w-8 h-8 text-pharmacy-cyan" />
                  </div>
                  <p className="text-gray-700 font-semibold">أدخل رمز PIN الخاص بك</p>
                  <p className="text-xs text-gray-500 mt-1">6 أرقام للدخول السريع</p>
                </div>

                <PinInput length={6} onChange={setPin} onComplete={handlePinComplete} />

                {loading && (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-pharmacy-cyan" />
                  </div>
                )}

                <p className="text-xs text-center text-gray-500">
                  لم تقم بإعداد PIN؟{' '}
                  <button
                    onClick={() => setActiveTab('email')}
                    className="text-pharmacy-cyan hover:text-pharmacy-blue font-semibold"
                  >
                    سجّل دخول بالبريد أولاً
                  </button>
                </p>
              </div>
            )}

            {/* Biometric Quick Login */}
            {biometricAvailable && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-500">أو</span>
                  </div>
                </div>

                <button
                  onClick={handleBiometric}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-pharmacy-cyan/20 bg-cyan-50/50 hover:bg-cyan-50 hover:border-pharmacy-cyan text-pharmacy-blue font-semibold transition-all"
                >
                  <Fingerprint className="w-6 h-6 text-pharmacy-cyan" />
                  <span>دخول سريع بالبصمة</span>
                </button>
              </>
            )}

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>اتصالك آمن ومشفّر</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            ليس لديك حساب؟{' '}
            <Link
              to="/register"
              className="text-pharmacy-cyan hover:text-pharmacy-blue font-bold"
            >
              إنشاء حساب جديد
            </Link>
          </p>

          {/* Guest browse */}
          <p className="text-center mt-3">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-pharmacy-blue inline-flex items-center gap-1"
            >
              تصفّح كزائر بدون تسجيل
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
