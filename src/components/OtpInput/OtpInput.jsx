import { useEffect, useRef } from 'react';
import { TextField } from '@mui/material';

const LENGTH = 6;

/**
 * Controlled 6-box segmented OTP input, built on plain MUI TextFields.
 * - Typing a digit auto-advances focus to the next box.
 * - Backspace on an empty box moves focus back and clears the previous box.
 * - Pasting a full code fills all boxes at once.
 *
 * `value`/`onChange` carry the assembled digit string (0-`length` chars) so
 * the parent can validate/submit it as a single unit. Pass a changing `key`
 * from the parent (e.g. an attempt counter) to force remount + refocus the
 * first box after a failed verification.
 */
export function OtpInput({
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
}) {
  const inputRefs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? '');

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
    // Only on mount — `key`-based remounting from the parent is what
    // triggers this again for a fresh attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the parent (onChange, value) with the new digit string whenever it changes
  const setDigit = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(''));
  };

  // Focus a specific box
  const focusBox = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  // Handle typing a digit into a box
  const handleChange = (index) => (event) => {
    const raw = event.target.value;
    const digit = raw.replace(/\D/g, '').slice(-1); // keep only the last digit typed
    setDigit(index, digit);
    if (digit && index < LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  // Handle backspace to clear the current box and move focus back
  const handleKeyDown = (index) => (event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      setDigit(index - 1, '');
      focusBox(index - 1);
    }
  };

  // Handle pasting a full OTP code into any box
  const handlePaste = (index) => (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();
    const next = digits.slice();
    for (let i = 0; i < pasted.length && index + i < LENGTH; i += 1) {
      next[index + i] = pasted[i];
    }
    onChange(next.join(''));
    const lastFilled = Math.min(index + pasted.length, LENGTH) - 1;
    focusBox(Math.max(lastFilled, 0));
  };

  return (
    <div className="flex gap-2" role="group" aria-label="One-time passcode">
      {digits.map((digit, index) => (
        <TextField
          key={index}
          inputRef={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          disabled={disabled}
          error={error}
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 1,
              'aria-label': `Digit ${index + 1} of ${LENGTH}`,
              className: 'text-center',
            },
          }}
          sx={{ width: 48 }}
        />
      ))}
    </div>
  );
}
