import React from 'react';
import { ShieldCheck, Target, Eye, Compass, HeartHandshake, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const coreValues = [
    { title: 'Integrity & Safety', desc: 'Standardized contracts, harassment-free environments, and legal protection for all models.', icon: ShieldCheck },
    { title: 'Excellence & Discipline', desc: 'World-class runway standards, catwalk choreography, and professional ethics.', icon: Award },
    { title: 'Inclusivity & Unity', desc: 'Empowering talent from all 5 provinces of Rwanda regardless of background.', icon: HeartHandshake },
    { title: 'Global Ambition', desc: 'Connecting Rwandan creatives with Paris, Milan, New York, and Lagos fashion capitals.', icon: Compass }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#12161A] text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Mission & Vision */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4" />
              NATIONAL MANDATE & INSTITUTION
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight leading-tight">
              Regulating and Empowering <span className="text-[#00A1DE]">Rwanda’s Fashion Talents</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              The Association of Rwanda Models & Agencies (ARMA) was established as the primary self-regulatory governing body for Rwanda's modeling and commercial talent landscape. We bridge the gap between creative passion and institutional professionalism.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-2 text-[#00A1DE] font-bold text-base mb-2 font-serif">
                  <Target className="w-5 h-5 text-[#00A1DE]" />
                  Our Mission
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  To protect, develop, and represent models and agencies across Rwanda by establishing legal standards, ethical guidelines, and international growth pathways.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-2 text-[#20603D] font-bold text-base mb-2 font-serif">
                  <Eye className="w-5 h-5 text-[#20603D]" />
                  Our Vision
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  To position Rwanda as Africa’s premier fashion talent hub, celebrated for professional discipline, diversity, and global fashion impact.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Core Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-lg hover:border-[#00A1DE] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <val.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 font-serif">
                  {val.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
