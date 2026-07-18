import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const AddStaffDrawer = ({ isOpen, onClose, onSave, onDelete, staffMember }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (staffMember) {
      setName(staffMember.name || '');
      setUsername(staffMember.username || '');
      // Safely decode the stored Base64 hash back into normal text for editing
      try {
        setPassword(staffMember.password ? atob(staffMember.password) : '');
      } catch (e) {
        setPassword(staffMember.password || '');
      }
      setRole(staffMember.role || 'user');
    } else {
      setName('');
      setUsername('');
      setPassword('');
      setRole('user');
    }
    setShowPassword(false);
  }, [staffMember, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Scramble the password into Base64 before moving it to the system save array
    const encryptedPassword = btoa(password);

    onSave({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: encryptedPassword,
      role: role
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{staffMember ? 'Update Staff Credentials' : 'Add New Staff'}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage administrative portal access permissions</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Full Name</label>
            <input type="text" required placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username / Login ID</label>
            <input type="text" required placeholder="e.g. monika_admin" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Login Password</label>
            <div className="relative flex items-center">
              <input type={showPassword ? "text" : "password"} required placeholder="Assign password credentials" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System Clearance Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
              <option value="user">User (Standard Staff)</option>
              <option value="admin">Admin (Full System Privilege)</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 mt-auto">
          <div>
            {staffMember ? (
              <button type="button" onClick={() => onDelete(staffMember.id)} className="px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors">Delete Staff</button>
            ) : (
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors">Close</button>
            )}
          </div>
          <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer transition-colors">
            {staffMember ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddStaffDrawer;
