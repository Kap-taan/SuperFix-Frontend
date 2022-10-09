import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SlotContextProvider } from './context/SlotContext'
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <AuthContextProvider>
      <SlotContextProvider>
        <App />
      </SlotContextProvider>
    </AuthContextProvider>
  </React.StrictMode>

);
