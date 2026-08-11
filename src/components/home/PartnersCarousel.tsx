import React from 'react';
import { ShieldCheck, Award, Building } from 'lucide-react';

export const PartnersCarousel: React.FC = () => {
  const partners = [
    { name: 'Ministry of Youth & Arts', category: 'Government Entity', logo: '🏛️ MYARTS' },
    { name: 'Visit Rwanda', category: 'Tourism Partner', logo: '🇷🇼 VISIT RWANDA' },
    { name: 'Kigali Fashion Week', category: 'Official Event', logo: '✨ KFW 2026' },
    { name: 'Mercedes-Benz Fashion Week Kigali', category: 'Luxury Partner', logo: '🏎️ MBFWK' },
    { name: 'Bank of Kigali', category: 'Financial Sponsor', logo: '🏦 BK GROUP' },
    { name: 'Inema Arts Center', category: 'Cultural Host', logo: '🎨 INEMA ARTS' },
    { name: 'Moshions Couture', category: 'Design House', logo: '👗 MOSHIONS' },
    { name: 'Kigali Marriott Hotel', category: 'Hospitality Partner', logo: '🏨 MARRIOTT' }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white border-t border-slate-800 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#FAD201]">
          INSTITUTIONAL TRUST & ALLIANCES
        </span>
        <h3 className="text-xl font-serif font-bold text-slate-200 mt-1">
          Official Strategic Partners & Sponsors
        </h3>
      </div>

      <div className="flex gap-6 animate-pulse hover:animate-none overflow-x-auto pb-4 px-4 scrollbar-none justify-start lg:justify-center">
        {partners.map((partner, idx) => (
          <div
            key={idx}
            className="shrink-0 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00A1DE] transition-all flex flex-col items-center justify-center min-w-[180px]"
          >
            <span className="text-xl font-bold font-mono text-white mb-1">
              {partner.logo}
            </span>
            <span className="text-xs font-semibold text-slate-300 text-center">
              {partner.name}
            </span>
            <span className="text-[10px] font-mono text-[#00A1DE] mt-0.5">
              {partner.category}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
