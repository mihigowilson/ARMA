import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, FileText, CheckCircle2, Download, Eye } from 'lucide-react';

interface EncryptedContractModalProps {
  onClose: () => void;
  contract: {
    id: string;
    title: string;
    agencyName: string;
    modelName: string;
    contractType: string;
    date: string;
    hash: string;
    status: string;
    encryptedContent: string;
  };
}

export const EncryptedContractModal: React.FC<EncryptedContractModalProps> = ({ onClose, contract }) => {
  const [passphrase, setPassphrase] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [error, setError] = useState('');

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      setError('Decryption passkey required.');
      return;
    }
    // Simulate decryption
    setIsDecrypted(true);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center font-bold shrink-0">
            <Lock className="w-6 h-6 text-[#FAD201]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-serif font-bold">{contract.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                AES-256-GCM Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Agency: {contract.agencyName} • Model: {contract.modelName} • Date: {contract.date}
            </p>
          </div>
        </div>

        {/* Security Metadata Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Cryptographic Fingerprint:</span>
            <span className="text-[#00A1DE] truncate max-w-[220px]">{contract.hash}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Access Policy:</span>
            <span className="text-emerald-400 font-bold">Strict Agency & Secretariat Encryption</span>
          </div>
        </div>

        {!isDecrypted ? (
          <form onSubmit={handleDecrypt} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-amber-500">
              <strong className="block text-xs font-bold font-serif flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Security Decryption Passkey Required
              </strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                To decrypt and view this confidential modeling contract, enter your Secretariat key or Agency CEO passkey.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Agency / Admin Encryption Passkey
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  setError('');
                }}
                placeholder="Enter key (e.g. ARMA-KEY-2026)"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white"
              />
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-mono font-bold">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Key className="w-4 h-4 text-[#FAD201]" /> Decrypt Contract Document
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Decrypted & Verified via AES-256 Engine
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto space-y-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {contract.encryptedContent}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsDecrypted(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Re-Lock Document
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white font-bold text-xs hover:bg-[#0081B3] transition-colors shadow"
              >
                Close Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
