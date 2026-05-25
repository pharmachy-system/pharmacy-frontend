// src/contexts/AuthContext.jsx
// Global Auth state - يستخدمه كل المشروع

import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { tokenManager } from '../utils/tokenManager';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bootstrap: try to restore session from localStorage
  useEffect(() => {
    const bootstrap = async () => {
      const storedUser = tokenManager.getUser();
      const hasToken = tokenManager.isAuthenticated();

      if (hasToken && storedUser) {
        setUser(storedUser);
        // Verify session is still valid (silent refresh if needed)
        try {
          const freshUser = await authApi.getMe();
          if (freshUser) {
            setUser(freshUser);
            tokenManager.setUser(freshUser);
          }
        } catch (err) {
          // Token invalid - axios interceptor will handle refresh or logout
          console.warn('Session check failed:', err.message);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  // ============ Auth actions ============

  const register = async ({ name, email, password, phone }) => {
    setError(null);
    try {
      const auth = await authApi.register({ name, email, password, phone });
      setUser(auth.user);
      return { success: true, user: auth.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل التسجيل';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    setError(null);
    try {
      const auth = await authApi.loginWithEmail({ email, password });
      setUser(auth.user);
      return { success: true, user: auth.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل تسجيل الدخول';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const sendPhoneOTP = async ({ phone }) => {
    setError(null);
    try {
      const data = await authApi.sendPhoneOTP({ phone });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل إرسال الرمز';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const verifyPhoneOTP = async ({ phone, otp }) => {
    setError(null);
    try {
      const auth = await authApi.verifyPhoneOTP({ phone, otp });
      setUser(auth.user);
      return { success: true, user: auth.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'رمز التحقق غير صحيح';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const resendPhoneOTP = async ({ phone }) => {
    setError(null);
    try {
      const data = await authApi.resendPhoneOTP({ phone });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل إعادة الإرسال';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const verifyPin = async ({ pin, userId }) => {
    setError(null);
    try {
      const auth = await authApi.verifyPin({ pin, userId });
      setUser(auth.user);
      return { success: true, user: auth.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'PIN غير صحيح';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const verifyBiometric = async (params) => {
    setError(null);
    try {
      const auth = await authApi.verifyBiometric(params);
      setUser(auth.user);
      return { success: true, user: auth.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل التحقق البيومتري';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const forgotPassword = async ({ email }) => {
    setError(null);
    try {
      const data = await authApi.forgotPassword({ email });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل إرسال رابط الاستعادة';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const resetPassword = async ({ token, password }) => {
    setError(null);
    try {
      const data = await authApi.resetPassword({ token, password });
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل إعادة تعيين كلمة المرور';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API failed:', err.message);
    }
    setUser(null);
    tokenManager.clearSession();
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login: loginWithEmail,
    loginWithEmail,
    sendPhoneOTP,
    verifyPhoneOTP,
    resendPhoneOTP,
    verifyPin,
    verifyBiometric,
    forgotPassword,
    resetPassword,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
