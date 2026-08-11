import React from 'react';
import { LEADERSHIP_MEMBERS } from '../../data/mockData';
import { ShieldCheck, Target, Award, Users, Compass, Phone } from 'lucide-react';

export const LeadershipPage: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FAD201]" />
            EXECUTIVE BOARD & SECRETARIAT
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            About ARMA & Leadership
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Founded under the Ministry of Youth & Arts, ARMA governs, protects, and promotes Rwanda's modeling talent ecosystem nationally and internationally.
          </p>
        </div>

        {/* Executive Board Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-center">
            Executive Board Members
          </h2>

          {LEADERSHIP_MEMBERS.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 max-w-lg mx-auto">
              <Users className="w-10 h-10 text-[#00A1DE] mx-auto opacity-70" />
              <h3 className="text-xl font-serif font-bold">ARMA Governance Board</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The Executive Board is governed by the Ministry of Youth & Arts and the ARMA General Secretariat. Official board member profiles will be populated following elections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {LEADERSHIP_MEMBERS.map((member, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4 hover:border-[#00A1DE] transition-all"
                >
                  <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#00A1DE]">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold">{member.name}</h3>
                    <span className="text-xs font-mono font-semibold text-[#00A1DE] block mt-0.5">
                      {member.role}
                    </span>
                    {member.contact && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <Phone className="w-3 h-3" /> Direct: {member.contact}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
