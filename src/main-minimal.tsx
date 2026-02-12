import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Silent mode - no console logs
const consoleLog = console.log;
console.log = () => {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Restore console.log after render
setTimeout(() => {
  console.log = consoleLog;
}, 100);
