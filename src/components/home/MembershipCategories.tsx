import React from 'react';
import {
  User,
  Building2,
  Search,
  Scissors,
  Camera,
  Sparkles,
  ShoppingBag,
  Calendar,
  Crown,
  ArrowUpRight
} from 'lucide-react';

interface MembershipCategoriesProps {
  setCurrentTab: (tab: string) => void;
}

export const MembershipCategories: React.FC<MembershipCategoriesProps> = ({ setCurrentTab }) => {
  const categories = [
    { title: 'Professional Models', count: '450+ Members', desc: 'High fashion, commercial, runway, editorial, & fitness models.', icon: User, tag: 'Models' },
    { title: 'Modeling Agencies', count: '28 Licensed', desc: 'Accredited talent agencies and catwalk training academies.', icon: Building2, tag: 'Agencies' },
    { title: 'Talent Scouts', count: '65 Certified', desc: 'Provincial scouts discovering grassroots fashion talents.', icon: Search, tag: 'Scouts' },
    { title: 'Fashion Designers', count: '50+ Houses', desc: 'Couture houses, streetwear labels, & Umushanana stylists.', icon: Scissors, tag: 'Designers' },
    { title: 'Photographers', count: '80+ Pros', desc: 'Editorial, commercial, runway, & portrait visual artists.', icon: Camera, tag: 'Photographers' },
    { title: 'Makeup Artists (MUA)', count: '60+ Artists', desc: 'Fashion runway, SFX, & editorial beauty practitioners.', icon: Sparkles, tag: 'MUA' },
    { title: 'Fashion Brands', count: '40+ Brands', desc: 'Retailers, cosmetics, activewear, & luxury houses.', icon: ShoppingBag, tag: 'Brands' },
    { title: 'Event Organizers', count: '25 Producers', desc: 'Fashion Week committees, casting directors, & pageant producers.', icon: Calendar, tag: 'Organizers' },
    { title: 'Patrons & Sponsors', count: 'Corporate', desc: 'Financial backers, venue partners, & institutional patrons.', icon: Crown, tag: 'Sponsors' }
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0B0E11] text-slate-900 dark:text-white transition-colors border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00A1DE] font-bold">
              Association Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mt-1">
              Membership Categories
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('membership')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#00A1DE] hover:underline"
          >
            View Full Membership Requirements & Apply
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentTab('membership')}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 hover:border-[#00A1DE] transition-all cursor-pointer group shadow-sm hover:shadow-xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center group-hover:bg-[#00A1DE] group-hover:text-white transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {cat.count}
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif mb-2 group-hover:text-[#00A1DE] transition-colors flex items-center justify-between">
                {cat.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00A1DE]" />
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
