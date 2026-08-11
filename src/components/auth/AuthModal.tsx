import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/arma';
import { X, ShieldCheck, KeyRound, ArrowRight, CheckCircle2, Mail, Lock, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { RegisterAgencyModal } from './RegisterAgencyModal';
import { PasswordStrengthMeter } from '../security/PasswordStrengthMeter';
import { CaptchaWidget } from '../security/CaptchaWidget';
import {
  validateData,
  signInSchema,
  registerUserSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema
} from '../../lib/validationSchemas';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type AuthViewMode = 'signin' | 'register' | 'forgot-request' | 'token-verification' | 'reset-success';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { login, loginWithGoogle, requestPasswordReset, verifyResetTokenAndResetPassword, showToast } = useAuth();
  const [viewMode, setViewMode] = useState<AuthViewMode>('signin');
  const [showAgencyRegister, setShowAgencyRegister] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [role, setRole] = useState<UserRole>('Model');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Loading & status states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [issuedDemoToken, setIssuedDemoToken] = useState<string | null>(null);

  const clearErrors = () => setFieldErrors({});

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(role);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignInOrRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (viewMode === 'register') {
      if (!isCaptchaVerified) {
        showToast('Please complete the CAPTCHA security challenge.', 'error');
        return;
      }

      const validation = validateData(registerUserSchema, {
        name: email.split('@')[0] || 'User',
        email,
        password,
        confirmPassword: password, // matched for single password field or role selection
        role
      });

      if (!validation.success) {
        setFieldErrors(validation.errors);
        const firstErr = Object.values(validation.errors)[0];
        showToast(`Validation Error: ${firstErr}`, 'error');
        return;
      }

      if (role === 'Agency') {
        setShowAgencyRegister(true);
        return;
      }
    } else {
      const validation = validateData(signInSchema, { email, password });
      if (!validation.success) {
        setFieldErrors(validation.errors);
        const firstErr = Object.values(validation.errors)[0];
        showToast(`Validation Error: ${firstErr}`, 'error');
        return;
      }
    }

    login(email, role);
    onSuccess();
  };

  const handleRequestPasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const validation = validateData(passwordResetRequestSchema, { email });
    if (!validation.success) {
      setFieldErrors(validation.errors);
      showToast(validation.errors.email || 'Invalid email address', 'error');
      return;
    }

    setIsResetLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        if (result.token) {
          setIssuedDemoToken(result.token);
          setResetToken(result.token);
        }
        setViewMode('token-verification');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while requesting password reset.', 'error');
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleVerifyTokenAndResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const validation = validateData(passwordResetConfirmSchema, {
      token: resetToken,
      newPassword: password,
      confirmPassword
    });

    if (!validation.success) {
      setFieldErrors(validation.errors);
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    setIsResetLoading(true);
    try {
      const result = await verifyResetTokenAndResetPassword(email, resetToken, password);
      if (result.success) {
        setViewMode('reset-success');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetLoading(false);
    }
  };

  if (showAgencyRegister) {
    return (
      <RegisterAgencyModal
        onClose={() => setShowAgencyRegister(false)}
        onSuccess={() => {
          setShowAgencyRegister(false);
          onSuccess();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Header Icon */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center mx-auto mb-2 font-bold font-serif text-xl border border-[#00A1DE]/20 shadow-inner">
            {viewMode === 'forgot-request' || viewMode === 'token-verification' ? (
              <KeyRound className="w-6 h-6 text-[#00A1DE]" />
            ) : viewMode === 'reset-success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              'A'
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold">
            {viewMode === 'register' && 'Join ARMA Association'}
            {viewMode === 'signin' && 'ARMA Portal Sign In'}
            {viewMode === 'forgot-request' && 'Password Recovery Request'}
            {viewMode === 'token-verification' && 'Verify Token & New Password'}
            {viewMode === 'reset-success' && 'Password Reset Complete'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {viewMode === 'forgot-request' && 'Request an email verification code & security token to reset your password'}
            {viewMode === 'token-verification' && 'Enter your 6-digit recovery code and select a new secure password'}
            {viewMode === 'reset-success' && 'Your account security credentials have been updated successfully'}
            {(viewMode === 'signin' || viewMode === 'register') && 'Official Rwanda Modeling Industry Network'}
          </p>
        </div>

        {/* Dedicated CEO Registration Highlight Banner (only on signin/register) */}
        {(viewMode === 'signin' || viewMode === 'register') && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FAD201]/10 via-[#00A1DE]/10 to-emerald-500/10 border border-[#FAD201]/30 text-xs flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="font-serif font-bold block text-amber-600 dark:text-[#FAD201]">Are you an Agency CEO?</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Register your modeling agency & answer 3 professional questions.</span>
            </div>
            <button
              onClick={() => setShowAgencyRegister(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FAD201] text-slate-900 font-bold text-[11px] hover:bg-amber-400 transition-colors shrink-0 shadow"
            >
              Register Agency
            </button>
          </div>
        )}

        {/* MODE 1 & 2: SIGN IN & REGISTER FORMS */}
        {(viewMode === 'signin' || viewMode === 'register') && (
          <>
            {/* Google Auth Integration */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-[#1E2630] text-slate-700 dark:text-slate-100 font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-sm text-xs group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-[#12161A] px-2 text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider shrink-0">
                or sign in with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSignInOrRegisterSubmit} className="space-y-3.5 text-xs">
              {viewMode === 'register' && (
                <div>
                  <label className="block font-semibold mb-1">Registration Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold"
                  >
                    <option value="Model">Professional Model</option>
                    <option value="Agency">Modeling Agency (CEO Admin)</option>
                    <option value="Admin">Super Administrator / Board Admin</option>
                    <option value="Scout">Talent Scout</option>
                    <option value="Brand">Fashion Brand</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Makeup Artist">Makeup Artist</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. model@arma.org.rw"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00A1DE]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold">Password</label>
                  {viewMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setViewMode('forgot-request')}
                      className="text-[11px] font-semibold text-[#00A1DE] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00A1DE]"
                  />
                </div>
              </div>

              {viewMode === 'register' && (
                <div className="space-y-3 pt-1">
                  <PasswordStrengthMeter password={password} />
                  <CaptchaWidget onVerified={setIsCaptchaVerified} isVerified={isCaptchaVerified} />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                {viewMode === 'register'
                  ? role === 'Agency'
                    ? 'Proceed to Agency CEO Application'
                    : 'Register Account'
                  : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-1">
              <button
                onClick={() => setViewMode(viewMode === 'register' ? 'signin' : 'register')}
                className="text-xs text-[#00A1DE] hover:underline"
              >
                {viewMode === 'register'
                  ? 'Already have an account? Sign In'
                  : 'New to ARMA? Apply for Member Accreditation'}
              </button>
            </div>
          </>
        )}

        {/* MODE 3: PASSWORD RECOVERY REQUEST FLOW */}
        {viewMode === 'forgot-request' && (
          <form onSubmit={handleRequestPasswordResetSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Account Email Verification</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Enter your registered ARMA account email address. A security recovery token and password reset authorization link will be generated and dispatched.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Registered Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@arma.org.rw"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00A1DE]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isResetLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Issuing Security Token...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Send Recovery Code & Token
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('signin')}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
              <button
                type="button"
                onClick={() => setViewMode('token-verification')}
                className="text-[#00A1DE] font-semibold hover:underline"
              >
                Have a token already?
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: TOKEN VERIFICATION & NEW PASSWORD FLOW */}
        {viewMode === 'token-verification' && (
          <form onSubmit={handleVerifyTokenAndResetSubmit} className="space-y-4 text-xs">
            {issuedDemoToken && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Security Token Dispatched
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300 pt-0.5">
                  <span>{issuedDemoToken}</span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  Token auto-filled below. Check notification bell to view full message email.
                </p>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@arma.org.rw"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold">6-Digit Recovery Security Token</label>
                <button
                  type="button"
                  onClick={handleRequestPasswordResetSubmit}
                  className="text-[10px] text-[#00A1DE] hover:underline font-mono"
                >
                  Resend Token
                </button>
              </div>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="e.g. ARMA-849201"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none focus:border-[#00A1DE]"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new 8+ char password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00A1DE]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#00A1DE]"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-500 mt-1 font-semibold">
                    ⚠️ Passwords do not match
                  </p>
                )}
              </div>

              <PasswordStrengthMeter password={password} />
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isResetLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Token & Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Verify Token & Reset Password
                </>
              )}
            </button>

            <div className="text-center pt-1 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('forgot-request')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold"
              >
                ← Change Email / Request New Token
              </button>
            </div>
          </form>
        )}

        {/* MODE 5: RESET SUCCESS VIEW */}
        {viewMode === 'reset-success' && (
          <div className="text-center space-y-4 text-xs py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                Password Successfully Reset
              </h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-xs leading-relaxed">
                Your account security credentials for <strong>{email}</strong> have been updated. You can now log in using your new password.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setConfirmPassword('');
                setViewMode('signin');
              }}
              className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Return to Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
