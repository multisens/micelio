import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './Routes';

import './css/global.css';

import { AuthProvider } from './context/AuthContext'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
