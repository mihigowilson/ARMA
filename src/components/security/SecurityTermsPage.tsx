import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Key, 
  Server, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Download, 
  Search, 
  Building2, 
  UserCheck, 
  ChevronRight,
  Printer,
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SecurityTermsPageProps {
  initialSection?: 'security' | 'terms' | 'privacy' | 'safeguarding';
}

export const SecurityTermsPage: React.FC<SecurityTermsPageProps> = ({ initialSection = 'security' }) => {
  const { showToast } = useAuth();
  const [activeSection, setActiveSection] = useState<'security' | 'terms' | 'privacy' | 'safeguarding'>(initialSection);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadPDF = (title: string) => {
    showToast(`Downloading official ARMA document: ${title}`, 'info');
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B0E11] via-[#161C22] to-[#0B0E11] text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A1DE]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#20603D]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A1DE]/10 border border-[#00A1DE]/30 text-[#00A1DE] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#FAD201]" />
              Official Government Framework • Republic of Rwanda
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
              Security Architecture & Regulatory Terms
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Comprehensive high-level security protocols, data protection standards in compliance with Rwanda Law N° 058/2021, and legally binding Terms of Association governing model welfare, fair compensation, and ethical agency licensing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#20603D]" /> Rwanda Data Privacy Law Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-[#00A1DE]" /> SHA-256 Digital Signature Verification
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Scale className="w-4 h-4 text-[#FAD201]" /> Model Welfare Code of Ethics
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSection('security')}
            className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'security'
                ? 'bg-[#00A1DE] text-white shadow-lg'
                : 'bg-white dark:bg-[#1E2630] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" /> 1. High-Level Security Aspects
          </button>
          <button
            onClick={() => setActiveSection('terms')}
            className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'terms'
                ? 'bg-[#00A1DE] text-white shadow-lg'
                : 'bg-white dark:bg-[#1E2630] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" /> 2. Terms of Association & Model Bylaws
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'privacy'
                ? 'bg-[#00A1DE] text-white shadow-lg'
                : 'bg-white dark:bg-[#1E2630] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> 3. Data Privacy & Consent Policy
          </button>
          <button
            onClick={() => setActiveSection('safeguarding')}
            className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeSection === 'safeguarding'
                ? 'bg-[#00A1DE] text-white shadow-lg'
                : 'bg-white dark:bg-[#1E2630] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 4. Safeguarding & Fair Compensation
          </button>
        </div>

        {/* Section 1: High Level Security Aspects */}
        {activeSection === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-6 h-6 text-[#00A1DE]" />
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    Platform Technical Security Architecture
                  </h2>
                </div>
                <button
                  onClick={() => handleDownloadPDF('ARMA_Technical_Security_Standard.pdf')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Security Spec PDF
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                The African Rwanda Modeling Association (ARMA) digital infrastructure operates under strict enterprise cybersecurity standards to safeguard sensitive model identities, financial contracts, biometric measurements, and official government credentials against unauthorized disclosure, alteration, or misuse.
              </p>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Pillar 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center font-bold">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    Cryptographic Signature Verification (SHA-256)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Every official ARMA Member Certificate, Agency Accreditation License, and Model Identification Card is embedded with a unique SHA-256 cryptographic hash signed by the Secretariat's private key. Scanning the embedded QR code performs real-time validation against the central registry to prevent fraudulent credentials.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#20603D]/10 text-[#20603D] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    Strict Role-Based Access Control (RBAC)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Granular permissions separate Super Administrators, Agency CEOs, Models, and Talent Scouts. Agency CEOs can only view and manage models within their verified contract roster. Public users access redacted portfolios without exposing personal contact or passport details.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    End-to-End Encryption & Storage Safety
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    All network communication utilizes TLS 1.3 transport encryption. Stored media, government identity cards, contracts, and model biometric measurements are encrypted at rest using AES-256 enterprise-grade storage keys.
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    Automated Administrative Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Whenever a Super Administrator alters an agency's verification standing (e.g. Licensed, Provisionary, Suspended), an immutable log entry is generated and an automated notification email is immediately dispatched to the CEO inbox.
                  </p>
                </div>

              </div>
            </div>

            {/* Security Summary Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12161A] via-[#1E2630] to-[#12161A] text-white border border-slate-800 space-y-3">
              <h3 className="text-sm font-mono text-[#00A1DE] font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FAD201]" /> Vulnerability Reporting & Incident Response
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you identify a potential security vulnerability or unauthorized credential misuse on the ARMA portal, please contact the ARMA Cybersecurity Secretariat immediately at <strong className="text-white">security@arma.org.rw</strong> or emergency phone <strong className="text-[#00A1DE]">+250 788 123 456</strong>. All security alerts are triaged within 2 hours.
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Terms of Association & Model Bylaws */}
        {activeSection === 'terms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    ARMA Terms of Association & Code of Conduct
                  </h2>
                  <p className="text-xs text-slate-500">
                    Legally binding rules governing all models, agencies, casting directors, and scouts operating in Rwanda.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadPDF('ARMA_Constitution_Bylaws_2026.pdf')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Full Bylaws PDF
                </button>
              </div>

              <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                
                {/* Clause 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#00A1DE] text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
                    Mandatory Agency Accreditation
                  </h3>
                  <p>
                    No commercial entity or individual may recruit, represent, or execute financial contracts for models in the Republic of Rwanda without holding an active <strong className="text-slate-900 dark:text-white">ARMA Accreditation License</strong>. Operating an uncertified agency constitutes a violation of national cultural sector directives and leads to immediate legal cessation.
                  </p>
                </div>

                {/* Clause 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#20603D] text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                    Model Representation Commission Cap (Max 20%)
                  </h3>
                  <p>
                    Licensed modeling agencies are strictly prohibited from deducting more than <strong className="text-emerald-500">20% commission</strong> on local modeling contracts and <strong className="text-emerald-500">25% commission</strong> on international placement contracts. Agencies must provide transparent quarterly accounting statements to represented models.
                  </p>
                </div>

                {/* Clause 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-900 font-mono text-xs flex items-center justify-center font-bold">3</span>
                    Zero-Tolerance Workplace Harassment & Professional Ethics
                  </h3>
                  <p>
                    ARMA maintains zero tolerance for verbal, financial, physical, or sexual exploitation. Casting directors and agency managers must ensure safe changing facilities, water, and security during all fashion events and photo sessions. Any confirmed breach results in permanent license revocation and referral to law enforcement.
                  </p>
                </div>

                {/* Clause 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
                    Image Rights & Licensing Terms
                  </h3>
                  <p>
                    Models retain fundamental personal image rights. Commercial usage contracts must explicitly define duration, geographical scope (e.g., East Africa, Worldwide), and media channels (e.g., Print, Digital, Billboard). Perpetuity usage without explicit additional compensation is strictly invalid under ARMA rules.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Section 3: Data Privacy & Consent Policy */}
        {activeSection === 'privacy' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    Data Privacy Policy (Rwanda Law N° 058/2021)
                  </h2>
                  <p className="text-xs text-slate-500">
                    How personal data, portfolio photographs, and contact info are processed and protected.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#20603D] bg-[#20603D]/10 px-3 py-1 rounded-xl border border-[#20603D]/30">
                  Registered Data Controller
                </span>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  In accordance with <strong className="text-slate-900 dark:text-white">Rwanda Law N° 058/2021 of 13/10/2021</strong> relating to the protection of personal data and privacy, the African Rwanda Modeling Association (ARMA) serves as the official Data Controller for the national modeling database.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold font-serif text-slate-900 dark:text-white text-xs">
                      1. What Data We Collect
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                      <li>Full Legal Name & National Identity Number (NIN / Passport)</li>
                      <li>Professional Biometric Measurements (Height, Bust, Waist, Shoe Size)</li>
                      <li>High-resolution Portfolio Photographs & Comp Cards</li>
                      <li>Agency Representation Contracts & Compensation History</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold font-serif text-slate-900 dark:text-white text-xs">
                      2. Your Rights as a Data Subject
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                      <li>Right to access and review your registered profile data</li>
                      <li>Right to request immediate correction or updating of portfolio details</li>
                      <li>Right to request deletion/anonymization upon agency contract termination</li>
                      <li>Right to lodge a complaint with the Rwanda Data Protection Authority</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#00A1DE]/10 border border-[#00A1DE]/30 text-slate-800 dark:text-slate-200 space-y-1">
                  <h4 className="font-bold font-serif text-xs text-[#00A1DE]">
                    Data Protection Officer Contact
                  </h4>
                  <p className="text-xs">
                    For data protection inquiries or to exercise your rights under Law N° 058/2021, contact <strong className="text-[#00A1DE]">dpo@arma.org.rw</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Safeguarding & Fair Compensation */}
        {activeSection === 'safeguarding' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Child Model Safeguarding & Fair Pay Standards
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mandatory protection guidelines for underage talent and minimum wage thresholds for fashion shows.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold font-serif text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#20603D]" /> Underage Model Protection Protocols
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#20603D] font-bold">•</span>
                      <span><strong>Parental / Guardian Written Consent:</strong> Models under 18 years must have signed guardian consent uploaded to the ARMA portal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#20603D] font-bold">•</span>
                      <span><strong>Chaperone Requirement:</strong> An approved parent or guardian chaperone must accompany minor models to all castings, fitting sessions, and runway shows.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#20603D] font-bold">•</span>
                      <span><strong>Rest & Schooling Limits:</strong> Shoot schedules must not conflict with compulsory primary or secondary schooling hours.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold font-serif text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#00A1DE]" /> National Minimum Fair Pay Scale
                  </h3>
                  <div className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span>National Runway Show:</span>
                      <strong className="text-emerald-500">Min 150,000 RWF / Day</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span>Commercial Brand Campaign:</span>
                      <strong className="text-emerald-500">Min 350,000 RWF / Shoot</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span>Fitting / Rehearsal Session:</span>
                      <strong className="text-emerald-500">Min 30,000 RWF / Session</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
