import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../../assets/main.css';

// React 19 createRoot API for concurrent features
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
