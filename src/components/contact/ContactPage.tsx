import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, MessageSquare } from 'lucide-react';
import { validateData, contactFormSchema } from '../../lib/validationSchemas';

export const ContactPage: React.FC = () => {
  const { showToast } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(contactFormSchema, {
      name,
      email,
      subject,
      message
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    showToast('Inquiry received! The ARMA Secretariat will reply within 24 hours.', 'success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <Mail className="w-3.5 h-3.5 text-[#00A1DE]" />
            ARMA SECRETARIAT HEADQUARTERS
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            Contact Association Secretariat
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Have questions about model licensing, agency accreditation, casting disputes, or media inquiries? Get in touch with our Kigali secretariat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-serif font-bold">Kigali Secretariat Office</h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white text-sm font-serif">Physical Address</strong>
                    <span className="text-slate-600 dark:text-slate-400">KG 7 Ave, Kimihurura, Kigali City, Republic of Rwanda</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#20603D]/10 text-[#20603D] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white text-sm font-serif">Telephone & Direct Hotline</strong>
                    <span className="text-[#00A1DE] font-bold block text-xs">
                      PRESIDENT OF ARMA CONTACT: +250 784 731 957
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 block text-[11px]">
                      Secretariat Desk: +250 788 123 456 / Emergency Hotline: +250 788 999 000
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAD201]/10 text-[#FAD201] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white text-sm font-serif">Email Correspondence</strong>
                    <span className="text-slate-600 dark:text-slate-400">info@arma.org.rw / legal@arma.org.rw</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white text-sm font-serif">Office Hours</strong>
                    <span className="text-slate-600 dark:text-slate-400">Monday - Friday: 08:00 AM - 05:00 PM CAT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden relative flex items-center justify-center">
              <div className="text-center space-y-2 p-4">
                <MapPin className="w-8 h-8 text-[#00A1DE] mx-auto animate-bounce" />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 block">
                  Kigali Convention Centre Area, Kimihurura
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Latitude: -1.9536, Longitude: 30.0911
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-xl font-serif font-bold">Send Direct Secretariat Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  placeholder="e.g. Patrick Mugisha"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  placeholder="e.g. patrick@gmail.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="">Select subject...</option>
                  <option value="Model Licensing">Model Licensing & Digital ID</option>
                  <option value="Agency Accreditation">Agency Accreditation</option>
                  <option value="Casting Dispute">Contract Dispute / Safety Concern</option>
                  <option value="Media & Press">Media & Sponsorship Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Message Details</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  placeholder="Type your official inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#00A1DE] text-white font-semibold text-xs hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-xl"
              >
                <Send className="w-4 h-4" />
                Dispatch Inquiry to Secretariat
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
