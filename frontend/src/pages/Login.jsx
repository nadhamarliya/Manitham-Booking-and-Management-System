import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); 
    const { login } = useAuth();
    const navigate = useNavigate();

    // Field state utilities
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Toggles whether the card displays the standard Login form or the Forgot Email block
    const [isForgotView, setIsForgotView] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pull remembered user session choices from memory cache on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('manitham_remembered_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { 
                email: email.trim(), 
                password 
            }, { withCredentials: true }); // MANDATORY: Directs Axios to accept secure session cookies
            
            if (response.data.success) {
                if (rememberMe) {
                    localStorage.setItem('manitham_remembered_email', email.trim());
                } else {
                    localStorage.removeItem('manitham_remembered_email');
                }

                login(response.data.user);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("Invalid credentials or Server Database Offline");
            }
        }
    };

    const handleForgotEmailSubmit = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotMessage('');
        setIsSubmitting(true);

        try {
            // production API call to trigger Brevo SMTP mail dispatch execution
            const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { 
                email: forgotEmail.trim() 
            });
            
            if (response.data.success) {
                setForgotMessage(response.data.message);
                setForgotEmail('');
            }
        } catch (error) {
            setForgotError("Failed to dispatch reset request. Verify server status.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-slate-100 to-50% p-4">
      <h2 className="font-sevillana text-4xl font-bold text-white mb-6 drop-shadow-sm">
        Manitham Portal
      </h2>
      
      <div className="border shadow-lg p-8 w-full max-w-sm bg-white rounded-lg transition-all duration-300">
        
        {/* VIEW 1: STANDARD LOGIN CARD INTERFACE VIEW */}
        {!isForgotView ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              {error && <p className="text-red-500 text-xs font-semibold text-center mb-4 bg-red-50 p-2.5 rounded-xl border border-red-100">{error}</p>}

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full px-3 py-2 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 pr-10" 
                    placeholder="******" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-6 flex items-center justify-between text-xs">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="form-checkbox text-teal-600 focus:ring-teal-500 accent-teal-600 w-4 h-4 rounded cursor-pointer" 
                  />
                  <span className="ml-2 text-gray-600 select-none font-medium">Remember me</span>
                </label>
                <button 
                  type="button"
                  onClick={() => { setIsForgotView(true); setError(''); }}
                  className="text-teal-600 hover:underline bg-transparent border-none cursor-pointer font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer text-sm">
                Login
              </button>
            </form>
          </>
        ) : (
          /* VIEW 2: CONNECTED IN-CARD SECURE EMAIL RESET DISPATCH INTERFACE */
          <>
            <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">Trouble Logging In?</h2>
            <p className="text-xs text-slate-400 font-medium text-center mb-6">Enter your inbox email and we'll dispatch a secure recovery link.</p>
            
            <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
              {forgotError && <p className="text-red-500 text-xs font-semibold text-center p-2.5 bg-red-50 rounded-xl border border-red-100">{forgotError}</p>}
              {forgotMessage && <p className="text-emerald-600 text-xs font-semibold text-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">{forgotMessage}</p>}

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Registered Email</label>
                <input 
                  type="email" 
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800" 
                  placeholder="name@example.com" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer text-sm disabled:opacity-60">
                {isSubmitting ? "Dispatching Email..." : "Send Reset Link"}
              </button>

              <div className="pt-2 text-center">
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={() => { setIsForgotView(false); setForgotMessage(''); setForgotError(''); }} 
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Return to Login Screen
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
    );
};

export default Login;
