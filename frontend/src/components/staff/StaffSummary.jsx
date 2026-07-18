import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Pencil, Search, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import AddStaffDrawer from './AddStaffDrawer';

const StaffSummary = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  
  // Track visibility toggles for passwords inside table row strings independently using item index mappings
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [staffList, setStaffList] = useState(() => {
    const savedStaff = localStorage.getItem('manitham_staff');
    return savedStaff ? JSON.parse(savedStaff) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-az');

  useEffect(() => {
    localStorage.setItem('manitham_staff', JSON.stringify(staffList));
  }, [staffList]);

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleOpenAddDrawer = () => {
    setEditingStaff(null);
    setIsDrawerOpen(true);
  };

  const handleOpenUpdateDrawer = (member) => {
    setEditingStaff(member);
    setIsDrawerOpen(true);
  };

  const handleSaveStaff = (staffData) => {
    if (editingStaff) {
      setStaffList((prev) => 
        prev.map(item => item.id === editingStaff.id ? { ...item, ...staffData } : item)
      );
    } else {
      const newEntry = {
        id: `staff-${Date.now()}`,
        ...staffData
      };
      setStaffList((prev) => [...prev, newEntry]);
    }
    setIsDrawerOpen(false);
  };

  const handleDeleteStaff = (id) => {
    setStaffList((prev) => prev.filter(item => item.id !== id));
    setIsDrawerOpen(false);
  };

  const processedStaff = staffList
    .filter((member) => {
      return member.name?.toLowerCase().includes(searchQuery.toLowerCase()) || member.username?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name-az') return a.name.localeCompare(b.name);
      if (sortBy === 'name-za') return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="p-2 relative">
      <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-2.5 text-slate-900">
          <ShieldAlert size={22} className="stroke-[2.5]" /> 
          <h2 className="text-xl font-black tracking-wider uppercase">Portal Access & Staff Registry</h2>
        </div>
        <button onClick={handleOpenAddDrawer} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer transition-all">
          <Plus size={16} className="stroke-[2.5]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {staffList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input type="text" placeholder="Search by name or username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 transition-colors" />
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
                  <th className="px-6 py-4">Username ID</th>
                  <th className="px-6 py-4">Assigned Password</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {processedStaff.map((member, index) => {
                  let decryptedPassword = '';
                  try {
                    decryptedPassword = btoa && member.password ? atob(member.password) : member.password;
                  } catch(err) {
                    decryptedPassword = member.password;
                  }

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 text-slate-400 text-center font-semibold">{index + 1}</td>
                      <td className="px-6 py-3.5 font-bold text-slate-800">{member.name}</td>
                      <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{member.username}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span>{visiblePasswords[index] ? decryptedPassword : "••••••••"}</span>
                          <button type="button" onClick={() => togglePasswordVisibility(index)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                            {visiblePasswords[index] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          member.role === 'admin' 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        }`}>
                          {member.role === 'admin' ? 'Admin' : 'Staff'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-center">
                        <button onClick={() => handleOpenUpdateDrawer(member)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer">
                          <Pencil size={12} />
                          <span>Update</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddStaffDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveStaff}
        onDelete={handleDeleteStaff}
        staffMember={editingStaff}
      />
    </div>
  );
};

export default StaffSummary;
