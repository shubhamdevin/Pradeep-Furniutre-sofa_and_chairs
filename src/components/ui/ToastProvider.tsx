'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, message?: string, type: ToastType = 'info', duration: number = 4200) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => toast(title, message, 'success'),
    [toast]
  );

  const error = useCallback(
    (title: string, message?: string) => toast(title, message, 'error', 5500),
    [toast]
  );

  const info = useCallback(
    (title: string, message?: string) => toast(title, message, 'info'),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="assertive"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
                isSuccess
                  ? 'bg-[#121c15]/95 text-white border-[#2e593d] shadow-[0_10px_30px_rgba(23,61,38,0.35)]'
                  : isError
                  ? 'bg-[#211414]/95 text-white border-[#662b2b] shadow-[0_10px_30px_rgba(77,24,24,0.35)]'
                  : 'bg-[#161a17]/95 text-white border-[#3b423c] shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#6ee7b7]" />}
                {isError && <AlertCircle className="w-5 h-5 text-[#fca5a5]" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-[#e2cfb0]" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-wide text-white font-sans">{t.title}</p>
                {t.message && (
                  <p className="text-[11px] text-[#cfc8bd] mt-0.5 leading-relaxed font-sans">{t.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-[#9ca3af] hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside of provider
    return {
      toast: (t: string, m?: string) => {
        if (typeof window !== 'undefined') console.log(`[Toast] ${t}: ${m || ''}`);
      },
      success: (t: string, m?: string) => {
        if (typeof window !== 'undefined') console.log(`[Success] ${t}: ${m || ''}`);
      },
      error: (t: string, m?: string) => {
        if (typeof window !== 'undefined') console.error(`[Error] ${t}: ${m || ''}`);
      },
      info: (t: string, m?: string) => {
        if (typeof window !== 'undefined') console.log(`[Info] ${t}: ${m || ''}`);
      },
    };
  }
  return context;
}
