'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, ArrowRight, Edit3 } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  email: string;
  customerName?: string;
  purpose?: string;
  onClose: () => void;
  onVerified: (verificationToken: string, verifiedEmail: string) => void;
  onEmailChange?: (newEmail: string) => void;
}

export default function OtpVerificationModal({
  isOpen,
  email,
  customerName,
  purpose = 'request verification',
  onClose,
  onVerified,
  onEmailChange,
}: OtpVerificationModalProps) {
  const [currentEmail, setCurrentEmail] = useState(email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setCurrentEmail(email);
    setTempEmail(email);
  }, [email]);

  // Initial OTP send on open
  useEffect(() => {
    if (isOpen && currentEmail && !hasSentInitial) {
      sendOtp(currentEmail);
      setHasSentInitial(true);
    }
    if (!isOpen) {
      setHasSentInitial(false);
      setDigits(['', '', '', '', '', '']);
      setErrorMessage(null);
      setInfoMessage(null);
      setIsEditingEmail(false);
    }
  }, [isOpen, currentEmail]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-focus first input on open
  useEffect(() => {
    if (isOpen && !isEditingEmail) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOpen, isEditingEmail]);

  const sendOtp = async (targetEmail: string) => {
    setIsSendingOtp(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          customerName,
          purpose,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCountdown(30);
        setInfoMessage(`Verification code sent to ${targetEmail}`);
      } else {
        setErrorMessage(data.error || 'Failed to send verification code.');
      }
    } catch {
      setErrorMessage('Network error sending verification code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (errorMessage) setErrorMessage(null);

    // Handle single character
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...digits];

    if (cleaned.length === 0) {
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Single digit input
    newDigits[index] = cleaned[cleaned.length - 1];
    setDigits(newDigits);

    // Auto-advance
    if (index < 5 && cleaned.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (index === 5 || newDigits.every((d) => d !== '')) {
      const fullOtp = newDigits.join('');
      if (fullOtp.length === 6) {
        verifyOtpCode(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pasted.length === 6) {
      verifyOtpCode(pasted);
    }
  };

  const verifyOtpCode = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentEmail,
          otp: code,
        }),
      });

      const data = await res.json();
      if (res.ok && data.verificationToken) {
        onVerified(data.verificationToken, currentEmail);
      } else {
        setErrorMessage(data.error || 'Invalid code. Please check and try again.');
        // Clear digits for retry
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setErrorMessage('Verification failed due to a network error.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveEmail = () => {
    const trimmed = tempEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setCurrentEmail(trimmed);
    setIsEditingEmail(false);
    setDigits(['', '', '', '', '', '']);
    if (onEmailChange) onEmailChange(trimmed);
    sendOtp(trimmed);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-deep/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-platinum-border overflow-hidden text-graphite font-sans">
        {/* Modal Top Header */}
        <div className="bg-graphite text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold tracking-wide">Email Verification</h3>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest">Pradeep Furniture Atelier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Email Info Bar */}
          <div className="bg-[#faf9f6] border border-[#e5dfd5] rounded-lg p-3.5 text-xs">
            {isEditingEmail ? (
              <div className="space-y-2">
                <label className="block text-slate-dark font-medium text-[11px]">Update your email address:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded border border-platinum-border text-xs focus:outline-none focus:border-graphite"
                    placeholder="name@example.com"
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="px-3 py-1.5 bg-graphite text-white text-xs font-semibold rounded hover:bg-black transition-colors"
                  >
                    Send OTP
                  </button>
                  <button
                    onClick={() => {
                      setTempEmail(currentEmail);
                      setIsEditingEmail(false);
                    }}
                    className="px-2 py-1.5 text-slate-muted hover:text-graphite text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate mr-2">
                  <Mail className="w-4 h-4 text-slate-muted shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-muted block text-[10px]">Verification code sent to:</span>
                    <strong className="text-graphite font-semibold truncate block">{currentEmail}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="inline-flex items-center space-x-1 text-[11px] text-slate-dark hover:text-graphite underline shrink-0 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>
            )}
          </div>

          {/* Prompt Instructions */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-dark leading-relaxed">
              Please enter the 6-digit one-time password (OTP) sent to your inbox to confirm your inquiry.
            </p>
            <p className="text-[11px] text-slate-muted">
              (Check your spam or junk folder if not seen within a minute)
            </p>
          </div>

          {/* 6 Digit Inputs */}
          <div className="flex justify-center items-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono bg-white border-2 rounded-lg border-platinum-border focus:border-graphite focus:ring-2 focus:ring-graphite/20 outline-none transition-all shadow-subtle text-graphite"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && !errorMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="button"
            disabled={isVerifying || digits.some((d) => !d)}
            onClick={() => verifyOtpCode()}
            className="w-full py-3.5 bg-graphite hover:bg-graphite-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-silver" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify &amp; Confirm Request</span>
                <ArrowRight className="w-4 h-4 text-slate-silver" />
              </>
            )}
          </button>

          {/* Resend Cooldown Section */}
          <div className="pt-2 border-t border-platinum-border flex items-center justify-between text-xs text-slate-dark">
            <span>Didn't receive the code?</span>
            {countdown > 0 ? (
              <span className="text-slate-muted font-medium text-[11px]">
                Resend in <strong className="text-graphite">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                disabled={isSendingOtp}
                onClick={() => sendOtp(currentEmail)}
                className="inline-flex items-center space-x-1 font-semibold text-graphite hover:underline transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                <span>{isSendingOtp ? 'Sending...' : 'Resend Code'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
