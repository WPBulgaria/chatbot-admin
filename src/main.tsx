import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


const rootElement = document.getElementById(process.env.NODE_ENV === 'development' ? 'root' : 'wp-chatbot-admin-container');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
if (process.env.NODE_ENV === 'development') {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const rootElement = document.getElementById('wp-chatbot-admin-container');
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }
  const shadowRoot = rootElement.attachShadow({ mode: 'open' });
  ReactDOM.createRoot(shadowRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}*/