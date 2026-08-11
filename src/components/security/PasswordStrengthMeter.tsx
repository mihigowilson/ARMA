import React from 'react';
import { Check, X, Shield, Lock } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-[#a-zA-Z0-9]/.test(password);

  const score = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score <= 3) return { label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-500' };
    if (score === 4) return { label: 'Strong', color: 'bg-blue-500', textColor: 'text-blue-500' };
    return { label: 'Very Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Lock className="w-3 h-3 text-[#00A1DE]" /> Password Policy Compliance
        </span>
        <span className={`font-mono text-[10px] font-extrabold uppercase ${strength.textColor}`}>
          {password ? strength.label : 'Required'}
        </span>
      </div>

      {/* Strength Bar */}
      <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${score >= 1 ? strength.color : 'opacity-0'}`} />
        <div className={`h-full transition-all duration-300 ${score >= 2 ? strength.color : 'opacity-0'}`} />
        <div className={`h-full transition-all duration-300 ${score >= 3 ? strength.color : 'opacity-0'}`} />
        <div className={`h-full transition-all duration-300 ${score >= 4 ? strength.color : 'opacity-0'}`} />
        <div className={`h-full transition-all duration-300 ${score >= 5 ? strength.color : 'opacity-0'}`} />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
        <div className="flex items-center gap-1.5">
          {minLength ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <X className="w-3 h-3 text-slate-400 shrink-0" />}
          <span className={minLength ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>Min 8 characters</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasUpper ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <X className="w-3 h-3 text-slate-400 shrink-0" />}
          <span className={hasUpper ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>Uppercase letter (A-Z)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasLower ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <X className="w-3 h-3 text-slate-400 shrink-0" />}
          <span className={hasLower ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>Lowercase letter (a-z)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasNumber ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <X className="w-3 h-3 text-slate-400 shrink-0" />}
          <span className={hasNumber ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>At least 1 number (0-9)</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          {hasSpecial ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <X className="w-3 h-3 text-slate-400 shrink-0" />}
          <span className={hasSpecial ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>Special symbol (!@#$%^&*)</span>
        </div>
      </div>
    </div>
  );
};
