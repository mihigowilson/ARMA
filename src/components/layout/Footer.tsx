import React, { useState, useEffect } from 'react';
import { ArmaLogo } from './ArmaLogo';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  SlidersHorizontal, 
  Loader2, 
  Sparkles,
  Users,
  Check
} from 'lucide-react';
import { NewsletterSubscriber } from '../../types/arma';
import { NewsletterModal } from './NewsletterModal';
import { 
  subscribeToNewsletterStore, 
  saveSubscriberToFirestore, 
  deleteSubscriberFromFirestore 
} from '../../lib/subscribersService';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

const STORAGE_KEY = 'arma_newsletter_subscribers';

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { showToast, sendNewsletterDispatch } = useAuth();
  
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Official Gazette & Directives',
    'Urgent Casting Calls & Jobs'
  ]);
  const [frequency, setFrequency] = useState<'Weekly Gazette' | 'Instant Casting Alerts' | 'Monthly Digest'>('Weekly Gazette');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load subscribers from storage', e);
    }
    return [];
  });

  const [activeSubscriberModal, setActiveSubscriberModal] = useState<NewsletterSubscriber | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
    } catch (e) {
      console.error('Failed to save subscribers to storage', e);
    }
  }, [subscribers]);

  useEffect(() => {
    const unsubscribeFn = subscribeToNewsletterStore((remoteItems) => {
      if (remoteItems && remoteItems.length > 0) {
        setSubscribers((prev) => {
          // Merge remote items with local
          const map = new Map<string, NewsletterSubscriber>();
          prev.forEach((item) => map.set(item.id, item));
          remoteItems.forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });
      }
    });

    return () => {
      unsubscribeFn();
    };
  }, []);

  const activeCount = subscribers.length;

  const availableTopics = [
    { id: 'Official Gazette & Directives', label: 'Gazette & Directives' },
    { id: 'Urgent Casting Calls & Jobs', label: 'Castings & Jobs' },
    { id: 'Model Safeguarding & Fair Pay', label: 'Safeguarding & Rules' },
    { id: 'Fashion Week Calendar & Events', label: 'Events & Seminars' }
  ];

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      if (selectedTopics.length === 1) return;
      setSelectedTopics(selectedTopics.filter((t) => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid email address (e.g., name@domain.rw).';
    return '';
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');

    const trimmedEmail = email.trim().toLowerCase();
    const existing = subscribers.find((s) => s.email.toLowerCase() === trimmedEmail);

    if (existing && existing.status === 'Active') {
      showToast(`Account (${trimmedEmail}) is already subscribed! Opening management hub...`, 'info');
      setActiveSubscriberModal(existing);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newSubscriber: NewsletterSubscriber = {
        id: `sub-${Date.now()}`,
        email: trimmedEmail,
        subscribedAt: new Date().toISOString().split('T')[0],
        frequency,
        topics: selectedTopics,
        status: 'Active',
        welcomeEmailSent: true
      };

      setSubscribers((prev) => [newSubscriber, ...prev.filter((s) => s.email.toLowerCase() !== trimmedEmail)]);
      saveSubscriberToFirestore(newSubscriber);
      setIsSubmitting(false);
      setEmail('');

      // Send automated email dispatch
      sendNewsletterDispatch(trimmedEmail, selectedTopics);

      showToast(
        `🎉 Successfully subscribed ${trimmedEmail}! Automated Gazette welcome dispatch sent.`,
        'success'
      );

      // Open Modal to view preferences & dispatch status
      setActiveSubscriberModal(newSubscriber);
    }, 800);
  };

  const handleUpdateSubscriber = (updated: NewsletterSubscriber) => {
    setSubscribers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    saveSubscriberToFirestore(updated);
    setActiveSubscriberModal(updated);
    showToast('Newsletter preferences updated successfully!', 'success');
  };

  const handleUnsubscribe = (emailToUnsub: string) => {
    const found = subscribers.find((s) => s.email.toLowerCase() === emailToUnsub.toLowerCase());
    if (found) {
      deleteSubscriberFromFirestore(found.id);
    }
    setSubscribers((prev) => prev.filter((s) => s.email.toLowerCase() !== emailToUnsub.toLowerCase()));
    setActiveSubscriberModal(null);
    showToast(`Unsubscribed (${emailToUnsub}) from ARMA Gazette broadcasts.`, 'info');
  };

  return (
    <footer className="bg-[#0B0E11] text-slate-300 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
      {/* Subscriber Management Modal */}
      <NewsletterModal
        isOpen={!!activeSubscriberModal}
        onClose={() => setActiveSubscriberModal(null)}
        subscriber={activeSubscriberModal}
        onUpdateSubscriber={handleUpdateSubscriber}
        onUnsubscribe={handleUnsubscribe}
        onSendTestDispatch={(subEmail) => sendNewsletterDispatch(subEmail, activeSubscriberModal?.topics)}
      />

      {/* Subtle Rwanda Color Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00A1DE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#20603D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Branding & Mission & Robust Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <ArmaLogo size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-md pt-1">
              The official national association representing and protecting professional models, modeling agencies, talent scouts, casting directors, and fashion practitioners across the Republic of Rwanda.
            </p>
            
            <div className="flex items-center gap-2 text-xs font-mono text-[#00A1DE]">
              <ShieldCheck className="w-4 h-4 text-[#FAD201]" />
              <span>Official Charter recognized under Ministry of Youth & Arts</span>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="pt-2 max-w-md">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Official ARMA Gazette & Intelligence Feed
                  </label>
                  <span className="text-[10px] font-mono text-[#00A1DE] bg-[#00A1DE]/10 px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#00A1DE]/20">
                    <Users className="w-3 h-3 text-[#FAD201]" /> {activeCount.toLocaleString()}+ Subscribed
                  </span>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (validationError) setValidationError('');
                        }}
                        placeholder="Enter email (e.g., agency@domain.rw)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A1DE] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Subscribe
                        </>
                      )}
                    </button>
                  </div>

                  {validationError && (
                    <p className="text-[11px] font-mono text-red-400 animate-fadeIn">
                      ⚠️ {validationError}
                    </p>
                  )}

                  {/* Topic selection chips & options toggle */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setShowPreferences(!showPreferences)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-[#00A1DE]" />
                      <span>{showPreferences ? 'Hide Topics' : 'Customize Topics & Frequency'}</span>
                    </button>

                    <span className="text-slate-500 text-[10px]">
                      Auto-mail dispatch enabled
                    </span>
                  </div>

                  {showPreferences && (
                    <div className="pt-2 space-y-2.5 animate-fadeIn border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                        Preferred Gazette Topics:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {availableTopics.map((top) => {
                          const isSel = selectedTopics.includes(top.id);
                          return (
                            <button
                              key={top.id}
                              type="button"
                              onClick={() => toggleTopic(top.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-left flex items-center justify-between transition-all border ${
                                isSel
                                  ? 'bg-[#00A1DE]/20 text-white border-[#00A1DE]/40 font-bold'
                                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                              }`}
                            >
                              <span className="truncate">{top.label}</span>
                              {isSel && <Check className="w-3 h-3 text-[#00A1DE] shrink-0 ml-1" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-mono">Frequency:</span>
                        <div className="flex gap-1">
                          {(['Weekly Gazette', 'Instant Casting Alerts'] as const).map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setFrequency(f)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                frequency === f
                                  ? 'bg-[#00A1DE] text-white font-bold'
                                  : 'bg-slate-950 text-slate-500 border border-slate-800'
                              }`}
                            >
                              {f.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-mono">
              Association
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors">
                  About ARMA & Mission
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors">
                  Executive Board & Leadership
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('membership')} className="hover:text-white transition-colors">
                  Membership Categories & Benefits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('documents')} className="hover:text-white transition-colors">
                  Association Constitution & Bylaws
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('certification')} className="hover:text-white transition-colors">
                  Certificate QR Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Directories & Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-mono">
              Directory & Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('directory')} className="hover:text-white transition-colors">
                  Rwandan Models Roster
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('directory')} className="hover:text-white transition-colors">
                  Licensed Agencies Directory
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('castings')} className="hover:text-white transition-colors">
                  National Job & Casting Calls
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('events')} className="hover:text-white transition-colors">
                  Fashion Calendar & Seminars
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('news')} className="hover:text-white transition-colors">
                  Press Releases & Media Center
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Secretariat Office */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-mono">
              Secretariat Office
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00A1DE] shrink-0 mt-0.5" />
                <span>KG 7 Ave, Kimihurura, Kigali City, Republic of Rwanda</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#20603D] shrink-0 mt-0.5" />
                <span>
                  Secretariat: +250 788 123 456
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FAD201] shrink-0" />
                <span>info@arma.org.rw</span>
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                Official Government Partners
              </span>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono">
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Ministry of Youth & Arts</span>
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Visit Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ARMA (Association of Rwanda Models & Agencies). All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => setCurrentTab('security')} className="hover:text-white text-[#00A1DE] font-semibold transition-colors">
              Security Architecture
            </button>
            <button onClick={() => setCurrentTab('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy (Law N° 058/2021)
            </button>
            <button onClick={() => setCurrentTab('terms')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => setCurrentTab('safeguarding')} className="hover:text-slate-300 transition-colors">
              Safeguarding & Fair Pay
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

