import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null); 
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
            
            // Save token to local storage if successful
            if (response.data.success) {
                login(response.data.user);
                localStorage.setItem('token', response.data.token);

                if (response.data.user.role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.error);
            } else {
                setError("Server Error");
            }
        }
    }
    
    return (

    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-slate-100 to-50% p-4">
      <h2 className="font-sevillana text-4xl font-bold text-white mb-6 drop-shadow-sm">
        Manitham Portal
      </h2>
      
      <div className="border shadow-lg p-8 w-full max-w-sm bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm font-semibold text-center mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" 
              placeholder="Enter Email" 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" 
              placeholder="******" 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox text-teal-600 focus:ring-teal-500" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}

export default Login

