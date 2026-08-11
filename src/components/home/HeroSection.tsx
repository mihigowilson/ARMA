import React from 'react';
import { ArmaLogo } from '../layout/ArmaLogo';
import { Sparkles, ArrowRight, Search, ShieldCheck, Users, Briefcase } from 'lucide-react';

interface HeroSectionProps {
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setCurrentTab, openAuthModal }) => {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Hero Image with Dark Gradient Mask */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000"
          alt="ARMA Rwanda High Fashion Runway"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-[#12161A]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12161A] via-transparent to-[#12161A]" />
      </div>

      {/* Decorative Rwanda Flag Accent Lighting */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#00A1DE]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#20603D]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FAD201]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* National Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono tracking-wide text-slate-200 shadow-2xl">
          <ShieldCheck className="w-4 h-4 text-[#FAD201]" />
          <span>OFFICIAL NATIONAL INDUSTRY BODY OF THE REPUBLIC OF RWANDA</span>
        </div>

        {/* Large ARMA Logo Accent */}
        <div className="flex justify-center pt-2">
          <ArmaLogo size="lg" />
        </div>

        {/* Powerful Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight leading-tight max-w-4xl mx-auto">
          Elevating <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A1DE] via-[#FAD201] to-emerald-400">Rwanda's Modeling Talent</span> to Global Excellence
        </h1>

        {/* Introduction */}
        <p className="text-slate-300 text-base sm:text-xl font-sans max-w-3xl mx-auto leading-relaxed font-light">
          ARMA (Association of Rwanda Models & Agencies) protects model rights, regulates professional agencies, certifies talent scouts, and connects Rwandan fashion practitioners with international casting directors and global luxury brands.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentTab('membership')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00A1DE] to-[#0081B3] text-white font-semibold text-base shadow-xl shadow-[#00A1DE]/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 text-[#FAD201]" />
            Join ARMA Association
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentTab('directory')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5 text-[#00A1DE]" />
            Find Models
          </button>

          <button
            onClick={() => setCurrentTab('directory')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/15 text-white font-semibold text-base backdrop-blur-md border border-white/10 shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Briefcase className="w-5 h-5 text-[#20603D]" />
            Find Agencies
          </button>
        </div>

        {/* Quick Highlights */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-mono text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A1DE]" />
            <span>Digital ID Card Verification</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FAD201]" />
            <span>Standard Fair Contracts</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#20603D]" />
            <span>Global Casting Access</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Official Training Certificates</span>
          </div>
        </div>
      </div>
    </section>
  );
};
