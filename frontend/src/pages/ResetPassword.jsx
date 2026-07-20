import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams(); // Extracts the single-use crypto token from the URL path
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Production API hit to push the update directly into Mongoose
      const response = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, {
        newPassword
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login'); // Return to login screen automatically
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Your request link has expired or is invalid. Please request a new one.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-slate-100 to-50% p-4">
      <h2 className="font-sevillana text-4xl font-bold text-white mb-6 drop-shadow-sm">
        Manitham Portal
      </h2>

      <div className="border shadow-lg p-8 w-full max-w-sm bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">Create New Password</h2>
        <p className="text-xs text-slate-400 font-medium text-center mb-6">Enter your new private account credentials below</p>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          {error && <p className="text-red-500 text-xs font-semibold text-center p-2.5 bg-red-50 rounded-xl border border-red-100">{error}</p>}
          {message && <p className="text-emerald-600 text-xs font-semibold text-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">{message}</p>}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showPass ? 'text' : 'password'}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 pr-10 text-sm"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer text-sm disabled:opacity-60"
          >
            {isSubmitting ? 'Updating Database...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
