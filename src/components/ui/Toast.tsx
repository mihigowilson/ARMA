import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-[#12161A]/95 text-white border-[#20603D] ring-1 ring-[#20603D]/50'
              : toast.type === 'error'
              ? 'bg-[#12161A]/95 text-white border-red-500 ring-1 ring-red-500/50'
              : 'bg-[#12161A]/95 text-white border-[#00A1DE] ring-1 ring-[#00A1DE]/50'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00A1DE] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#FAD201] shrink-0 mt-0.5" />}

          <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white transition-colors p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
