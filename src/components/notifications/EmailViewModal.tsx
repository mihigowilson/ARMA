import React from 'react';
import { EmailNotification } from '../../types/arma';
import { X, Mail, ShieldCheck, Calendar, User, Building2, CheckCircle2, Download, ExternalLink, Printer } from 'lucide-react';

interface EmailViewModalProps {
  email: EmailNotification;
  onClose: () => void;
}

export const EmailViewModal: React.FC<EmailViewModalProps> = ({ email, onClose }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Licensed':
        return 'bg-[#20603D] text-white';
      case 'Provisionary':
        return 'bg-amber-500 text-slate-900';
      case 'Pending Renewal':
        return 'bg-blue-600 text-white';
      case 'Under Review':
        return 'bg-purple-600 text-white';
      case 'Suspended':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Email Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00A1DE] uppercase font-bold tracking-wider block">
                ARMA AUTOMATED EMAIL DISPATCH SYSTEM
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white leading-snug">
                {email.subject}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-[#1E2630] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 font-mono text-[10px] block">RECIPIENT CEO:</span>
              <strong className="text-slate-800 dark:text-slate-200">{email.recipientName}</strong>
              <span className="text-[#00A1DE] text-[11px] font-mono block">&lt;{email.recipientEmail}&gt;</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] block">AGENCY ENTITY:</span>
              <strong className="text-slate-800 dark:text-slate-200">{email.agencyName}</strong>
              <span className="text-slate-400 text-[11px] block">Sent: {new Date(email.sentAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Official Standing Change Summary Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#12161A] via-[#1E2630] to-[#12161A] text-white border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              STATUS TRANSITION DISPATCH
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Old: {email.previousStatus}
              </span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded font-bold ${getStatusBadge(email.newStatus)}`}>
                New: {email.newStatus}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full font-bold shrink-0">
            ✓ Delivered to Mailbox
          </span>
        </div>

        {/* Email Body Content */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
          {email.bodyHtml}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Email Notice
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
