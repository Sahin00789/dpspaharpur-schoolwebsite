import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

// Error boundary fallback component
function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-red-500 mb-6 text-left overflow-auto p-4 bg-gray-50 rounded">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Main App Wrapper
function AppWithProviders() {
  return (
    <LanguageProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </LanguageProvider>
  );
}

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>
);
