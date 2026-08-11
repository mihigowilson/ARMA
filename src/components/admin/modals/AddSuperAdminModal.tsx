import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { validateData, adminAddSuperAdminSchema } from '../../../lib/validationSchemas';

interface AddSuperAdminModalProps {
  onClose: () => void;
}

export const AddSuperAdminModal: React.FC<AddSuperAdminModalProps> = ({ onClose }) => {
  const { addSuperAdmin, showToast } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(adminAddSuperAdminSchema, {
      name,
      email,
      role: 'Super Administrator',
      accessLevel: 'Full'
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    addSuperAdmin(name, email);
    showToast(`Added Super Administrator ${name}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#FAD201]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Add Super Administrator</h3>
            <p className="text-xs text-slate-500">Create an executive board member account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Executive Director Hon. Jean-Paul Kagame"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Official Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. director@arma.org.rw or admin.test@arma.org.rw"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#00A1DE]/10 border border-[#00A1DE]/20 text-[#00A1DE] space-y-1">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <UserCheck className="w-3.5 h-3.5" /> Full Executive Privileges Granted
            </span>
            <p className="text-[10px] text-slate-400">
              This user will have full access to manage model registries, agency licensing, email dispatches, and system configuration.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg"
          >
            Create & Login as Super Admin
          </button>
        </form>
      </div>
    </div>
  );
};
