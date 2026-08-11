import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NewsItem } from '../../types/arma';
import { BookOpen, Calendar, Clock, ArrowLeft, Search, Share2 } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { news } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {selectedArticle ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00A1DE] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to News Index
            </button>

            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00A1DE] text-white">
                {selectedArticle.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight leading-snug">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 border-y py-2">
                <span>Author: {selectedArticle.author}</span>
                <span>•</span>
                <span>Date: {selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line text-slate-700 dark:text-slate-300">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
                <BookOpen className="w-3.5 h-3.5 text-[#00A1DE]" />
                ARMA PRESS & MEDIA GAZETTE
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
                National Industry Press Releases
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Official statements, policy updates, fashion week retrospectives, and model spotlight stories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-900">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00A1DE] text-white">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#00A1DE] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
