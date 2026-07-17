import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import AuthContext from './context/authContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContext>
    <App />
  </AuthContext>
)