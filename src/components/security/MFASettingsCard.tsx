import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateBase32Secret, generateOtpAuthUri, generateBackupCodes, verifyTOTPCode } from '../../utils/totp';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  Copy,
  CheckCircle2,
  X,
  Lock,
  RefreshCw,
  Download,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const MFASettingsCard: React.FC = () => {
  const { user, enableTOTPMFA, disableTOTPMFA, showToast } = useAuth();
  
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);
  
  // Setup data
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  // Statuses
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableConfirmationCode, setDisableConfirmationCode] = useState('');
  const [isDisableConfirming, setIsDisableConfirming] = useState(false);

  const mfaActive = Boolean(user?.mfaEnabled);

  const startSetupWizard = async () => {
    const newSecret = generateBase32Secret();
    setSecretKey(newSecret);
    const uri = generateOtpAuthUri(user?.email || 'member@arma.org.rw', newSecret);
    
    try {
      const url = await QRCode.toDataURL(uri, { margin: 2, width: 220, color: { dark: '#00A1DE', light: '#FFFFFF' } });
      setQrCodeDataUrl(url);
    } catch (err) {
      console.error('QR code generation failed:', err);
    }

    const generatedBackup = generateBackupCodes();
    setBackupCodes(generatedBackup);
    setOtpCode('');
    setSetupStep(1);
    setIsSetupModalOpen(true);
  };

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    showToast('TOTP secret key copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedBackup(true);
    showToast('MFA backup recovery codes copied!', 'info');
    setTimeout(() => setCopiedBackup(false), 2500);
  };

  const handleDownloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([`ARMA RWANDA MULTI-FACTOR AUTH RECOVERY CODES\nAccount: ${user?.email}\nGenerated: ${new Date().toLocaleString()}\n\n` + backupCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ARMA-MFA-Backup-Codes-${user?.email?.split('@')[0] || 'Member'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('MFA backup codes file downloaded', 'success');
  };

  const handleVerifyOtpStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      showToast('Please enter the 6-digit code from your authenticator app.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const verificationResult = verifyTOTPCode(secretKey, otpCode, backupCodes);
      if (!verificationResult.valid) {
        showToast('Invalid 6-digit passcode. Please verify your authenticator app.', 'error');
        setIsLoading(false);
        return;
      }

      const res = await enableTOTPMFA(secretKey, otpCode);
      if (res.success) {
        setSetupStep(3); // Advance to backup codes review step
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    setIsLoading(true);
    try {
      await disableTOTPMFA(disableConfirmationCode);
      setIsDisableConfirming(false);
      setDisableConfirmationCode('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
            mfaActive 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
              : 'bg-[#00A1DE]/10 text-[#00A1DE] border-[#00A1DE]/30'
          }`}>
            {mfaActive ? <ShieldCheck className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold">Two-Factor Authentication (TOTP)</h3>
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                mfaActive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {mfaActive ? 'ACTIVE & ENFORCED' : 'DISABLED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Secure your ARMA account with Time-based One-Time Passwords (TOTP) compatible with Google Authenticator, Authy, or 1Password.
            </p>
          </div>
        </div>

        {mfaActive ? (
          <button
            onClick={() => setIsDisableConfirming(true)}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/20 transition-colors shrink-0"
          >
            Disable TOTP MFA
          </button>
        ) : (
          <button
            onClick={startSetupWizard}
            className="px-5 py-2.5 rounded-2xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shrink-0"
          >
            <KeyRound className="w-4 h-4" /> Enable TOTP MFA
          </button>
        )}
      </div>

      {/* Info Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Smartphone className="w-4 h-4 text-[#00A1DE]" />
            <span>Authenticator App</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Scan QR code into Google Authenticator, Authy, Microsoft Authenticator, or Apple Keychain to generate 6-digit security passcodes.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-[#20603D]" />
            <span>Identity Protection</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Protects your accredited modeling agency license, official voting rights, contract sign-offs, and casting applications.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <KeyRound className="w-4 h-4 text-[#FAD201]" />
            <span>Recovery Codes</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            8 single-use offline recovery backup codes are provided during setup in case you lose access to your primary device.
          </p>
        </div>
      </div>

      {/* Disable Confirmation Sub-Form */}
      {isDisableConfirming && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" /> Are you sure you want to disable TOTP Multi-Factor Authentication?
            </div>
            <button onClick={() => setIsDisableConfirming(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Disabling MFA reduces your account security rating. Enter your 6-digit code or type "DISABLE" to confirm.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={disableConfirmationCode}
              onChange={(e) => setDisableConfirmationCode(e.target.value)}
              placeholder="Enter 6-digit code or type DISABLE"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-red-500/40 text-xs font-mono"
            />
            <button
              onClick={handleDisableMFA}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
            >
              Confirm Disable
            </button>
          </div>
        </div>
      )}

      {/* SETUP WIZARD MODAL */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSetupModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center mx-auto mb-2 border border-[#00A1DE]/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold">
                {setupStep === 1 && 'Step 1: Scan QR Code or Add Secret'}
                {setupStep === 2 && 'Step 2: Enter 6-Digit Verification Code'}
                {setupStep === 3 && 'Step 3: Save MFA Recovery Backup Codes'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {setupStep === 1 && 'Open your authenticator app (Google Authenticator, Authy, etc.)'}
                {setupStep === 2 && 'Type the 6-digit security code generated by your mobile app'}
                {setupStep === 3 && 'Store these 8 emergency recovery backup codes in a safe place'}
              </p>
            </div>

            {/* STEP 1: SCAN QR CODE / COPY SECRET */}
            {setupStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-inner">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="TOTP QR Code" className="w-44 h-44 rounded-xl shadow" />
                  ) : (
                    <div className="w-44 h-44 rounded-xl bg-slate-100 flex items-center justify-center font-mono">
                      Generating QR...
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono mt-2">
                    otpauth://totp/ARMA:{user?.email}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold">Secret Key (Manual Entry)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={secretKey}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-center tracking-wider text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleCopySecretKey}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copiedKey ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copiedKey ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSetupStep(2)}
                  className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  I've Scanned the QR Code <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: VERIFY 6-DIGIT PASSCODE */}
            {setupStep === 2 && (
              <form onSubmit={handleVerifyOtpStep} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">6-Digit Authenticator Code</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-lg tracking-widest text-center focus:outline-none focus:border-[#00A1DE]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enter the current 6-digit passcode displayed in your authenticator app.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSetupStep(1)}
                    className="w-1/3 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Verify & Enable TOTP
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: RECOVERY BACKUP CODES */}
            {setupStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>TOTP Multi-Factor Authentication Activated!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Save these 8 emergency recovery backup codes. Each code can be used once to log in if you ever lose your mobile device.
                  </p>
                </div>

                {/* Grid of backup codes */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border font-mono text-center">
                  {backupCodes.map((c, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-white dark:bg-[#12161A] border font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {c}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5"
                  >
                    {copiedBackup ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedBackup ? 'Copied' : 'Copy All'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadBackupCodes}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download TXT
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSetupModalOpen(false)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-lg"
                >
                  Complete Setup & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
