import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/arma';
import { validateData, membershipApplicationSchema } from '../../lib/validationSchemas';
import { ShieldCheck, CheckCircle2, User, Building2, Award, QrCode, Sparkles, Send, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { RegisterAgencyModal } from '../auth/RegisterAgencyModal';

export const MembershipPage: React.FC = () => {
  const { user, submitApplication, showToast } = useAuth();

  const [role, setRole] = useState<UserRole>('Model');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+250 ');
  const [province, setProvince] = useState('Kigali City');
  const [district, setDistrict] = useState('Nyarugenge');
  const [nationalId, setNationalId] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  const [digitalIdQr, setDigitalIdQr] = useState<string>('');
  const [showAgencyModal, setShowAgencyModal] = useState(false);

  React.useEffect(() => {
    if (user) {
      const verifyUrl = `https://arma.org.rw/verify/${user.memberId || 'ARMA-MEMBER'}`;
      QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 })
        .then((url) => setDigitalIdQr(url))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(membershipApplicationSchema, {
      fullName,
      email,
      phone,
      nationalId,
      role,
      province,
      district,
      portfolioLink: portfolioLink || undefined
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    submitApplication({
      fullName,
      email,
      phone,
      role,
      province,
      district,
      nationalId,
      portfolioLink
    });
    setFullName('');
    setEmail('');
    setNationalId('');
    setPortfolioLink('');
  };

  return (
    <div className="py-8 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FAD201]" />
            OFFICIAL ASSOCIATION ACCREDITATION
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">
            ARMA Membership & Digital Accreditation
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            Gain official national accreditation, standard legal contract safeguards, digital ID card verification, and priority access to international casting calls.
          </p>
        </div>

        {/* CEO Agency Registration Banner CTA */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12161A] via-[#1E2630] to-[#12161A] text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAD201]/20 text-[#FAD201] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#FAD201]">Are you an Agency Chief Executive Officer (CEO)?</h3>
              <p className="text-xs text-slate-400">Register your agency & answer the 3 mandatory CEO professional questions to manage your models.</p>
            </div>
          </div>
          <button
            onClick={() => setShowAgencyModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FAD201] text-slate-900 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0 shadow-md"
          >
            Register Agency & CEO
          </button>
        </div>

        {showAgencyModal && (
          <RegisterAgencyModal
            onClose={() => setShowAgencyModal(false)}
            onSuccess={() => setShowAgencyModal(false)}
          />
        )}

        {/* Digital ID Card Preview Section (If logged in) */}
        {user && (
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#12161A] to-[#1E2630] text-white border border-slate-800 shadow-2xl max-w-xl mx-auto relative overflow-hidden">
            {/* Background Ribbon Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00A1DE]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00A1DE] flex items-center justify-center font-bold font-serif text-sm">
                  A
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-sm tracking-wide">
                    ARMA DIGITAL MEMBERSHIP CARD
                  </h3>
                  <span className="text-[9px] font-mono text-[#00A1DE]">
                    REPUBLIC OF RWANDA REGISTRY
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#20603D] text-white">
                {user.membershipLevel}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#00A1DE] shadow-lg shrink-0"
              />

              <div className="space-y-1 text-xs font-mono flex-1">
                <h4 className="text-base font-serif font-bold text-white font-sans">
                  {user.name}
                </h4>
                <p className="text-[#00A1DE]">
                  ROLE: <strong>{user.role}</strong>
                </p>
                <p className="text-slate-400">
                  ID: <strong className="text-slate-200">{user.memberId}</strong>
                </p>
                <p className="text-slate-400">
                  LOCATION: <strong className="text-slate-200">{user.location || 'Kigali, Rwanda'}</strong>
                </p>
              </div>

              {digitalIdQr && (
                <div className="shrink-0 text-center bg-white p-1.5 rounded-xl border">
                  <img src={digitalIdQr} alt="QR Code" className="w-16 h-16" />
                  <span className="text-[8px] font-mono text-slate-800 font-bold block">VERIFIED</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>ISSUED BY: ARMA SECRETARIAT</span>
              <button
                onClick={() => window.print()}
                className="text-[#00A1DE] hover:underline flex items-center gap-1 font-bold"
              >
                <Download className="w-3 h-3" /> Save Card
              </button>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-serif font-bold">Online Membership Application</h3>
            <p className="text-xs text-slate-500">
              Complete the accreditation form for approval by the ARMA Executive Board.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Select Membership Category</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-[#00A1DE]"
              >
                <option value="Model">Professional Model</option>
                <option value="Agency">Modeling Agency</option>
                <option value="Scout">Talent Scout</option>
                <option value="Fashion Organization">Fashion Organization / Designer</option>
                <option value="Brand">Fashion Brand</option>
                <option value="Photographer">Photographer</option>
                <option value="Makeup Artist">Makeup Artist</option>
                <option value="Event Organizer">Event Organizer</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marie-Claire Umutoni"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. marie@gmail.com"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Telephone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Rwandan National ID / Passport</label>
                <input
                  type="text"
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="1199..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Province</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Kigali City">Kigali City</option>
                  <option value="Northern Province">Northern Province</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Eastern Province">Eastern Province</option>
                  <option value="Western Province">Western Province</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Nyarugenge / Gasabo / Musanze"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Portfolio / Instagram Link (Optional)</label>
              <input
                type="url"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                placeholder="https://instagram.com/my_portfolio"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#00A1DE] text-white font-semibold text-sm hover:bg-[#0081B3] transition-colors flex items-center justify-center gap-2 shadow-xl"
            >
              <Send className="w-4 h-4" />
              Submit Application to ARMA Secretariat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
