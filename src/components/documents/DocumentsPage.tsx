import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, Search, ShieldCheck, Eye } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <FileText className="w-3.5 h-3.5 text-[#00A1DE]" />
            ASSOCIATION CONSTITUTION & LEGAL REPOSITORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            Official Documents Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Download the official ARMA Constitution, Model Welfare Rules, Standard Agency Application Forms, and Code of Conduct documents.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title or category..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-[#00A1DE]"
          />
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 max-w-lg mx-auto">
            <FileText className="w-12 h-12 text-[#00A1DE] mx-auto opacity-70" />
            <h3 className="text-xl font-serif font-bold">No official documents uploaded yet.</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Official legal documents and application forms will be published here by the ARMA Secretariat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#00A1DE]/10 text-[#00A1DE]">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {doc.fileFormat} • {doc.fileSize}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Downloads: {doc.downloadCount}
                  </span>

                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Downloading official PDF: ${doc.title}`); }}
                    className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
