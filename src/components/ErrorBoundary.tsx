import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-red-900/30 rounded-3xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">System Interrupted</h2>
            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
              An unexpected operational fault occurred. This is likely due to missing local configuration or environment variables.
            </p>
            <div className="bg-black/40 border border-neutral-800 rounded-xl p-4 mb-6 overflow-auto max-h-48">
              <code className="text-xs text-red-400 font-mono break-all font-bold uppercase tracking-tight">
                {this.state.error?.toString()}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold transition-all text-sm uppercase tracking-widest"
            >
              Retry Boot Sequence
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
