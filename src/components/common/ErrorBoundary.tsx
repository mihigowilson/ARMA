import React from 'react';
import { logErrorToFirestore } from '../../services/errorLoggingService';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught exception:', error, errorInfo);
    logErrorToFirestore({
      message: error.message,
      stack: error.stack || errorInfo.componentStack || undefined,
      type: 'react_error_boundary',
      extra: { componentStack: errorInfo.componentStack || undefined },
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl border border-slate-200 dark:border-slate-800 my-8 max-w-2xl mx-auto shadow-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Something went wrong</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              An unexpected error occurred. This exception has been automatically recorded to the ARMA Firestore audit logs database for investigation.
            </p>
            {this.state.errorMessage && (
              <div className="p-3 bg-slate-100 dark:bg-[#1E2630] rounded-xl font-mono text-[11px] text-red-500 dark:text-red-400 max-w-lg mx-auto overflow-x-auto text-left border border-slate-200 dark:border-slate-800">
                {this.state.errorMessage}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A1DE] hover:bg-[#0081B3] text-white font-semibold text-xs shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
