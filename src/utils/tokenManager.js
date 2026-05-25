// src/utils/tokenManager.js
// إدارة الـ tokens في localStorage بشكل آمن

const ACCESS_TOKEN_KEY = 'ansar_access_token';
const REFRESH_TOKEN_KEY = 'ansar_refresh_token';
const USER_KEY = 'ansar_user';
const GUEST_ID_KEY = 'ansar_guest_id';

export const tokenManager = {
  // Access Token
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  // Refresh Token
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // User data
  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Guest session
  getGuestId: () => localStorage.getItem(GUEST_ID_KEY),
  setGuestId: (id) => {
    if (id) localStorage.setItem(GUEST_ID_KEY, id);
  },
  clearGuestId: () => localStorage.removeItem(GUEST_ID_KEY),

  // Save full session (called on login/register)
  setSession: ({ accessToken, refreshToken, user }) => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Clear all (logout)
  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem(ACCESS_TOKEN_KEY),
};
