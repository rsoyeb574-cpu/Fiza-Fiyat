import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error | null, reset: () => void) => ReactNode);
  title?: string;
  description?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showDetails: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.handleReset);
        }
        return this.props.fallback;
      }

      const title = this.props.title || 'Something went wrong';
      const description =
        this.props.description ||
        'An unexpected error occurred while rendering this section. You can try refreshing it below.';

      return (
        <div
          id="error-boundary-container"
          className="my-4 p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs transition-all"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="error-boundary-retry-button"
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            {this.state.error && (
              <button
                id="error-boundary-toggle-details"
                type="button"
                onClick={() =>
                  this.setState((prev) => ({ showDetails: !prev.showDetails }))
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                <span>{this.state.showDetails ? 'Hide Details' : 'Show Details'}</span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {this.state.showDetails && this.state.error && (
            <div className="mt-4 text-left p-3 bg-slate-900 text-amber-300 rounded-lg text-xs font-mono overflow-x-auto max-h-40 border border-slate-800">
              <p className="font-bold text-red-400 mb-1">{this.state.error.toString()}</p>
              {this.state.error.stack && (
                <pre className="text-slate-400 whitespace-pre-wrap text-[11px] leading-tight">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
