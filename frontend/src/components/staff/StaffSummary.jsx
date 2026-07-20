import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Pencil, Search, ArrowUpDown, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/authContext.jsx';
import axios from 'axios';
import AddStaffDrawer from './AddStaffDrawer';

const StaffSummary = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'user';

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // 🎯 Tracks the profile loaded into the drawer
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-az');

  // Fetch live staff list directly from MongoDB Atlas on page mount
  const fetchStaffData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/staff-list', { withCredentials: true });
      if (response.data.success) {
        setStaffList(response.data.staff);
      }
    } catch (err) {
      setError('Failed to sync directory from database.');
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleOpenAddDrawer = () => {
    if (userRole !== 'admin') return;
    setEditingStaff(null); // Clear previous edit states for clean creation modes
    setIsDrawerOpen(true);
  };

  const handleSaveStaffSuccess = () => {
    setIsDrawerOpen(false);
    setEditingStaff(null);
    fetchStaffData(); // Automatically refresh table rows after edits or updates complete
  };

  const handleDeleteStaff = async (id) => {
    if (userRole !== 'admin') return;
    if (window.confirm("Are you sure you want to delete this staff member's portal access?")) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/auth/delete-staff/${id}`, { withCredentials: true });
        if (response.data.success) {
          fetchStaffData();
        }
      } catch (err) {
        alert("Failed to remove user from database.");
      }
    }
  };

  const processedStaff = staffList
    .filter((member) => {
      return member.name?.toLowerCase().includes(searchQuery.toLowerCase()) || member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name-az') return a.name?.localeCompare(b.name);
      if (sortBy === 'name-za') return b.name?.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="p-2 relative">
      <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-2.5 text-slate-900">
          <ShieldAlert size={22} className="stroke-[2.5]" /> 
          <h2 className="text-xl font-black tracking-wider uppercase">Portal Access & Staff Registry</h2>
        </div>
        
        {userRole === 'admin' && (
          <button onClick={handleOpenAddDrawer} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer transition-all">
            <Plus size={16} className="stroke-[2.5]" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs font-semibold p-3 bg-red-50 rounded-xl border border-red-100 mb-4">{error}</p>}

      {staffList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input type="text" placeholder="Search by name or email ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 transition-colors" />
          </div>
          <div className="relative flex items-center">
            <ArrowUpDown size={16} className="absolute left-3.5 text-slate-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer">
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>
      )}

      {staffList.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-fit mb-3"><ShieldAlert size={28} /></div>
          <h3 className="text-base font-bold text-slate-700">No Staff Accounts Created Yet</h3>
        </div>
      ) : processedStaff.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-slate-500">No matching search credentials located</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 w-16 text-center">S.No</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email ID / Username</th>
                  <th className="px-6 py-4">System Role</th>
                  {userRole === 'admin' && <th className="px-6 py-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {processedStaff.map((member, index) => (
                  <tr key={member._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 text-slate-400 text-center font-semibold">{index + 1}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-800">{member.name}</td>
                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{member.email}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        member.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      }`}>
                        {member.role === 'admin' ? 'Admin' : 'Staff'}
                      </span>
                    </td>
                    
                    {userRole === 'admin' && (
                      <td className="px-6 py-3.5 whitespace-nowrap text-center space-x-2">
                        {/* 🎯 Updated interactive edit trigger passes member parameters into the context state layout */}
                        <button 
                          onClick={() => { setEditingStaff(member); setIsDrawerOpen(true); }} 
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-all"
                        >
                          <Pencil size={12} />
                          <span>Update</span>
                        </button>
                        <button onClick={() => handleDeleteStaff(member._id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer transition-all">
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {userRole === 'admin' && (
        <AddStaffDrawer
          isOpen={isDrawerOpen}
          onClose={() => { setIsDrawerOpen(false); setEditingStaff(null); }}
          onSaveSuccess={handleSaveStaffSuccess}
          staffMember={editingStaff} // 🎯 Forward tracking values down to the form fields modal
        />
      )}
    </div>
  );
};

export default StaffSummary;
