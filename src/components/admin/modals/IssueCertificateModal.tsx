import React, { useState } from 'react';
import { X, Award, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { CertificateItem } from '../../../types/arma';
import { validateData, adminIssueCertSchema } from '../../../lib/validationSchemas';

interface IssueCertificateModalProps {
  onClose: () => void;
}

export const IssueCertificateModal: React.FC<IssueCertificateModalProps> = ({ onClose }) => {
  const { addCertificate, showToast } = useAuth();

  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('Certified Agency / Model');
  const [courseTitle, setCourseTitle] = useState('Licensed Modeling Agency Operating Certificate');
  const [issueDate, setIssueDate] = useState('2026-01-15');
  const [expiryDate, setExpiryDate] = useState('2027-01-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const certNum = `ARMA-CERT-2026-${randomNum}`;

    const validation = validateData(adminIssueCertSchema, {
      recipientName,
      certificateType: courseTitle,
      memberId: certNum,
      issueDate,
      expiryDate
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const newCert: CertificateItem = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      recipientName,
      recipientRole,
      courseTitle,
      issueDate,
      expiryDate,
      verified: true,
      qrCodeData: `https://arma.org.rw/verify/${certNum}`,
      issuerName: 'ARMA Secretariat & Accreditation Board'
    };

    addCertificate(newCert);
    showToast(`Issued certificate ${certNum} for ${recipientName}!`, 'success');
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
            <Award className="w-5 h-5 text-[#FAD201]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Issue Official ARMA Certificate</h3>
            <p className="text-xs text-slate-500">Generate a digital QR verification certificate</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Recipient Full Name / Organization *</label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Kigali International Models Ltd"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Recipient Category / Role</label>
            <input
              type="text"
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value)}
              placeholder="e.g. Licensed Agency CEO / Senior Professional Model"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Certificate / Accreditation Title</label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g. Professional Modeling Ethics & Safety Accreditation"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#FAD201]" /> Issue Verified Certificate
          </button>
        </form>
      </div>
    </div>
  );
};
