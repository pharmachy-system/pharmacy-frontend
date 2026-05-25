// src/components/auth/OTPInput.jsx
// مكوّن إدخال OTP - 6 خانات مع auto-focus

import { useRef, useState, useEffect } from 'react';

export default function OTPInput({ length = 6, onChange, onComplete, error }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // last char only
    setOtp(newOtp);

    const joined = newOtp.join('');
    onChange?.(joined);

    // Auto-advance focus
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Call onComplete when all filled
    if (joined.length === length && !newOtp.includes('')) {
      onComplete?.(joined);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const newOtp = pasted.split('').concat(Array(length).fill('')).slice(0, length);
    setOtp(newOtp);
    onChange?.(newOtp.join(''));
    if (pasted.length === length) onComplete?.(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none
            ${
              error
                ? 'border-red-400 bg-red-50 text-red-600'
                : digit
                ? 'border-pharmacy-cyan bg-cyan-50 text-pharmacy-blue shadow-md shadow-cyan-100'
                : 'border-gray-200 bg-white text-gray-700 hover:border-pharmacy-cyan/40'
            }
            focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/20 focus:bg-white`}
        />
      ))}
    </div>
  );
}
