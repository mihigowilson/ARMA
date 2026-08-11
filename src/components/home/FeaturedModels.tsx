import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, CheckCircle2, ArrowRight, Eye, FileText } from 'lucide-react';

interface FeaturedModelsProps {
  setCurrentTab: (tab: string) => void;
}

export const FeaturedModels: React.FC<FeaturedModelsProps> = ({ setCurrentTab }) => {
  const { models, setSelectedModelModal } = useAuth();
  const featured = models.slice(0, 3);

  return (
    <section className="py-20 bg-slate-100 dark:bg-[#12161A] text-slate-900 dark:text-white transition-colors border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD201]" />
              OFFICIAL ROSTER HIGHLIGHTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mt-2">
              Featured Rwandan Models
            </h2>
          </div>

          <button
            onClick={() => setCurrentTab('directory')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A1DE] text-white text-sm font-semibold hover:bg-[#0081B3] transition-colors shadow-md"
          >
            Explore Full Model Directory
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featured.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 max-w-lg mx-auto">
            <Sparkles className="w-10 h-10 text-[#00A1DE] mx-auto opacity-70" />
            <h3 className="text-xl font-serif font-bold">No models found.</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No registered models are available yet. Registered models will appear here once profiles are added to the ARMA system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((model) => (
              <div
                key={model.id}
                className="group rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
              {/* Photo Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                <img
                  src={model.photos.headshot}
                  alt={model.fullName}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#00A1DE] text-white shadow-md">
                    {model.category}
                  </span>
                  {model.verifiedBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#20603D] text-white flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-[#FAD201]" /> ARMA Verified
                    </span>
                  )}
                </div>

                {/* Overlaid Bottom Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-serif font-bold tracking-tight">
                    {model.fullName}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    {model.province} • Height: {model.measurements.heightCm} cm
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Stats */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">BUST</span>
                    <span className="font-bold">{model.measurements.bustCm || '-'} cm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">WAIST</span>
                    <span className="font-bold">{model.measurements.waistCm || '-'} cm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">HIPS</span>
                    <span className="font-bold">{model.measurements.hipsCm || '-'} cm</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModelModal(model)}
                    className="flex-1 py-2.5 rounded-xl bg-[#00A1DE]/10 hover:bg-[#00A1DE] text-[#00A1DE] hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    View Portfolio
                  </button>
                  <button
                    onClick={() => setSelectedModelModal(model)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Generate Comp Card"
                  >
                    <FileText className="w-4 h-4 text-[#FAD201]" />
                    Comp Card
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};
