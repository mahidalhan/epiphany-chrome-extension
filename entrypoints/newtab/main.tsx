import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Bundled fonts - no CDN required
import '@fontsource/manrope/400.css'; // Regular
import '@fontsource/manrope/500.css'; // Medium
import '@fontsource/manrope/600.css'; // SemiBold
import '@fontsource/manrope/700.css'; // Bold
import '@fontsource/inter/500.css'; // Medium (for charts)

import '../../assets/main.css';

// React 19 createRoot API for concurrent features
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
