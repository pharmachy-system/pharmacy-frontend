// src/components/auth/PinInput.jsx
// مكوّن إدخال PIN - 4 أو 6 خانات مع تشفير العرض

import { useRef, useState, useEffect } from 'react';

export default function PinInput({ length = 6, onChange, onComplete, error }) {
  const [pin, setPin] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    const joined = newPin.join('');
    onChange?.(joined);

    if (value && index < length - 1) inputsRef.current[index + 1]?.focus();
    if (joined.length === length && !newPin.includes('')) onComplete?.(joined);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3" dir="ltr">
      {pin.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-12 h-14 text-center text-3xl font-bold rounded-full border-2 transition-all outline-none
            ${
              error
                ? 'border-red-400 bg-red-50'
                : digit
                ? 'border-pharmacy-cyan bg-pharmacy-cyan text-white shadow-lg shadow-cyan-200'
                : 'border-gray-200 bg-white hover:border-pharmacy-cyan/40'
            }
            focus:border-pharmacy-cyan focus:ring-4 focus:ring-pharmacy-cyan/20`}
        />
      ))}
    </div>
  );
}
