import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Building2, Briefcase, HelpCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { validateData, agencyStep1Schema, agencyCeoQuestionsSchema } from '../../lib/validationSchemas';

interface RegisterAgencyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterAgencyModal: React.FC<RegisterAgencyModalProps> = ({ onClose, onSuccess }) => {
  const { registerAgencyAndCEO, showToast } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // CEO Details
  const [ceoName, setCeoName] = useState('');
  const [ceoEmail, setCeoEmail] = useState('');
  const [ceoPhone, setCeoPhone] = useState('');

  // Agency Details
  const [agencyName, setAgencyName] = useState('');
  const [province, setProvince] = useState('Kigali City');
  const [district, setDistrict] = useState('Gasabo');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 3 Professional Questions for CEO
  const [operatingYears, setOperatingYears] = useState('3 Years in Rwanda');
  const [welfarePolicies, setWelfarePolicies] = useState(
    'Standard written contract guarantees, minimum 150,000 RWF show rate, strict age 18+ verification, and zero harassment set policy.'
  );
  const [primaryFocus, setPrimaryFocus] = useState('High Fashion Runway & Commercial TV Advertising');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const validation = validateData(agencyStep1Schema, {
      agencyName,
      ceoName,
      email: ceoEmail,
      phone: ceoPhone,
      province,
      district,
      sector: 'Gikondo', // default sector for step validation
      licenseNumber: 'RDB-' + Math.floor(100000 + Math.random() * 900000)
    });

    if (!validation.success) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstError}`, 'error');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const validation = validateData(agencyCeoQuestionsSchema, {
      operatingYears,
      welfarePolicies,
      primaryFocus
    });

    if (!validation.success) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstError}`, 'error');
      return;
    }

    registerAgencyAndCEO(
      {
        agencyName,
        province,
        district,
        address,
        website,
        email: ceoEmail,
        phone: ceoPhone,
        description
      },
      {
        name: ceoName,
        email: ceoEmail,
        phone: ceoPhone
      },
      {
        operatingYears,
        welfarePolicies,
        primaryFocus
      }
    );

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAD201]/20 text-[#FAD201] flex items-center justify-center font-bold text-xl shadow-inner">
            <Building2 className="w-6 h-6 text-[#FAD201]" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#00A1DE] uppercase tracking-wider font-bold block">
              ARMA Official Accreditation Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              Register Modeling Agency & CEO Admin
            </h2>
          </div>
        </div>

        {/* Progress Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div
            className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              step === 1
                ? 'bg-[#00A1DE] text-white border-[#00A1DE]'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <span>1. CEO & Agency Details</span>
          </div>
          <div
            className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
              step === 2
                ? 'bg-[#00A1DE] text-white border-[#00A1DE]'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <span>2. 3 Professional Questions</span>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] border border-[#00A1DE]/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Registering as Agency CEO grants you full Agency Admin capabilities to manage models, castings, and roster contracts.
              </span>
            </div>

            {/* CEO Information */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#FAD201]">1. Agency CEO / Executive Officer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">CEO Full Name *</label>
                  <input
                    type="text"
                    required
                    value={ceoName}
                    onChange={(e) => setCeoName(e.target.value)}
                    placeholder="e.g. Sonia Umutoni"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">CEO Official Email *</label>
                  <input
                    type="email"
                    required
                    value={ceoEmail}
                    onChange={(e) => setCeoEmail(e.target.value)}
                    placeholder="e.g. ceo@agency.rw"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">CEO Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={ceoPhone}
                    onChange={(e) => setCeoPhone(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Agency Profile Details */}
            <div className="space-y-3 pt-2">
              <h3 className="font-serif font-bold text-sm text-[#00A1DE]">2. Modeling Agency Corporate Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Registered Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Great Lakes Fashion Models Agency"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Province</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold"
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
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Gasabo / Nyarugenge"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Physical Office Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. KG 7 Ave, Kigali"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Official Website / Portfolio</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://agency.rw"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Agency Overview / Focus</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your agency's background and roster focus..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-2 shadow-lg"
              >
                Continue to 3 Professional Questions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#FAD201]/10 text-amber-600 dark:text-[#FAD201] border border-[#FAD201]/20 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>
                To complete ARMA CEO licensing, please answer these 3 mandatory professional evaluation questions.
              </span>
            </div>

            {/* Question 1 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block font-serif font-bold text-sm text-slate-900 dark:text-white">
                1. How many years of registered operating experience does your agency have in Rwanda or East Africa?
              </label>
              <select
                value={operatingYears}
                onChange={(e) => setOperatingYears(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 font-semibold text-xs"
              >
                <option value="New Startup (Under 1 Year)">New Startup Agency (Under 1 Year)</option>
                <option value="1 - 3 Years in Rwanda">1 - 3 Years of Active Operations</option>
                <option value="3 - 5 Years in East Africa">3 - 5 Years Regional Experience</option>
                <option value="5+ Years Established Agency">5+ Years Established Market Leader</option>
              </select>
            </div>

            {/* Question 2 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block font-serif font-bold text-sm text-slate-900 dark:text-white">
                2. What standard contract protections and model welfare policies (e.g. minimum fee, age verification, safe sets) does your agency enforce?
              </label>
              <textarea
                rows={3}
                required
                value={welfarePolicies}
                onChange={(e) => setWelfarePolicies(e.target.value)}
                placeholder="Detail your agency's minimum compensation guarantee, age requirements, chaperones, and harassment policies..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            {/* Question 3 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block font-serif font-bold text-sm text-slate-900 dark:text-white">
                3. What is your agency's primary commercial focus or client portfolio?
              </label>
              <input
                type="text"
                required
                value={primaryFocus}
                onChange={(e) => setPrimaryFocus(e.target.value)}
                placeholder="e.g. High Fashion Runway, Commercial TVCs, Editorial Photography, Paris & Milan Placements"
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Back to Details
              </button>

              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-[#20603D] text-white font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FAD201]" /> Submit Agency & CEO Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
