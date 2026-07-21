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

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
        const response = await axios.post('https://onrender.com', { 
            email: email.trim(), 
            password 
        }); // withCredentials is no longer needed
        
        if (response.data.success) {
            // Save token to localStorage for authenticated requests
            localStorage.setItem('manitham_token', response.data.token);

            if (rememberMe) {
                localStorage.setItem('manitham_remembered_email', email.trim());
            } else {
                localStorage.removeItem('manitham_remembered_email');
            }

            login(response.data.user);
            navigate('/dashboard');
        }
    } catch (error) {
        setError(error.response?.data?.error || "Invalid credentials");
    }
};

    
    return (
    <div className="flex flex-col items-center h-screen justify-center bg-[#0f172a] p-4">
      <h2 className="font-sevillana text-4xl font-bold text-white mb-6 drop-shadow-sm">
        Manitham Portal
      </h2>
      
      <div className="border border-slate-800 shadow-xl p-8 w-full max-w-sm bg-white rounded-lg transition-all duration-300">
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

          <div className="mb-6 flex items-center text-xs">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox text-teal-600 focus:ring-teal-500 accent-teal-600 w-4 h-4 rounded cursor-pointer" 
              />
              <span className="ml-2 text-gray-600 select-none font-medium">Remember me</span>
            </label>
          </div>
          
          <button type="submit" className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer text-sm">
            Login
          </button>
        </form>
      </div>
    </div>
    );
};

export default Login;
