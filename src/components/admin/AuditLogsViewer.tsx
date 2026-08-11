import React, { useEffect, useState } from 'react';
import { subscribeToAuditLogs, AuditErrorLog, logErrorToFirestore } from '../../services/errorLoggingService';
import { Terminal, AlertTriangle, Bug, RefreshCw, ShieldAlert, CheckCircle2, Search, Filter } from 'lucide-react';

export const AuditLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditErrorLog[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditErrorLog | null>(null);
  const [testingError, setTestingError] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuditLogs((fetchedLogs) => {
      setLogs(fetchedLogs);
    }, 100);
    return () => unsubscribe();
  }, []);

  const handleTriggerTestException = async () => {
    setTestingError(true);
    try {
      await logErrorToFirestore({
        message: 'Simulated Frontend Test Exception for Firestore Verification',
        stack: 'Error: Simulated Exception\n  at AdminDashboard (src/components/admin/AuditLogsViewer.tsx:28:11)',
        type: 'test_simulation',
        extra: { triggerOrigin: 'Admin Audit Dashboard', browserTime: new Date().toISOString() },
      });
    } finally {
      setTimeout(() => setTestingError(false), 600);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesQuery =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.stack && log.stack.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.userId && log.userId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl border border-amber-500/20 shadow-inner shrink-0">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                Firestore Exception & Audit Logging Service
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Firestore Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Capturing uncaught frontend errors, unhandled promise rejections, and component exceptions in real-time to the Firestore <code>audit_logs</code> collection.
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerTestException}
          disabled={testingError}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${testingError ? 'animate-spin' : ''}`} />
          Trigger Test Log Exception
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search error logs by message, stack trace, or user ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00A1DE]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#12161A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#00A1DE]"
          >
            <option value="all">All Exception Types</option>
            <option value="uncaught_window_error">Uncaught Window Errors</option>
            <option value="unhandled_promise_rejection">Unhandled Promise Rejections</option>
            <option value="react_error_boundary">React Error Boundary</option>
            <option value="test_simulation">Test Simulations</option>
          </select>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
              No Exception Logs Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No errors match your active search filter, or no exception logs have been pushed to the Firestore <code>audit_logs</code> collection yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#12161A] text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Exception Message</th>
                  <th className="p-3.5">User Context</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-mono"
                  >
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {log.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans font-medium text-slate-900 dark:text-white max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {log.userId || 'anonymous'} ({log.userRole || 'guest'})
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1 rounded-lg bg-[#00A1DE] text-white hover:bg-[#0081B3] transition-colors font-sans text-[11px] font-semibold"
                      >
                        Inspect Stack Trace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Log Stack Trace Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white dark:bg-[#1E2630] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                    Firestore Audit Log Details
                  </h3>
                  <p className="text-xs font-mono text-[#00A1DE]">
                    ID: {selectedLog.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Timestamp</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedLog.timestamp}</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Exception Type</span>
                  <strong className="text-amber-500">{selectedLog.type}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 font-mono">
                <span className="text-slate-400 block text-[10px] uppercase">Exception Message</span>
                <p className="text-red-500 font-bold mt-0.5">{selectedLog.message}</p>
              </div>

              {selectedLog.stack && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">
                    Stack Trace
                  </span>
                  <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                    {selectedLog.stack}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
