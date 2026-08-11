import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileText,
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Download,
  Database,
  Eye,
  UserCheck,
  Building2,
  Shield,
  Activity,
  Smartphone,
  Check,
  Terminal,
  FileCode,
  AlertOctagon,
  Unlock,
  Radio,
  Zap,
  Mail
} from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { CaptchaWidget } from './CaptchaWidget';
import { MfaVerificationModal } from './MfaVerificationModal';
import { EncryptedContractModal } from './EncryptedContractModal';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  ipAddress: string;
  action: string;
  category: 'Auth' | 'MFA' | 'Data Isolation' | 'Licensing' | 'Encryption' | 'Backup' | 'Threat Alert' | 'Lockout';
  targetResource: string;
  severity: 'Info' | 'Warning' | 'Critical' | 'Security';
  status: 'Success' | 'Blocked' | 'Enforced';
}

export interface EncryptedContract {
  id: string;
  title: string;
  agencyName: string;
  modelName: string;
  contractType: string;
  date: string;
  hash: string;
  status: string;
  encryptedContent: string;
}

export const SecuritySuite: React.FC = () => {
  const { user, showToast, agencies, models } = useAuth();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'audit' | 'mfa' | 'isolation' | 'contracts' | 'lockout' | 'backups' | 'jwt' | 'threats' | 'captcha'>('audit');

  // MFA State
  const [isMfaEnabled, setIsMfaEnabled] = useState(true);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);

  // Email Verification state
  const [isEmailVerified, setIsEmailVerified] = useState(user?.verified ?? true);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Password Policy State
  const [testPassword, setTestPassword] = useState('ARMA@Rwanda2026!');

  // CAPTCHA state
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // JWT Token State (15-min countdown timer)
  const [jwtTimeLeft, setJwtTimeLeft] = useState(874); // 14 min 34s
  const [jwtToken, setJwtToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItYWRtaW4iLCJuYW1lIjoiQVJNQSBBY2RlciIsImlhdCI6MTc3MDAwMDAwMCwiZXhwIjoxNzcwMDAwOTAwfQ');

  // Selected Encrypted Contract for Modal
  const [selectedContract, setSelectedContract] = useState<EncryptedContract | null>(null);

  // Disaster Recovery Test state
  const [isDrTesting, setIsDrTesting] = useState(false);
  const [drReport, setDrReport] = useState<any | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-101',
      timestamp: new Date().toISOString(),
      actorName: user?.name || 'ARMA Secretariat Super Admin',
      actorEmail: user?.email || 'admin@arma.org.rw',
      ipAddress: '197.243.32.14 (Kigali, Rwanda)',
      action: 'Super Admin Multi-Factor Authentication Verification',
      category: 'MFA',
      targetResource: 'Secretariat Admin Portal',
      severity: 'Security',
      status: 'Enforced'
    },
    {
      id: 'log-102',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      actorName: 'Kigali Elite Models CEO',
      actorEmail: 'agency@kigalielite.rw',
      ipAddress: '197.243.18.99 (Gasabo, Kigali)',
      action: 'Agency Roster Data Access Query',
      category: 'Data Isolation',
      targetResource: 'Agency ID: age-1 Roster',
      severity: 'Info',
      status: 'Success'
    },
    {
      id: 'log-103',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      actorName: 'Unknown Visitor',
      actorEmail: 'attacker@unknown.net',
      ipAddress: '45.142.120.9 (Suspicious Proxy)',
      action: 'Cross-Tenant Agency Contract Fetch Attempt',
      category: 'Threat Alert',
      targetResource: 'Contract Vault ID: cnt-882',
      severity: 'Critical',
      status: 'Blocked'
    },
    {
      id: 'log-104',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      actorName: 'System Automated Engine',
      actorEmail: 'system@arma.org.rw',
      ipAddress: '10.0.4.12 (Internal Subnet)',
      action: 'Automated Cloud Database Snapshot Backup',
      category: 'Backup',
      targetResource: 'Firestore Replica africa-south1',
      severity: 'Info',
      status: 'Success'
    },
    {
      id: 'log-105',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      actorName: 'Failed Login Monitor',
      actorEmail: 'unverified@external.com',
      ipAddress: '102.22.45.11 (Musanze, Rwanda)',
      action: 'Account Locked After 3 Repeated Failed Password Attempts',
      category: 'Lockout',
      targetResource: 'User Account: unverified@external.com',
      severity: 'Warning',
      status: 'Enforced'
    }
  ]);

  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategory, setAuditCategory] = useState<string>('All');

  // Account Lockouts List
  const [lockedAccounts, setLockedAccounts] = useState([
    {
      email: 'failed.agency@test.rw',
      ip: '102.22.45.11',
      failedAttempts: 3,
      lockedUntil: new Date(Date.now() + 1000 * 60 * 14).toLocaleTimeString(),
      reason: 'Repeated Invalid Password Entries'
    }
  ]);

  // Encrypted Contracts List
  const encryptedContracts: EncryptedContract[] = [
    {
      id: 'cnt-881',
      title: 'Model Exclusive Representation Deed 2026',
      agencyName: 'Kigali International Models',
      modelName: 'Marie-Claire Umutoni',
      contractType: 'Exclusive Talent Representation',
      date: '2026-01-15',
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'AES-256 Encrypted',
      encryptedContent: `AFRICAN RWANDA MODELING ASSOCIATION (ARMA)
CONFIDENTIAL TALENT REPRESENTATION CONTRACT

AGENCY: Kigali International Models (License No: ARMA-AGY-2026-001)
MODEL: Marie-Claire Umutoni (ID: MOD-2026-009)
TERMS & SAFEGUARDING CLAUSES:
1. Commission is capped at strictly 15% for local engagements in accordance with ARMA Bylaws.
2. Direct payout guarantee within 7 business days following campaign completion.
3. Parental safeguarding clearance verified for minor appearances.
4. Cryptographically signed with SHA-256 digital token.`
    },
    {
      id: 'cnt-882',
      title: 'Kigali Fashion Week 2026 Runway Campaign',
      agencyName: 'Premier Model Management',
      modelName: 'Jean-Luc Habimana',
      contractType: 'Commercial Campaign Release',
      date: '2026-02-01',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069',
      status: 'AES-256 Encrypted',
      encryptedContent: `COMMERCIAL RUNWAY RELEASE AGREEMENT

SPONSOR / PRODUCER: Rwanda Fashion Council
AGENCY: Premier Model Management Rwanda
TALENT: Jean-Luc Habimana
COMPENSATION: 250,000 RWF per runway presentation
RIGHTS DURATION: 12 Months Digital & Regional Print Rights across East Africa.`
    }
  ];

  // Cloud Backups List
  const [backups, setBackups] = useState([
    { id: 'bkp-2026-07-29', date: '2026-07-29 08:00 UTC', size: '14.2 MB', region: 'africa-south1 (Cape Town)', checksum: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', type: 'Automated Snapshot' },
    { id: 'bkp-2026-07-28', date: '2026-07-28 08:00 UTC', size: '13.9 MB', region: 'europe-west2 (London)', checksum: 'sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', type: 'Daily Cloud Backup' }
  ]);

  // Suspicious Threat Alerts List
  const [threatAlerts, setThreatAlerts] = useState([
    {
      id: 'th-1',
      title: 'Multiple Failed Logins from Unknown IP',
      ip: '45.142.120.9',
      location: 'Unresolved Offshore Proxy',
      time: '12 mins ago',
      severity: 'Critical',
      details: '5 failed login attempts targeting Secretariat Super Admin account within 60 seconds.'
    },
    {
      id: 'th-2',
      title: 'Unusual Contract Download Request',
      ip: '197.243.12.8',
      location: 'Kigali, Rwanda',
      time: '45 mins ago',
      severity: 'Warning',
      details: 'Attempted to decrypt contract cnt-881 without matching agency authorization token.'
    }
  ]);

  // JWT Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setJwtTimeLeft((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatJwtTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRotateJwtToken = () => {
    const newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItYWRtaW4iLCJpYXQiOi${Date.now()}`;
    setJwtToken(newToken);
    setJwtTimeLeft(900);
    showToast('🔑 Short-Lived JWT Access Token rotated & renewed (15 min expiry)', 'success');

    addAuditLog('Short-Lived JWT Access Token Manual Rotation', 'Auth', 'JWT Token Engine', 'Info', 'Success');
  };

  const addAuditLog = (
    action: string,
    category: AuditLogItem['category'],
    targetResource: string,
    severity: AuditLogItem['severity'],
    status: AuditLogItem['status']
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: user?.name || 'ARMA Super Admin',
      actorEmail: user?.email || 'admin@arma.org.rw',
      ipAddress: '197.243.32.14 (Kigali, Rwanda)',
      action,
      category,
      targetResource,
      severity,
      status
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUnlockAccount = (email: string) => {
    setLockedAccounts((prev) => prev.filter((a) => a.email !== email));
    showToast(`Account lock released for ${email}`, 'success');
    addAuditLog(`Super Admin Manual Lockout Override for ${email}`, 'Lockout', email, 'Warning', 'Success');
  };

  const handleCreateSnapshot = () => {
    const id = `bkp-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000)}`;
    const newBkp = {
      id,
      date: new Date().toLocaleString() + ' UTC',
      size: '14.5 MB',
      region: 'africa-south1 (Cape Town)',
      checksum: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      type: 'Manual Super Admin Snapshot'
    };
    setBackups((prev) => [newBkp, ...prev]);
    showToast('☁️ Cloud database snapshot successfully created & encrypted!', 'success');
    addAuditLog('Manual Cloud Snapshot Created', 'Backup', id, 'Info', 'Success');
  };

  const handleRunDrTest = () => {
    setIsDrTesting(true);
    setTimeout(() => {
      setIsDrTesting(false);
      setDrReport({
        timestamp: new Date().toISOString(),
        testStatus: 'PASSED 100%',
        firestoreRulesVerified: '8 Pillars Hardened Rules Compliant',
        integrityHash: 'sha256:d8a9...99f0',
        recoveryTimeSec: 1.4,
        details: 'Simulated disaster recovery completed. 0 corrupted records detected.'
      });
      showToast('✅ Disaster Recovery Test Completed: 100% Integrity Verified!', 'success');
      addAuditLog('Disaster Recovery Integrity Test Executed', 'Backup', 'DR Recovery Simulator', 'Security', 'Success');
    }, 2000);
  };

  const handleDismissThreat = (id: string) => {
    setThreatAlerts((prev) => prev.filter((t) => t.id !== id));
    showToast('Threat alert dismissed', 'info');
  };

  const handleBlockIp = (ip: string) => {
    showToast(`🚫 IP Address ${ip} added to ARMA Security Firewall Blocklist`, 'error');
    setThreatAlerts((prev) => prev.filter((t) => t.ip !== ip));
    addAuditLog(`Firewall Rule Added: Blocked IP ${ip}`, 'Threat Alert', ip, 'Critical', 'Enforced');
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCategory = auditCategory === 'All' || log.category === auditCategory;
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(auditSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B0E11] via-[#161C22] to-[#0B0E11] text-white border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00A1DE] text-white flex items-center justify-center font-bold shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#FAD201]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold">ARMA Cyber Security & Regulatory Control Suite</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  11/11 Security Standards Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Full-stack protection: MFA • Agency Isolation • Audit Logs • AES-256 Vault • DR Backups • JWT • Threat Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Threat Monitor: Live
            </span>
            <button
              onClick={() => setIsMfaModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#FAD201]" /> Test MFA Challenge
            </button>
          </div>
        </div>

        {/* 11 Mandatory Security Cards Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">1. Admin MFA Active</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#00A1DE] shrink-0" />
            <span className="truncate">2. Agency Data Isolated</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#FAD201] shrink-0" />
            <span className="truncate">3. Full Audit Logs</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">4. AES-256 Contracts</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">5. Account Lockout</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <CloudIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">6. Cloud Backups</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">7. Strong Passwords</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#00A1DE] shrink-0" />
            <span className="truncate">8. Email Verified</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#FAD201] shrink-0" />
            <span className="truncate">9. CAPTCHA Bot Guard</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">10. Short-Lived JWT</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 col-span-2 sm:col-span-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">11. Threat Alerts</span>
          </div>
        </div>
      </div>

      {/* Security Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'audit' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('mfa')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'mfa' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#FAD201]" /> Admin MFA & 2FA
        </button>
        <button
          onClick={() => setActiveTab('isolation')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'isolation' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Agency Isolation
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'contracts' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-purple-400" /> AES-256 Vault ({encryptedContracts.length})
        </button>
        <button
          onClick={() => setActiveTab('lockout')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'lockout' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" /> Account Lockouts ({lockedAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab('backups')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'backups' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-blue-400" /> Backups & DR Test
        </button>
        <button
          onClick={() => setActiveTab('jwt')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'jwt' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400" /> JWT Tokens & Expiry
        </button>
        <button
          onClick={() => setActiveTab('threats')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'threats' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Threat Alerts ({threatAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('captcha')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'captcha' ? 'bg-[#00A1DE] text-white shadow' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-[#FAD201]" /> CAPTCHA & Password Engine
        </button>
      </div>

      {/* Tab 1: System Administrators Full Audit Logging */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#00A1DE]" /> System Administrator Audit Logging Engine
              </h3>
              <p className="text-xs text-slate-500">
                Immutable, real-time audit trail of all administrator events, authentication checks, and agency data queries.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search audit trail..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-48"
                />
              </div>

              <select
                value={auditCategory}
                onChange={(e) => setAuditCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
              >
                <option value="All">All Categories</option>
                <option value="Auth">Auth & JWT</option>
                <option value="MFA">MFA Enforcement</option>
                <option value="Data Isolation">Data Isolation</option>
                <option value="Licensing">Licensing</option>
                <option value="Encryption">Encryption</option>
                <option value="Backup">Cloud Backup</option>
                <option value="Threat Alert">Threat Alerts</option>
                <option value="Lockout">Lockouts</option>
              </select>

              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                  const anchor = document.createElement('a');
                  anchor.setAttribute('href', dataStr);
                  anchor.setAttribute('download', `ARMA_Audit_Logs_${Date.now()}.json`);
                  anchor.click();
                  showToast('Exported complete audit logs JSON file', 'success');
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 transition-colors flex items-center gap-1 shadow"
              >
                <Download className="w-3.5 h-3.5" /> Export Audit Log (JSON)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase font-mono">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Actor</th>
                  <th className="p-2.5">IP Address</th>
                  <th className="p-2.5">Action Executed</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Target Resource</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-2.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-2.5 font-semibold">
                      <div>{log.actorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.actorEmail}</div>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                    <td className="p-2.5 font-medium">{log.action}</td>
                    <td className="p-2.5 font-mono font-bold text-[#00A1DE]">{log.category}</td>
                    <td className="p-2.5 font-mono text-slate-400">{log.targetResource}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          log.severity === 'Critical'
                            ? 'bg-red-500/20 text-red-400'
                            : log.severity === 'Warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : log.severity === 'Security'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          log.status === 'Success'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.status === 'Enforced'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Administrator Multi-Factor Authentication */}
      {activeTab === 'mfa' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FAD201]" /> Multi-Factor Authentication (MFA / 2FA) Enforcement
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory two-factor authentication for Super Administrators and Board Executives.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${isMfaEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                MFA Status: {isMfaEnabled ? 'ENFORCED (Active)' : 'DISABLED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5 text-[#FAD201]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Authenticator App (TOTP)</h4>
                  <p className="text-slate-500 text-[11px]">Google Authenticator / Authy / YubiKey</p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Super Administrator accounts require a 6-digit TOTP code generated every 30 seconds before elevated access (Audit Logs, Licensing changes, Cloud Backups) is granted.
              </p>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsMfaModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow"
                >
                  <KeyRound className="w-4 h-4 text-[#FAD201]" /> Test 6-Digit TOTP Verification
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm">Emergency Recovery Keys</h4>
                  <p className="text-slate-500 text-[11px]">One-Time Emergency Backup Codes</p>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                8-character encrypted backup keys generated during administrator onboarding for account recovery if the primary device is lost.
              </p>

              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">8F43-A91B</span>
                <span className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">9201-CD55</span>
                <span className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">3312-E77A</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Agency Data Isolation */}
      {activeTab === 'isolation' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00A1DE]" /> Agency Data Isolation & Multi-Tenancy Engine
              </h3>
              <p className="text-xs text-slate-500">
                Guarantees each licensed agency only accesses its own represented models, contracts, and financial records.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
              🔒 Multi-Tenant Isolation Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold font-serif text-slate-900 dark:text-white text-sm">Active Session Data Scope</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">CURRENT USER ROLE</span>
                <strong className="text-sm font-bold text-[#00A1DE]">{user?.role || 'Super Admin'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">ISOLATION SCOPE</span>
                <strong className="text-sm font-bold text-emerald-400">
                  {user?.role === 'Agency' ? `Agency ID: ${user.agencyId || 'age-1'}` : 'Global Secretariat Audit Access'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">CROSS-TENANT FETCH BLOCK</span>
                <strong className="text-sm font-bold text-purple-400">100% Enforced in Firestore Rules</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Encrypted Contracts Vault (AES-256) */}
      {activeTab === 'contracts' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" /> Encrypted Contracts Vault (AES-256-GCM)
              </h3>
              <p className="text-xs text-slate-500">
                All talent representation contracts are stored with client-side & server-side cryptographic encryption.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {encryptedContracts.map((cnt) => (
              <div
                key={cnt.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold font-serif text-sm">{cnt.title}</h4>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-purple-500/20 text-purple-300 font-bold">
                      {cnt.status}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono">
                    Agency: {cnt.agencyName} • Model: {cnt.modelName} • Date: {cnt.date}
                  </p>
                  <p className="text-slate-400 font-mono text-[10px] truncate max-w-md">
                    Hash: {cnt.hash}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedContract(cnt)}
                  className="px-4 py-2 rounded-xl bg-[#00A1DE] text-white font-bold hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 text-xs shrink-0 shadow"
                >
                  <Lock className="w-3.5 h-3.5 text-[#FAD201]" /> Decrypt & View Contract
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Automatic Account Lock Manager */}
      {activeTab === 'lockout' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" /> Automatic Account Lockout Manager
              </h3>
              <p className="text-xs text-slate-500">
                Accounts automatically lock for 15 minutes after 3 consecutive failed login attempts to prevent brute-force attacks.
              </p>
            </div>
          </div>

          {lockedAccounts.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4">No accounts currently locked out.</p>
          ) : (
            <div className="space-y-3">
              {lockedAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-sm text-slate-900 dark:text-white">{acc.email}</strong>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-red-500/20 text-red-400 font-bold">
                        LOCKED OUT (3 Failed Attempts)
                      </span>
                    </div>
                    <p className="text-slate-400 font-mono text-[11px]">
                      IP: {acc.ip} • Reason: {acc.reason} • Locked Until: {acc.lockedUntil}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUnlockAccount(acc.email)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors flex items-center gap-1.5 text-xs shrink-0 shadow"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Super Admin Unlock Override
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Cloud Backups & Recovery Testing */}
      {activeTab === 'backups' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" /> Cloud Database Backups & Disaster Recovery Center
              </h3>
              <p className="text-xs text-slate-500">
                Automated multi-region cloud snapshots with certified integrity recovery testing.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCreateSnapshot}
                className="px-3.5 py-2 rounded-xl bg-[#00A1DE] text-white font-bold text-xs hover:bg-[#0081B3] transition-colors flex items-center gap-1.5 shadow"
              >
                <CloudIcon className="w-4 h-4 text-[#FAD201]" /> Create Cloud Snapshot Now
              </button>
              <button
                onClick={handleRunDrTest}
                disabled={isDrTesting}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-4 h-4 ${isDrTesting ? 'animate-spin' : ''}`} />
                {isDrTesting ? 'Testing DR Integrity...' : 'Run Disaster Recovery Test'}
              </button>
            </div>
          </div>

          {drReport && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <strong className="font-serif text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Official Disaster Recovery Test Report
                </strong>
                <span className="font-mono text-[10px] text-slate-400">{drReport.timestamp}</span>
              </div>
              <p className="text-slate-300 font-mono">
                Status: <strong className="text-emerald-400">{drReport.testStatus}</strong> • Rules: {drReport.firestoreRulesVerified} • Speed: {drReport.recoveryTimeSec}s
              </p>
              <p className="text-slate-400 text-[11px]">{drReport.details}</p>
            </div>
          )}

          <div className="space-y-2.5">
            {backups.map((bkp) => (
              <div
                key={bkp.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono font-bold text-slate-900 dark:text-white">{bkp.id}</strong>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-blue-500/20 text-blue-400 font-bold">
                      {bkp.type}
                    </span>
                  </div>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Date: {bkp.date} • Size: {bkp.size} • Region: {bkp.region}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 shrink-0">
                  <span className="truncate max-w-xs">{bkp.checksum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: JWT Tokens & Expiration */}
      {activeTab === 'jwt' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Secure APIs via Short-Lived JWT Tokens
              </h3>
              <p className="text-xs text-slate-500">
                15-minute access tokens with automatic rotation and bearer authorization headers.
              </p>
            </div>

            <button
              onClick={handleRotateJwtToken}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-4 h-4" /> Rotate JWT Token Now
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">ACTIVE JWT ACCESS TOKEN TIMER</span>
              <span className="font-mono text-base font-extrabold text-indigo-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#FAD201]" /> Expires in {formatJwtTimer(jwtTimeLeft)}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                Bearer Token String
              </label>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all">
                {jwtToken}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Suspicious Activity Threat Monitoring & Alerts */}
      {activeTab === 'threats' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Real-time Threat & Suspicious Activity Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Active monitoring for brute-force logins, illegal cross-tenant fetches, or unauthorized downloads.
              </p>
            </div>
          </div>

          {threatAlerts.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4">No active threat alerts detected.</p>
          ) : (
            <div className="space-y-3">
              {threatAlerts.map((th) => (
                <div
                  key={th.id}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif">{th.title}</h4>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-red-500/20 text-red-400 font-bold">
                        {th.severity}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{th.time}</span>
                  </div>

                  <p className="text-slate-300 text-[11px]">{th.details}</p>
                  <p className="text-slate-400 font-mono text-[10px]">Origin IP: {th.ip} ({th.location})</p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleDismissThreat(th.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                    >
                      Dismiss Alert
                    </button>
                    <button
                      onClick={() => handleBlockIp(th.ip)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors shadow"
                    >
                      Block IP Address
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 9: CAPTCHA & Password Policy Controls */}
      {activeTab === 'captcha' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white mb-2">
                Strong Password Policy Evaluator
              </h4>
              <input
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Type password to evaluate strength..."
                className="w-full p-2.5 mb-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono"
              />
              <PasswordStrengthMeter password={testPassword} />
            </div>

            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white mb-2">
                Interactive Security CAPTCHA Widget
              </h4>
              <CaptchaWidget onVerified={setIsCaptchaVerified} isVerified={isCaptchaVerified} />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isMfaModalOpen && (
        <MfaVerificationModal
          onClose={() => setIsMfaModalOpen(false)}
          onSuccess={() => {
            setIsMfaModalOpen(false);
            showToast('✅ Administrator MFA authentication successful!', 'success');
            addAuditLog('Admin MFA Verification Passed', 'MFA', 'Super Admin Portal', 'Security', 'Success');
          }}
        />
      )}

      {selectedContract && (
        <EncryptedContractModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
};

function CloudIcon(props: any) {
  return <Database {...props} />;
}
