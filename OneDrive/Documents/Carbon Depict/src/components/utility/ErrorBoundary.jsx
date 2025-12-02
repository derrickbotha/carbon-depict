// src/components/utility/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle } from '@atoms/Icon';
import { PrimaryButton } from '@atoms/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-lg bg-red-50 border border-red-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong.</h2>
          <p className="text-red-700 mb-6">
            We've encountered an unexpected error. Please try refreshing the page.
          </p>
          <PrimaryButton onClick={() => window.location.reload()}>
            Refresh Page
          </PrimaryButton>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left bg-white p-4 rounded border">
              <summary className="cursor-pointer font-medium text-red-800">
                Error Details
              </summary>
              <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
