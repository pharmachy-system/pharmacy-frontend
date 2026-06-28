/**
 * usePasskey — WebAuthn / Passkey hook
 * Wraps navigator.credentials for registration and authentication.
 * Returns null when WebAuthn is unsupported (SSR-safe).
 */
import { useCallback, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base64);
  return Uint8Array.from(bin, c => c.charCodeAt(0)).buffer;
}

function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function isPasskeySupported() {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === 'function'
  );
}

export default function usePasskey() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Registration ────────────────────────────────────────────────────────────
  const register = useCallback(async (token) => {
    if (!isPasskeySupported()) {
      throw new Error('المتصفح لا يدعم مفاتيح المرور');
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Get options from server
      const { data: optData } = await axios.get(`${API}/auth/passkey/register-options`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const opts = optData.options;

      // 2. Decode ArrayBuffer fields
      const publicKey = {
        ...opts,
        challenge: base64urlToBuffer(opts.challenge),
        user: {
          ...opts.user,
          id: base64urlToBuffer(opts.user.id),
        },
        excludeCredentials: (opts.excludeCredentials || []).map(c => ({
          ...c,
          id: base64urlToBuffer(c.id),
        })),
      };

      // 3. Call browser API
      const credential = await navigator.credentials.create({ publicKey });

      // 4. Encode response
      const payload = {
        id:   credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON:    bufferToBase64url(credential.response.clientDataJSON),
          attestationObject: bufferToBase64url(credential.response.attestationObject),
        },
      };

      // 5. Send to server
      const { data } = await axios.post(`${API}/auth/passkey/register`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل تسجيل مفتاح المرور';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Authentication ──────────────────────────────────────────────────────────
  const authenticate = useCallback(async (email) => {
    if (!isPasskeySupported()) {
      throw new Error('المتصفح لا يدعم مفاتيح المرور');
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Get options
      const { data: optData } = await axios.post(`${API}/auth/passkey/login-options`, { email });
      const { sessionKey, options: opts } = optData;

      const publicKey = {
        ...opts,
        challenge: base64urlToBuffer(opts.challenge),
        allowCredentials: (opts.allowCredentials || []).map(c => ({
          ...c,
          id: base64urlToBuffer(c.id),
        })),
      };

      // 2. Call browser API
      const assertion = await navigator.credentials.get({ publicKey });

      // 3. Encode
      const payload = {
        sessionKey,
        id:   assertion.id,
        type: assertion.type,
        response: {
          clientDataJSON:    bufferToBase64url(assertion.response.clientDataJSON),
          authenticatorData: bufferToBase64url(assertion.response.authenticatorData),
          signature:         bufferToBase64url(assertion.response.signature),
          userHandle: assertion.response.userHandle
            ? bufferToBase64url(assertion.response.userHandle)
            : null,
        },
      };

      // 4. Verify on server
      const { data } = await axios.post(`${API}/auth/passkey/login`, payload);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'فشل تسجيل الدخول بمفتاح المرور';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, authenticate, loading, error, isSupported: isPasskeySupported() };
}
