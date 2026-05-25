// src/hooks/useBiometric.js
// Hook لاستخدام Biometric (Face ID/Fingerprint) عبر WebAuthn API

import { useState, useEffect } from 'react';

export function useBiometric() {
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      // Check if WebAuthn is supported
      if (
        typeof window !== 'undefined' &&
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
      ) {
        setIsSupported(true);
        try {
          const available =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsAvailable(available);
        } catch {
          setIsAvailable(false);
        }
      }
      setChecking(false);
    };
    check();
  }, []);

  // Register biometric credential (للتسجيل لأول مرة)
  const register = async ({ userId, userName, challenge }) => {
    if (!isSupported || !isAvailable) {
      throw new Error('البصمة غير متوفرة على هذا الجهاز');
    }

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new TextEncoder().encode(challenge || crypto.randomUUID()),
          rp: { name: 'صيدلية الأنصار', id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userName,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },
            { alg: -257, type: 'public-key' },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'none',
        },
      });

      return {
        credentialId: credential.id,
        publicKey: btoa(
          String.fromCharCode(...new Uint8Array(credential.response.publicKey || []))
        ),
        rawId: credential.rawId,
      };
    } catch (err) {
      throw new Error(err.message || 'فشل تسجيل البصمة');
    }
  };

  // Verify biometric (لتسجيل الدخول)
  const verify = async ({ credentialId, challenge }) => {
    if (!isSupported || !isAvailable) {
      throw new Error('البصمة غير متوفرة على هذا الجهاز');
    }

    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(challenge || crypto.randomUUID()),
          allowCredentials: credentialId
            ? [
                {
                  id: new TextEncoder().encode(credentialId),
                  type: 'public-key',
                  transports: ['internal'],
                },
              ]
            : [],
          userVerification: 'required',
          timeout: 60000,
        },
      });

      return {
        credentialId: assertion.id,
        signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
        authenticatorData: btoa(
          String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))
        ),
      };
    } catch (err) {
      throw new Error(err.message || 'فشل التحقق بالبصمة');
    }
  };

  return { isSupported, isAvailable, checking, register, verify };
}

export default useBiometric;
