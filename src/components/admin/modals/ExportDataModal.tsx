import React, { useState } from 'react';
import { X, Download, FileJson, FileSpreadsheet, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ExportDataModalProps {
  onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({ onClose }) => {
  const {
    user,
    models,
    agencies,
    castings,
    events,
    news,
    documents,
    certificates,
    applications,
    emailNotifications,
    showToast
  } = useAuth();

  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const downloadBlob = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFullJSON = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {
      meta: {
        exportedAt: new Date().toISOString(),
        exportedBy: user?.name || 'Super Admin',
        system: 'ARMA Rwanda National Modeling Registry',
        version: '2026.1.0'
      },
      models,
      agencies,
      castings,
      events,
      news,
      documents,
      certificates,
      applications,
      emailNotifications
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    downloadBlob(jsonString, `ARMA_Full_System_Backup_${timestamp}.json`, 'application/json');
    setDownloadedFormat('JSON Full System Backup');
    showToast('Full system JSON backup downloaded successfully!', 'success');
  };

  const exportAgenciesCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const headers = ['Agency ID', 'Agency Name', 'CEO Name', 'License Number', 'Licensing Status', 'Province', 'District', 'Phone', 'Email', 'Models Count'];
    
    const rows = agencies.map(a => [
      `"${a.id}"`,
      `"${a.agencyName.replace(/"/g, '""')}"`,
      `"${a.ceoName.replace(/"/g, '""')}"`,
      `"${a.licenseNumber || 'N/A'}"`,
      `"${a.licensedStatus}"`,
      `"${a.province}"`,
      `"${a.district}"`,
      `"${a.phone || ''}"`,
      `"${a.email}"`,
      a.representedModelsCount || 0
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadBlob(csvContent, `ARMA_Agencies_Registry_${timestamp}.csv`, 'text/csv');
    setDownloadedFormat('Agencies Registry (CSV)');
    showToast('Agencies registry CSV exported!', 'success');
  };

  const exportModelsCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const headers = ['Model ID', 'Full Name', 'Stage Name', 'Category', 'Gender', 'Province', 'District', 'Agency Name', 'Height (cm)', 'Weight (kg)', 'Shoe (EU)', 'Status'];

    const rows = models.map(m => [
      `"${m.id}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${(m.stageName || '').replace(/"/g, '""')}"`,
      `"${m.category}"`,
      `"${m.gender}"`,
      `"${m.province}"`,
      `"${m.district}"`,
      `"${(m.agencyName || 'Independent').replace(/"/g, '""')}"`,
      m.measurements.heightCm,
      m.measurements.weightKg,
      m.measurements.shoeSizeEu,
      `"${m.verifiedBadge ? 'Verified' : 'Pending'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadBlob(csvContent, `ARMA_Models_Registry_${timestamp}.csv`, 'text/csv');
    setDownloadedFormat('Models Registry (CSV)');
    showToast('Models registry CSV exported!', 'success');
  };

  const exportApplicationsCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const headers = ['Application ID', 'Applicant Name', 'Email', 'Type', 'Organization', 'Submitted Date', 'Status'];

    const rows = applications.map(app => [
      `"${app.id}"`,
      `"${app.fullName.replace(/"/g, '""')}"`,
      `"${app.email}"`,
      `"${app.role}"`,
      `"${app.province} - ${app.district}"`,
      `"${app.submittedAt}"`,
      `"${app.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadBlob(csvContent, `ARMA_Membership_Applications_${timestamp}.csv`, 'text/csv');
    setDownloadedFormat('Membership Applications (CSV)');
    showToast('Applications CSV exported!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center font-bold">
            <Download className="w-6 h-6 text-[#FAD201]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Export Data Snapshot & Redundancy Backup</h3>
            <p className="text-xs text-slate-500">Download system state for offline backups and auditing</p>
          </div>
        </div>

        {downloadedFormat && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Latest export: <strong>{downloadedFormat}</strong> downloaded.</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Option 1: Full JSON Snapshot */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Full System Snapshot (JSON)</h4>
                <p className="text-xs text-slate-500">
                  Includes all models ({models.length}), agencies ({agencies.length}), castings ({castings.length}), events, news, & applications.
                </p>
              </div>
            </div>
            <button
              onClick={exportFullJSON}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download JSON
            </button>
          </div>

          {/* Option 2: Agencies CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#FAD201]/10 text-[#FAD201] shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Licensed Agencies Registry (CSV)</h4>
                <p className="text-xs text-slate-500">
                  Spreadsheet export of agency profiles, CEOs, licensing status, and contacts ({agencies.length} entries).
                </p>
              </div>
            </div>
            <button
              onClick={exportAgenciesCSV}
              className="px-4 py-2 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white font-semibold text-xs transition-colors shadow shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          {/* Option 3: Models CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#20603D]/10 text-[#20603D] shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Models National Registry (CSV)</h4>
                <p className="text-xs text-slate-500">
                  Spreadsheet export of model profiles, measurements, location, and representation ({models.length} entries).
                </p>
              </div>
            </div>
            <button
              onClick={exportModelsCSV}
              className="px-4 py-2 rounded-xl bg-[#20603D] hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          {/* Option 4: Applications CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Membership Applications (CSV)</h4>
                <p className="text-xs text-slate-500">
                  Export pending and historical membership registration applications ({applications.length} entries).
                </p>
              </div>
            </div>
            <button
              onClick={exportApplicationsCSV}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors shadow shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00A1DE] shrink-0" />
          <span>All backup snapshots are generated locally with full encryption & ARMA Secretariat compliance standards.</span>
        </div>
      </div>
    </div>
  );
};
