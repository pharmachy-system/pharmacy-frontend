// src/api/authApi.js
// كل وظائف الـ Auth - تتواصل مع pharmacy-backend

import axiosClient from '../utils/axiosClient';
import { tokenManager } from '../utils/tokenManager';

// Helper: extract user + tokens from various backend response shapes
const extractAuthData = (response) => {
  const data = response.data?.data || response.data;
  return {
    user: data.user || data,
    accessToken: data.accessToken || data.token,
    refreshToken: data.refreshToken,
  };
};

// ============ Standard Auth ============

export const authApi = {
  // Register new user
  register: async ({ name, email, password, phone }) => {
    const res = await axiosClient.post('/auth/register', { name, email, password, phone });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  // Login with email + password
  loginWithEmail: async ({ email, password }) => {
    const res = await axiosClient.post('/auth/login/email', { email, password });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  // Generic login (fallback)
  login: async ({ email, password }) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  // Refresh access token
  refresh: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    const res = await axiosClient.post('/auth/refresh', { refreshToken });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  // Logout from current device
  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      tokenManager.clearSession();
    }
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      await axiosClient.post('/auth/logout/all');
    } finally {
      tokenManager.clearSession();
    }
  },

  // Get current user info
  getMe: async () => {
    const res = await axiosClient.get('/auth/me');
    return res.data?.data?.user || res.data?.user || res.data;
  },

  // Check session validity
  checkSession: async () => {
    const res = await axiosClient.get('/auth/session');
    return res.data;
  },

  // ============ Email verification ============

  verifyEmail: async ({ otp }) => {
    const res = await axiosClient.post('/auth/verify-email', { otp });
    return res.data;
  },

  resendEmailOTP: async () => {
    const res = await axiosClient.post('/auth/resend-otp');
    return res.data;
  },

  // ============ Password Management ============

  forgotPassword: async ({ email }) => {
    const res = await axiosClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async ({ token, password }) => {
    const res = await axiosClient.put(`/auth/reset-password/${token}`, { password });
    return res.data;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const res = await axiosClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  // ============ Phone OTP Login ============

  sendPhoneOTP: async ({ phone }) => {
    const res = await axiosClient.post('/auth/login/phone/send', { phone });
    return res.data;
  },

  verifyPhoneOTP: async ({ phone, otp }) => {
    const res = await axiosClient.post('/auth/login/phone/verify', { phone, otp });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  resendPhoneOTP: async ({ phone }) => {
    const res = await axiosClient.post('/auth/login/phone/resend', { phone });
    return res.data;
  },

  // ============ PIN Authentication ============

  setPin: async ({ pin }) => {
    const res = await axiosClient.post('/auth/pin/set', { pin });
    return res.data;
  },

  verifyPin: async ({ pin, userId }) => {
    const res = await axiosClient.post('/auth/pin/verify', { pin, userId });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  removePin: async () => {
    const res = await axiosClient.delete('/auth/pin');
    return res.data;
  },

  // ============ Biometric Authentication ============

  enableBiometric: async ({ publicKey, deviceId }) => {
    const res = await axiosClient.post('/auth/biometric/enable', { publicKey, deviceId });
    return res.data;
  },

  verifyBiometric: async ({ signature, deviceId, userId }) => {
    const res = await axiosClient.post('/auth/biometric/verify', {
      signature,
      deviceId,
      userId,
    });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },

  disableBiometric: async () => {
    const res = await axiosClient.post('/auth/biometric/disable');
    return res.data;
  },

  // ============ Guest Session ============

  createGuestSession: async () => {
    const res = await axiosClient.post('/auth/guest/session', {});
    const guestId = res.data?.data?.guestId || res.data?.guestId;
    if (guestId) tokenManager.setGuestId(guestId);
    return res.data;
  },

  convertGuestToUser: async ({ guestId, name, email, password, phone }) => {
    const res = await axiosClient.post('/auth/guest/convert', {
      guestId,
      name,
      email,
      password,
      phone,
    });
    const auth = extractAuthData(res);
    if (auth.accessToken) {
      tokenManager.setSession(auth);
      tokenManager.clearGuestId();
    }
    return auth;
  },

  // ============ Social Login (placeholder) ============

  socialLogin: async ({ provider, token }) => {
    const res = await axiosClient.post('/auth/social', { provider, token });
    const auth = extractAuthData(res);
    if (auth.accessToken) tokenManager.setSession(auth);
    return auth;
  },
};

export default authApi;
