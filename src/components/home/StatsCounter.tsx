import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Building2, UserCheck, CalendarCheck, Award } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const { models, agencies, events, castings } = useAuth();

  const stats = [
    {
      id: 'models',
      label: 'Registered Models',
      count: models.length.toString(),
      subtext: 'High Fashion, Commercial & Runway',
      icon: Users,
      color: 'from-[#00A1DE]/20 to-[#00A1DE]/5 text-[#00A1DE]',
      border: 'border-[#00A1DE]/30'
    },
    {
      id: 'agencies',
      label: 'Registered Agencies',
      count: agencies.length.toString(),
      subtext: 'Licensed & ARMA Accredited',
      icon: Building2,
      color: 'from-[#FAD201]/20 to-[#FAD201]/5 text-[#FAD201]',
      border: 'border-[#FAD201]/30'
    },
    {
      id: 'castings',
      label: 'Casting Calls',
      count: castings.length.toString(),
      subtext: 'Active Jobs & Commercial Campaigns',
      icon: UserCheck,
      color: 'from-[#20603D]/20 to-[#20603D]/5 text-[#20603D]',
      border: 'border-[#20603D]/30'
    },
    {
      id: 'events',
      label: 'Fashion Events',
      count: events.length.toString(),
      subtext: 'Fashion Weeks, Castings & Shows',
      icon: CalendarCheck,
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400',
      border: 'border-purple-500/30'
    },
    {
      id: 'partners',
      label: 'Partner Organizations',
      count: '8',
      subtext: 'Govt, Institutional & Media Allies',
      icon: Award,
      color: 'from-sky-500/20 to-sky-500/5 text-sky-400',
      border: 'border-sky-500/30'
    }
  ];

  return (
    <section className="py-12 bg-[#12161A] border-y border-slate-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00A1DE]">
            National Metrics & Industry Impact
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Official Registry Statistics
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-md flex flex-col justify-between hover:scale-105 transition-transform shadow-xl`}
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300">
                  Verified
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white mb-1">
                  {item.count}
                </div>
                <div className="text-sm font-semibold text-slate-200 leading-tight">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {item.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
