import React, { useState } from 'react';
import { X, Newspaper } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { NewsItem } from '../../../types/arma';
import { validateData, adminCreateNewsSchema } from '../../../lib/validationSchemas';

interface CreateNewsModalProps {
  onClose: () => void;
}

export const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ onClose }) => {
  const { addNews, showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsItem['category']>('National Announcement');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(adminCreateNewsSchema, {
      title,
      category,
      summary: summary || title + ' - Official press release summary.',
      content: content || summary || title + ' - Official news release details.',
      author: 'ARMA Executive Secretariat',
      image: imageUrl
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newNews: NewsItem = {
      id: `news-${Date.now()}`,
      title,
      slug,
      category,
      summary: summary || 'Official announcement released by the Executive Board of ARMA.',
      content: content || summary || 'Official communication published in the Rwanda National Modeling Gazette.',
      author: 'ARMA Executive Secretariat',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
      image: imageUrl,
      featured: true
    };

    addNews(newNews);
    showToast(`Published news article "${title}"!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Publish Official News / Gazette</h3>
            <p className="text-xs text-slate-500">Dispatch announcements to members & modeling sector</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Article Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Executive Board Approves New Agency Commission Caps"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="National Announcement">National Announcement</option>
              <option value="Industry Insights">Industry Insights</option>
              <option value="Event Highlights">Event Highlights</option>
              <option value="Member Focus">Member Focus</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Summary Lead</label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of the announcement..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Full Article Body</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full text of the Gazette announcement..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg"
          >
            Publish Article to Gazette
          </button>
        </form>
      </div>
    </div>
  );
};
