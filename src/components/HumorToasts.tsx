import React from 'react';
import { useChaos, ToastMessage } from '../context/AppChaosContext';
import { X, AlertCircle, Info, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';

export const HumorToasts: React.FC = () => {
  const { toasts, removeToast } = useChaos();

  if (toasts.length === 0) return null;

  const getStyle = (type?: ToastMessage['type']) => {
    switch (type) {
      case 'reset':
        return 'border-[#991b1b] bg-[#fee2e2] text-[#991b1b]';
      case 'error':
        return 'border-[#991b1b] bg-[#fef2f2] text-[#991b1b]';
      case 'alert':
        return 'border-[#c2410c] bg-[#fff7ed] text-[#c2410c]';
      case 'info':
        return 'border-[#15803d] bg-[#f0fdf4] text-[#15803d]';
      case 'snark':
      default:
        return 'border-[#18181b] bg-[#faf9f5] text-[#141413]';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5 max-w-sm pointer-events-none font-mono">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 border-2 shadow-[4px_4px_0px_0px_#18181b] transition-all animate-slide-in ${getStyle(
            toast.type
          )}`}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="text-[10px] font-black uppercase tracking-wider mb-0.5 opacity-80">
                {toast.title}
              </div>
            )}
            <p className="text-xs font-bold leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-[#52524e] hover:text-[#18181b] p-0.5"
            title="Dismiss sarcasm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
