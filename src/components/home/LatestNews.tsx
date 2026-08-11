import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react';

interface LatestNewsProps {
  setCurrentTab: (tab: string) => void;
}

export const LatestNews: React.FC<LatestNewsProps> = ({ setCurrentTab }) => {
  const { news } = useAuth();

  return (
    <section className="py-20 bg-white dark:bg-[#0B0E11] text-slate-900 dark:text-white transition-colors border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
              <Newspaper className="w-3.5 h-3.5 text-[#00A1DE]" />
              GAZETTE & ANNOUNCEMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mt-2">
              Latest Industry News
            </h2>
          </div>

          <button
            onClick={() => setCurrentTab('news')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#00A1DE] hover:underline"
          >
            Read All Press Releases
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {news.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 max-w-lg mx-auto">
            <Newspaper className="w-10 h-10 text-[#00A1DE] mx-auto opacity-70" />
            <h3 className="text-xl font-serif font-bold">No press releases published yet.</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Official industry press releases and gazette articles will appear here once published by the ARMA Secretariat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((article) => (
              <div
                key={article.id}
                onClick={() => setCurrentTab('news')}
                className="group rounded-3xl bg-slate-50 dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row"
              >
              <div className="sm:w-2/5 aspect-video sm:aspect-auto relative overflow-hidden bg-slate-800">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#00A1DE] text-white">
                  {article.category}
                </span>
              </div>

              <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#00A1DE]" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FAD201]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#00A1DE] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="text-xs font-semibold text-[#00A1DE] flex items-center gap-1 pt-2">
                  Read Full Gazette Article
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
