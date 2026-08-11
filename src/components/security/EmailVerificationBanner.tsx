import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, ShieldAlert, RefreshCw, Lock, Sparkles, AlertCircle } from 'lucide-react';

interface EmailVerificationBannerProps {
  onVerifiedSuccess?: () => void;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ onVerifiedSuccess }) => {
  const { user, verifyEmailCode, resendVerificationEmail, showToast } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (!user || user.emailVerified) {
    return null;
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Please enter the 6-digit verification code.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyEmailCode(code);
      if (res.success) {
        setCode('');
        if (onVerifiedSuccess) onVerifiedSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 p-5 shadow-xl text-slate-900 dark:text-white space-y-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Action Required
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Email Verification Pending ({user.email})
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              To safeguard national modeling registry integrity, access to protected dashboard tools (Comp Card downloads, casting applications, licensing workflows) requires email verification.
            </p>
          </div>
        </div>

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" /> Resending Code...
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5 text-amber-500" /> Resend Verification Code
            </>
          )}
        </button>
      </div>

      {/* Verification Code Form */}
      <form onSubmit={handleVerifySubmit} className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
        <div className="relative flex-1">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit confirmation code (e.g. 849201)"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#12161A] border border-amber-500/40 text-xs font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> Verify Email & Unlock Full Dashboard
            </>
          )}
        </button>
      </form>
    </div>
  );
};

interface ProtectedAreaGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const ProtectedAreaGuard: React.FC<ProtectedAreaGuardProps> = ({
  children,
  title = 'Protected Area - Email Verification Required',
  description = 'You must verify your registered email address before creating casting calls, exporting credentials, or submitting contract applications.'
}) => {
  const { user } = useAuth();

  if (!user || user.emailVerified) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E2630] overflow-hidden p-6 text-center space-y-4">
      {/* Blurred preview of children */}
      <div className="pointer-events-none opacity-20 filter blur-sm select-none">
        {children}
      </div>

      {/* Overlay Lock Notice */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center z-20 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="text-lg font-serif font-bold text-white">{title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">
            <AlertCircle className="w-3.5 h-3.5" /> Complete Email Verification in banner above
          </span>
        </div>
      </div>
    </div>
  );
};
