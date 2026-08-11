import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  Check, 
  ExternalLink,
  Trash2,
  Inbox,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { NewsletterSubscriber } from '../../types/arma';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: NewsletterSubscriber | null;
  onUpdateSubscriber: (updated: NewsletterSubscriber) => void;
  onUnsubscribe: (email: string) => void;
  onSendTestDispatch: (email: string) => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
  subscriber,
  onUpdateSubscriber,
  onUnsubscribe,
  onSendTestDispatch
}) => {
  if (!isOpen || !subscriber) return null;

  const [frequency, setFrequency] = useState<'Weekly Gazette' | 'Instant Casting Alerts' | 'Monthly Digest'>(
    subscriber.frequency || 'Weekly Gazette'
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    subscriber.topics || [
      'Official Gazette & Directives',
      'Urgent Casting Calls & Jobs',
      'Model Safeguarding & Fair Pay',
      'Fashion Week Calendar & Events'
    ]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableTopics = [
    { id: 'Official Gazette & Directives', label: 'Official Gazette & Ministry Directives', desc: 'Government policy changes, agency licensing updates.' },
    { id: 'Urgent Casting Calls & Jobs', label: 'Urgent Casting Calls & Job Auditions', desc: 'Immediate runway, commercial, and international placements.' },
    { id: 'Model Safeguarding & Fair Pay', label: 'Model Safeguarding & Fair Pay', desc: 'Child protection rules, legal commission caps, pay scales.' },
    { id: 'Fashion Week Calendar & Events', label: 'Fashion Week Calendar & Seminars', desc: 'Kigali Fashion Week, masterclasses, and workshops.' }
  ];

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      if (selectedTopics.length === 1) return; // Must keep at least 1
      setSelectedTopics(selectedTopics.filter((t) => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSavePreferences = () => {
    onUpdateSubscriber({
      ...subscriber,
      frequency,
      topics: selectedTopics
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0B0E11] via-[#161C22] to-[#0B0E11] text-white border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A1DE]/10 border border-[#00A1DE]/30 text-[#00A1DE] text-xs font-mono font-bold uppercase mb-3">
            <Mail className="w-3.5 h-3.5 text-[#FAD201]" />
            ARMA Automated Mailer Hub
          </div>

          <h2 className="text-2xl font-serif font-bold text-white">
            Newsletter Preferences & Dispatch Hub
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Subscribed Account: <strong className="text-[#00A1DE] font-mono">{subscriber.email}</strong>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-emerald-600 dark:text-emerald-400">
                  Subscription Active & Verified
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Subscribed on {subscriber.subscribedAt} • Automated Dispatch Ready
                </p>
              </div>
            </div>

            <button
              onClick={() => onSendTestDispatch(subscriber.email)}
              className="px-3.5 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" /> Trigger Automated Update
            </button>
          </div>

          {/* Topics Section */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">
              1. Select Gazette Topics
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTopics.map((item) => {
                const isChecked = selectedTopics.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleTopic(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-[#00A1DE]/10 border-[#00A1DE] text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#00A1DE] text-white' : 'border border-slate-400'}`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <strong className="block text-xs font-serif font-bold">
                        {item.label}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency Section */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">
              2. Delivery Frequency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Weekly Gazette', 'Instant Casting Alerts', 'Monthly Digest'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`p-3 rounded-2xl border text-center transition-all text-xs font-mono font-bold ${
                    frequency === freq
                      ? 'bg-[#00A1DE] text-white border-[#00A1DE] shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Save / Unsubscribe Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              onClick={() => onUnsubscribe(subscriber.email)}
              className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Unsubscribe
            </button>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-mono text-emerald-500 flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Preferences saved!
                </span>
              )}
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-bold transition-colors shadow-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
