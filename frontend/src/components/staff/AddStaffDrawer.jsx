import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const AddStaffDrawer = ({ isOpen, onClose, onSaveSuccess, staffMember }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (staffMember) {
      setName(staffMember.name || '');
      setEmail(staffMember.email || '');
      setPassword(''); 
      setRole(staffMember.role || 'user');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
    }
    setError('');
    setShowPassword(false);
  }, [staffMember, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('manitham_token');
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (staffMember) {
        const response = await axios.put(
          `https://manitham-portal.onrender.com/api/auth/update-staff/${staffMember._id}`, 
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password, 
            role: role
          }, 
          config
        );

        if (response.data.success) {
          onSaveSuccess();
        }
      } else {
        const response = await axios.post(
          'https://manitham-portal.onrender.com/api/auth/register-staff', 
          {
            name: name.trim(),
            username: email.trim().toLowerCase(),
            password: password,
            role: role
          }, 
          config
        );

        if (response.data.success) {
          onSaveSuccess();
        }
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to communicate with database server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={() => !isSubmitting && onClose()} />

      {/* 
        FIXED: 
        - Changed 'w-full max-w-md' to 'w-full sm:max-w-md' to fit phone screens perfectly.
      */}
      <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 transition-all duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{staffMember ? 'Update Staff Credentials' : 'Add New Staff'}</h2>
          </div>
          <button type="button" disabled={isSubmitting} onClick={onClose} className="p-1.5 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        {/* FIXED: Scaled padding down to p-4 for compact mobile aspect ratios */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {error && <p className="text-red-500 text-xs font-semibold p-3 bg-red-50 rounded-xl border border-red-100">{error}</p>}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Full Name</label>
            <input type="text" required disabled={isSubmitting} placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" required disabled={isSubmitting} placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {staffMember ? 'Force Reset Password (Leave blank to keep old password)' : 'Password'}
            </label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                required={!staffMember} 
                disabled={isSubmitting} 
                placeholder={staffMember ? "Type new secure password" : "******"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" 
              />
              <button type="button" disabled={isSubmitting} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
            <select value={role} disabled={isSubmitting} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
              <option value="user">User (Standard Staff)</option>
              <option value="admin">Admin (Full System Privilege)</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer">Close</button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer transition-colors">
            {isSubmitting ? 'Processing Changes...' : staffMember ? 'Save Profile Changes' : 'Create Account'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddStaffDrawer;
