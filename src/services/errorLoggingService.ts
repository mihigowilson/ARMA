import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export interface AuditErrorLog {
  id: string;
  message: string;
  stack?: string;
  type: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  userRole?: string;
  extra?: Record<string, any>;
}

const AUDIT_LOGS_COLLECTION = 'audit_logs';

/**
 * Sends a structured error exception log to the Firestore `audit_logs` collection.
 */
export const logErrorToFirestore = async (errorData: {
  message: string;
  stack?: string;
  type?: string;
  userId?: string;
  userRole?: string;
  extra?: Record<string, any>;
}): Promise<string | null> => {
  try {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const currentAuthUser = auth.currentUser;

    const payload: AuditErrorLog = {
      id: logId,
      message: errorData.message || 'Unknown Exception',
      stack: errorData.stack || '',
      type: errorData.type || 'frontend_exception',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      userId: errorData.userId || currentAuthUser?.uid || 'anonymous',
      userRole: errorData.userRole || 'guest',
      extra: errorData.extra || {},
    };

    const docRef = doc(db, AUDIT_LOGS_COLLECTION, logId);
    await setDoc(docRef, payload);
    console.info(`[AuditLogger] Exception logged to Firestore audit_logs (${logId})`);
    return logId;
  } catch (err) {
    console.warn('[AuditLogger] Failed to write exception log to Firestore:', err);
    return null;
  }
};

/**
 * Initializes global event listeners to catch unhandled errors and promises.
 */
export const initGlobalErrorLogging = () => {
  if (typeof window === 'undefined') return;

  // Global uncaught JS exceptions
  window.addEventListener('error', (event: ErrorEvent) => {
    const message = event.message || 'Uncaught Error';
    const stack = event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`;
    logErrorToFirestore({
      message,
      stack,
      type: 'uncaught_window_error',
    });
  });

  // Global unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : reason?.message || 'Unhandled Promise Rejection';
    const stack = reason?.stack || '';
    logErrorToFirestore({
      message,
      stack,
      type: 'unhandled_promise_rejection',
      extra: { reason: String(reason) },
    });
  });
};

/**
 * Subscribe to recent audit logs from Firestore for admin inspection.
 */
export const subscribeToAuditLogs = (
  callback: (logs: AuditErrorLog[]) => void,
  maxLogs: number = 50
) => {
  try {
    const colRef = collection(db, AUDIT_LOGS_COLLECTION);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxLogs));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: AuditErrorLog[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as AuditErrorLog);
        });
        callback(items);
      },
      (error) => {
        console.warn('[AuditLogger] Firestore audit_logs subscription fallback:', error.message);
      }
    );
  } catch (err) {
    console.warn('[AuditLogger] Error initializing audit_logs listener:', err);
    return () => {};
  }
};
