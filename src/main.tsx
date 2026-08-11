import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary title="Application Error" description="The application encountered an unexpected error. Please try reloading.">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

