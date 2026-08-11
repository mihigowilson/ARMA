import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DocumentItem } from '../../../types/arma';
import { validateData, adminCreateDocumentSchema } from '../../../lib/validationSchemas';

interface CreateDocumentModalProps {
  onClose: () => void;
}

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({ onClose }) => {
  const { addDocument, showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('Policies');
  const [description, setDescription] = useState('');
  const [fileFormat, setFileFormat] = useState('PDF Document');
  const [fileSize, setFileSize] = useState('2.4 MB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(adminCreateDocumentSchema, {
      title,
      category,
      description: description || title + ' - Official regulatory document issued by ARMA.',
      fileFormat,
      fileSize,
      downloadUrl: '#'
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title,
      category,
      fileSize,
      fileFormat,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      downloadCount: 1,
      description: description || 'Official document issued under the Republic of Rwanda ARMA regulatory framework.',
      fileUrl: '#'
    };

    addDocument(newDoc);
    showToast(`Added official document "${title}"!`, 'success');
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Upload Official Document</h3>
            <p className="text-xs text-slate-500">Add constitutions, code of conduct, forms, or guidelines</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Model Safeguarding Policy & Code of Ethics"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="Constitution">Constitution</option>
                <option value="Policies">Policies</option>
                <option value="Code of Conduct">Code of Conduct</option>
                <option value="Forms">Forms</option>
                <option value="Guidelines">Guidelines</option>
                <option value="Security & Privacy">Security & Privacy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">File Format</label>
              <input
                type="text"
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Document Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of policy directives contained..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg"
          >
            Upload Official Document
          </button>
        </form>
      </div>
    </div>
  );
};
