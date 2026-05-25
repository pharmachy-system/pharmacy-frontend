// src/pages/OTPVerificationPage.jsx
// صفحة التحقق من OTP بعد التسجيل

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/authApi';
import OTPInput from '../components/auth/OTPInput';

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const phone = location.state?.phone;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleVerify = async (code) => {
    setError('');
    setLoading(true);
    try {
      await authApi.verifyEmail({ otp: code });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await authApi.resendEmailOTP();
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إعادة الإرسال');
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
            {!success ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mb-3">
                    <Sparkles className="w-8 h-8 text-pharmacy-cyan" />
                  </div>
                  <h1 className="text-2xl font-bold text-pharmacy-blue">تحقّق من حسابك</h1>
                  <p className="text-gray-600 mt-2 text-sm">
                    أرسلنا رمز تحقّق من 6 أرقام إلى
                  </p>
                  {email && (
                    <p className="text-pharmacy-blue font-bold mt-1" dir="ltr">
                      {email}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <OTPInput length={6} onChange={setOtp} onComplete={handleVerify} error={!!error} />

                  <button
                    onClick={() => handleVerify(otp)}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-l from-pharmacy-cyan to-pharmacy-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        تحقّق
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm">
                    {countdown > 0 ? (
                      <span className="text-gray-500">
                        إعادة الإرسال خلال{' '}
                        <span className="font-bold text-pharmacy-cyan">{countdown}</span> ثانية
                      </span>
                    ) : (
                      <button
                        onClick={handleResend}
                        className="text-pharmacy-cyan hover:text-pharmacy-blue font-semibold"
                      >
                        إعادة إرسال الرمز
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-pharmacy-blue mb-2">تم التحقق!</h2>
                <p className="text-gray-600">جاري تحويلك...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
