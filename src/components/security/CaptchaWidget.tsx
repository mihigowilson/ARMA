import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

interface CaptchaWidgetProps {
  onVerified: (verified: boolean) => void;
  isVerified: boolean;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerified, isVerified }) => {
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 7) + 3);
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshChallenge = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 7) + 3;
    setNum1(n1);
    setNum2(n2);
    setUserInput('');
    setErrorMsg('');
    onVerified(false);
  };

  const handleVerify = () => {
    const expected = num1 + num2;
    if (parseInt(userInput.trim(), 10) === expected) {
      onVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect. Try again!');
      onVerified(false);
    }
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-[#00A1DE] uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FAD201]" /> ARMA Security CAPTCHA (Bot Protection)
        </span>
        <button
          type="button"
          onClick={refreshChallenge}
          className="text-slate-400 hover:text-slate-200 transition-colors"
          title="Refresh CAPTCHA challenge"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {isVerified ? (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Security Verification Passed (Human Confirmed)</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 text-sm tracking-widest shrink-0">
            {num1} + {num2} = ?
          </div>
          <input
            type="number"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              setErrorMsg('');
            }}
            placeholder="Answer"
            className="w-20 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-xs"
          />
          <button
            type="button"
            onClick={handleVerify}
            className="px-3 py-2 rounded-xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] transition-colors text-xs shadow shrink-0"
          >
            Verify
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-[10px] text-red-500 font-mono font-bold">{errorMsg}</p>
      )}
    </div>
  );
};
