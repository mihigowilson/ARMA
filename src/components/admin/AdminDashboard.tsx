import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Plus,
  HelpCircle,
  Award,
  AlertTriangle,
  UserCheck,
  Mail,
  Send,
  Eye,
  Search,
  Clock,
  TrendingUp,
  BarChart2,
  Trash2,
  RefreshCw,
  UserPlus,
  Calendar,
  Newspaper,
  Database,
  Lock,
  Bug
} from 'lucide-react';
import { EmailNotification } from '../../types/arma';
import { AnalyticsD3Widget } from './AnalyticsD3Widget';
import { SecuritySuite } from '../security/SecuritySuite';
import { CreateEventModal } from './modals/CreateEventModal';
import { CreateNewsModal } from './modals/CreateNewsModal';
import { CreateDocumentModal } from './modals/CreateDocumentModal';
import { IssueCertificateModal } from './modals/IssueCertificateModal';
import { AddSuperAdminModal } from './modals/AddSuperAdminModal';
import { ExportDataModal } from './modals/ExportDataModal';

import { AuditLogsViewer } from './AuditLogsViewer';

export const AdminDashboard: React.FC = () => {
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
    updateCastingStatus,
    approveApplication,
    rejectApplication,
    updateAgencyLicensingStatus,
    emailNotifications,
    setSelectedEmailModal,
    showToast,
    clearAllSampleData,
    restoreSampleData
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'security' | 'audit_logs' | 'analytics' | 'applications' | 'agencies' | 'users' | 'models' | 'content' | 'emails'>('security');
  const [selectedAgencyDetails, setSelectedAgencyDetails] = useState<string | null>(null);
  
  // Custom Status & Reason form state per agency
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'Licensed' | 'Provisionary' | 'Pending Renewal' | 'Under Review' | 'Suspended'>('Licensed');
  const [reasonNote, setReasonNote] = useState<string>('');

  // Email filter state
  const [emailSearch, setEmailSearch] = useState<string>('');

  // Modal open states
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isCreateNewsOpen, setIsCreateNewsOpen] = useState(false);
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [isIssueCertOpen, setIsIssueCertOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  // System Users list dynamically generated from actual registered accounts
  const systemUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    agencyName?: string;
    status: string;
  }> = [
    ...(user ? [{ id: user.id || 'usr-admin', name: user.name || 'System Administrator', email: user.email || 'admin@arma.org.rw', role: user.role === 'Admin' ? 'Super Admin' : user.role, status: 'Active' }] : []),
    ...agencies.map((a) => ({ id: `usr-${a.id}`, name: a.ceoName, email: a.email, role: 'Agency (CEO)', agencyName: a.agencyName, status: a.licensedStatus === 'Suspended' ? 'Suspended' : 'Active' })),
    ...models.map((m) => ({ id: `usr-${m.id}`, name: m.fullName, email: `${(m.stageName || m.fullName).toLowerCase().replace(/\s+/g, '')}@arma.org.rw`, role: 'Model', status: 'Active' }))
  ];

  const handleUpdateStatusAndSendEmail = (agencyId: string) => {
    updateAgencyLicensingStatus(agencyId, selectedStatus, reasonNote || undefined);
    setEditingAgencyId(null);
    setReasonNote('');
  };

  const filteredEmails = emailNotifications.filter(
    (e) =>
      e.recipientName.toLowerCase().includes(emailSearch.toLowerCase()) ||
      e.agencyName.toLowerCase().includes(emailSearch.toLowerCase()) ||
      e.recipientEmail.toLowerCase().includes(emailSearch.toLowerCase()) ||
      e.subject.toLowerCase().includes(emailSearch.toLowerCase())
  );

  return (
    <div className="py-6 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Admin Header Title */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12161A] via-[#1E2630] to-[#12161A] text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00A1DE] text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#FAD201]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold">
                ARMA Secretariat Super Admin Control Panel
              </h1>
              <p className="text-xs font-mono text-[#00A1DE] mt-0.5">
                Republic of Rwanda National Modeling Registry & Agency Governance
              </p>
            </div>
          </div>

          <div className="flex gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-slate-300">
              Registry Status: <strong className="text-emerald-400">100% Operational</strong>
            </span>
          </div>
        </div>

        {/* Data Management & Sample Data Action Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00A1DE]" />
            <span className="font-bold font-mono text-slate-700 dark:text-slate-200">
              Database Management & Super Admin Tools
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsExportDataOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all flex items-center gap-1.5 text-xs shadow-md"
            >
              <Database className="w-3.5 h-3.5 text-[#FAD201]" /> Export System Backup (JSON/CSV)
            </button>
            <button
              onClick={clearAllSampleData}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border border-red-500/20 font-semibold transition-all flex items-center gap-1.5 text-xs shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty All Sample Data
            </button>
            <button
              onClick={restoreSampleData}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold transition-all flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#00A1DE]" /> Reset System Database State
            </button>
            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#00A1DE] text-white hover:bg-[#0081B3] font-semibold transition-all flex items-center gap-1.5 text-xs shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#FAD201]" /> Add Super Admin
            </button>
          </div>
        </div>

        {/* Admin Stats Grid - Tight Gaps */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">REGISTERED MODELS</span>
            <strong className="text-xl font-extrabold text-[#00A1DE] font-mono block">{models.length}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">LICENSED AGENCIES</span>
            <strong className="text-xl font-extrabold text-[#FAD201] font-mono block">{agencies.length}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">ACTIVE CASTINGS</span>
            <strong className="text-xl font-extrabold text-[#20603D] font-mono block">{castings.length}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">PENDING APPS</span>
            <strong className="text-xl font-extrabold text-purple-400 font-mono block">
              {applications.filter((a) => a.status === 'Pending').length}
            </strong>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">DISPATCHED EMAILS</span>
            <strong className="text-xl font-extrabold text-[#00A1DE] font-mono block">{emailNotifications.length}</strong>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'security' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FAD201]" /> Security & Compliance Controls
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'audit_logs' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" /> Firestore Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#FAD201]" /> Growth Analytics (D3.js)
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'applications' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Submissions Queue ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('agencies')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'agencies' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#FAD201]" /> Manage Agencies ({agencies.length})
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'models' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#20603D]" /> Models Registry ({models.length})
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'content' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 text-[#00A1DE]" /> Content & Media Center
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'emails' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" /> Automated Email Logs ({emailNotifications.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> System Users
          </button>
        </div>

        {/* Security & Audit Suite Tab */}
        {activeTab === 'security' && (
          <SecuritySuite />
        )}

        {/* Firestore Audit Error Logs Tab */}
        {activeTab === 'audit_logs' && (
          <AuditLogsViewer />
        )}

        {/* D3.js Growth Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsD3Widget models={models} agencies={agencies} />
        )}

        {/* Pending Membership Applications */}
        {activeTab === 'applications' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <h3 className="text-base font-serif font-bold">Pending Accreditation Queue</h3>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No pending membership applications in review queue.</p>
            ) : (
              <div className="space-y-2.5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-serif">{app.fullName}</strong>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#00A1DE]/10 text-[#00A1DE] font-bold">
                          {app.role}
                        </span>
                      </div>
                      <p className="text-slate-500 font-mono">
                        Email: {app.email} • Phone: {app.phone} • National ID: {app.nationalId}
                      </p>
                      <p className="text-slate-400">
                        Location: {app.province} ({app.district}) • Submitted: {app.submittedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {app.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => approveApplication(app.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#20603D] text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FAD201]" /> Approve
                          </button>
                          <button
                            onClick={() => rejectApplication(app.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full font-mono font-bold text-[10px] ${
                            app.status === 'Approved'
                              ? 'bg-[#20603D]/20 text-[#20603D]'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && castings.some((casting) => casting.status === 'Pending Approval') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-amber-300/30 shadow-xl space-y-3">
            <h3 className="text-base font-serif font-bold">Pending Casting Approvals</h3>
            {castings.filter((casting) => casting.status === 'Pending Approval').map((casting) => (
              <div key={casting.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="font-serif text-sm">{casting.title}</strong>
                  <p className="text-slate-500">{casting.organizerName} · {casting.location} · banner attached</p>
                </div>
                <button onClick={() => updateCastingStatus(casting.id, 'Open')} className="px-3 py-1.5 rounded-xl bg-[#20603D] text-white font-semibold">Approve & Publish</button>
              </div>
            ))}
          </div>
        )}

        {/* Agencies Management & CEO Verification Status Change */}
        {activeTab === 'agencies' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold">Licensed Agency Accreditation Registry</h3>
                <p className="text-xs text-slate-500">
                  Super Admin verification controls with automated CEO email status triggers.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00A1DE] bg-[#00A1DE]/10 px-3 py-1.5 rounded-xl border border-[#00A1DE]/20">
                <Mail className="w-3.5 h-3.5" /> Auto-Email System Active
              </div>
            </div>

            <div className="space-y-4">
              {agencies.map((agency) => (
                <div
                  key={agency.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <img
                        src={agency.logo}
                        alt={agency.agencyName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base font-serif">{agency.agencyName}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              agency.licensedStatus === 'Licensed'
                                ? 'bg-[#20603D] text-white'
                                : agency.licensedStatus === 'Provisionary'
                                ? 'bg-amber-500 text-slate-900'
                                : agency.licensedStatus === 'Pending Renewal'
                                ? 'bg-blue-600 text-white'
                                : agency.licensedStatus === 'Under Review'
                                ? 'bg-purple-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {agency.licensedStatus}
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono">
                          License: <strong className="text-slate-700 dark:text-slate-300">{agency.licenseNumber}</strong> • CEO: <strong className="text-[#00A1DE]">{agency.ceoName}</strong> ({agency.email})
                        </p>
                        <p className="text-slate-400">
                          Represented Models: {agency.representedModelsCount || 0} • Location: {agency.district}, {agency.province}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() =>
                          setSelectedAgencyDetails(
                            selectedAgencyDetails === agency.id ? null : agency.id
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-[11px] flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#00A1DE]" />
                        {selectedAgencyDetails === agency.id ? 'Hide Answers' : 'CEO Answers'}
                      </button>

                      <button
                        onClick={() => {
                          if (editingAgencyId === agency.id) {
                            setEditingAgencyId(null);
                          } else {
                            setEditingAgencyId(agency.id);
                            setSelectedStatus(agency.licensedStatus as any);
                            setReasonNote('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors text-[11px] flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Change Status & Notify CEO
                      </button>
                    </div>
                  </div>

                  {/* Inline Form for Updating Verification Status and Triggering Automated Email */}
                  {editingAgencyId === agency.id && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#12161A] border-2 border-[#00A1DE]/40 shadow-lg space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#00A1DE]" />
                          <h5 className="font-bold font-serif text-slate-900 dark:text-white">
                            Update Verification Standing & Dispatch CEO Notification Email
                          </h5>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                          Target CEO: {agency.ceoName} &lt;{agency.email}&gt;
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold mb-1">
                            New Verification / Accreditation Standing
                          </label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="Licensed">Licensed (Active Accreditation)</option>
                            <option value="Provisionary">Provisionary (Conditional Monitoring)</option>
                            <option value="Pending Renewal">Pending Renewal (Annual Clearance)</option>
                            <option value="Under Review">Under Review (Administrative Audit)</option>
                            <option value="Suspended">Suspended (Operations Paused)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block uppercase font-bold mb-1">
                            Directive Reason / Regulatory Notes for CEO
                          </label>
                          <input
                            type="text"
                            value={reasonNote}
                            onChange={(e) => setReasonNote(e.target.value)}
                            placeholder="e.g. Cleared annual welfare evaluation and contract audit."
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingAgencyId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateStatusAndSendEmail(agency.id)}
                          className="px-4 py-1.5 rounded-xl bg-[#20603D] text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow"
                        >
                          <Send className="w-3.5 h-3.5 text-[#FAD201]" /> Confirm & Send Email to CEO
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expanded CEO Professional Answers */}
                  {selectedAgencyDetails === agency.id && agency.ceoQuestions && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <span className="font-mono text-[10px] font-bold text-[#FAD201] uppercase block">
                        📋 CEO Evaluation Audit Details
                      </span>
                      <div className="space-y-1.5">
                        <p>
                          <strong className="text-[#00A1DE]">1. Operating Experience:</strong>{' '}
                          {agency.ceoQuestions.operatingYears}
                        </p>
                        <p>
                          <strong className="text-[#FAD201]">2. Welfare & Protections:</strong>{' '}
                          {agency.ceoQuestions.welfarePolicies}
                        </p>
                        <p>
                          <strong className="text-[#20603D]">3. Primary Focus:</strong>{' '}
                          {agency.ceoQuestions.primaryFocus}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automated Email Notification Logs Tab */}
        {activeTab === 'emails' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#00A1DE]" /> Automated CEO Email Dispatch Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time audit trail of all automated certification notices dispatched to agency leadership.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="Filter email logs..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-56"
                />
              </div>
            </div>

            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono italic">
                No email dispatch logs found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-[#00A1DE]/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#00A1DE]/10 text-[#00A1DE]">
                          AUTOMATED EMAIL
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white font-serif">{email.subject}</h4>
                      </div>

                      <p className="text-slate-500 font-mono text-[11px]">
                        Recipient CEO: <strong className="text-slate-800 dark:text-slate-200">{email.recipientName}</strong> ({email.recipientEmail}) • Agency: <strong className="text-slate-700 dark:text-slate-300">{email.agencyName}</strong>
                      </p>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#00A1DE]" /> {new Date(email.sentAt).toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>Transition: {email.previousStatus} → <strong className="text-emerald-400">{email.newStatus}</strong></span>
                        {email.reasonNote && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 truncate max-w-xs">Note: {email.reasonNote}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEmailModal(email)}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-[#00A1DE] hover:text-white transition-colors flex items-center gap-1.5 text-xs shrink-0"
                    >
                      <Eye className="w-4 h-4" /> View Email Notice
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* System Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <h3 className="text-base font-serif font-bold">System Users & Access Governance</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="p-2.5">User Name</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Agency Affiliation</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {systemUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-2.5 font-semibold font-serif">{u.name}</td>
                      <td className="p-2.5 font-mono text-slate-500">{u.email}</td>
                      <td className="p-2.5 font-mono font-bold text-[#00A1DE]">{u.role}</td>
                      <td className="p-2.5">{u.agencyName || 'N/A'}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#20603D]/10 text-[#20603D] font-mono font-bold text-[10px]">
                          {u.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => showToast(`User permissions updated for ${u.name}`, 'info')}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]"
                        >
                          Edit Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Models Registry Tab */}
        {activeTab === 'models' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold">Rwandan Models National Registry ({models.length})</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  National Directory of verified Rwandan talent. Models are registered directly by their representing Licensed Agency CEOs via their Agency Dashboard.
                </p>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0">
                <Lock className="w-3.5 h-3.5 text-[#00A1DE]" /> Agency Isolation Policy: Roster managed solely by verified Agency CEO
              </div>
            </div>

            {models.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs italic">
                No models currently registered in database. Licensed Agency CEOs can add models on their Agency Dashboard.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase font-mono">
                    <tr>
                      <th className="p-2.5">Model Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Province</th>
                      <th className="p-2.5">Agency</th>
                      <th className="p-2.5">Height</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {models.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-2.5 font-semibold">{m.fullName}</td>
                        <td className="p-2.5 font-mono text-[#00A1DE]">{m.category}</td>
                        <td className="p-2.5">{m.province}</td>
                        <td className="p-2.5">{m.agencyName || 'Independent'}</td>
                        <td className="p-2.5 font-mono">{m.measurements.heightCm} cm</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#20603D]/10 text-[#20603D] font-mono font-bold text-[10px]">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Content & Media Publishing Center Tab */}
        {activeTab === 'content' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#00A1DE]" /> ARMA Gazette, Events & Accreditation Publishing Center
                </h3>
                <p className="text-xs text-slate-500">
                  Publish national news releases, schedule fashion events, upload official policy documents, and issue QR digital certificates.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsCreateNewsOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 text-xs shadow"
                >
                  <Newspaper className="w-3.5 h-3.5 text-[#FAD201]" /> Publish Gazette / News
                </button>
                <button
                  onClick={() => setIsCreateEventOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#20603D] text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 text-xs shadow"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#FAD201]" /> Publish Event
                </button>
                <button
                  onClick={() => setIsCreateDocOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs shadow"
                >
                  <FileText className="w-3.5 h-3.5 text-[#00A1DE]" /> Upload Policy Document
                </button>
                <button
                  onClick={() => setIsIssueCertOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5 text-xs shadow"
                >
                  <Award className="w-3.5 h-3.5" /> Issue QR Certificate
                </button>
              </div>
            </div>

            {/* Quick Content Lists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Recent Gazette Releases */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-mono text-[10px] font-bold text-[#00A1DE] uppercase block">
                  📰 Gazette Articles ({news.length})
                </span>
                {news.length === 0 ? (
                  <p className="text-slate-500 italic text-[11px]">No news articles currently in database.</p>
                ) : (
                  <div className="space-y-1.5">
                    {news.slice(0, 4).map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800">
                        <strong className="font-serif block font-bold text-slate-800 dark:text-slate-200">{n.title}</strong>
                        <span className="text-[10px] font-mono text-slate-400">{n.category} • {n.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Issued Certificates */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-mono text-[10px] font-bold text-[#FAD201] uppercase block">
                  🎖️ Issued Certificates ({certificates.length})
                </span>
                {certificates.length === 0 ? (
                  <p className="text-slate-500 italic text-[11px]">No certificates issued in current database.</p>
                ) : (
                  <div className="space-y-1.5">
                    {certificates.slice(0, 4).map((c) => (
                      <div key={c.id} className="p-2 rounded-xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <strong className="font-serif block font-bold text-slate-800 dark:text-slate-200">{c.recipientName}</strong>
                          <span className="text-[10px] font-mono text-slate-400">{c.certificateNumber}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Verified</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {isExportDataOpen && <ExportDataModal onClose={() => setIsExportDataOpen(false)} />}
        {isCreateEventOpen && <CreateEventModal onClose={() => setIsCreateEventOpen(false)} />}
        {isCreateNewsOpen && <CreateNewsModal onClose={() => setIsCreateNewsOpen(false)} />}
        {isCreateDocOpen && <CreateDocumentModal onClose={() => setIsCreateDocOpen(false)} />}
        {isIssueCertOpen && <IssueCertificateModal onClose={() => setIsIssueCertOpen(false)} />}
        {isAddAdminOpen && <AddSuperAdminModal onClose={() => setIsAddAdminOpen(false)} />}
      </div>
    </div>
  );
};


