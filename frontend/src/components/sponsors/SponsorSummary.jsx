import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Search, ArrowUpDown, Filter } from 'lucide-react';
import AddSponsorDrawer from './AddSponsorDrawer';

const API_BASE_URL = "https://manitham-portal.onrender.com"; 

const SponsorSummary = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-newest');

  // Fetch data directly from DB using credentials (cookies)
  const fetchSponsors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, { 
        method: 'GET',
        credentials: 'include' 
      });
      const data = await response.json();
      if (data.success) {
        setSponsors(data.sponsors);
      }
    } catch (error) {
      console.error("Error retrieving sponsor logs:", error);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleOpenAddDrawer = () => {
    setEditingSponsor(null);
    setIsDrawerOpen(true);
  };

  const handleOpenUpdateDrawer = (sponsor) => {
    setEditingSponsor(sponsor);
    setIsDrawerOpen(true);
  };

  const handleSaveSponsor = async (sponsorData) => {
    try {
      if (editingSponsor) {
        const response = await fetch(`${API_BASE_URL}/update/${editingSponsor._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(sponsorData)
        });
        if (response.ok) fetchSponsors();
      } else {
        const response = await fetch(`${API_BASE_URL}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(sponsorData)
        });
        if (response.ok) fetchSponsors();
      }
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error writing data profile records:", error);
    }
  };

  const handleDeleteSponsor = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) fetchSponsors();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error clear record item execution:", error);
    }
  };

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'Food': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Money': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Clothes': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Medical': default: return 'bg-rose-50 text-rose-600 border border-rose-100';
    }
  };

  const processedSponsors = sponsors
    .filter((sponsor) => {
      const matchesSearch = sponsor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || sponsor.phone?.includes(searchQuery);
      const matchesType = typeFilter === 'All' || sponsor.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date-newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'name-az') return a.name.localeCompare(b.name);
      if (sortBy === 'name-za') return b.name.localeCompare(a.name);
      return 0;
    });
      return (
    <div className="p-2 relative">
      <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-2.5 text-slate-900">
          <Users size={22} className="stroke-[2.5]" /> 
          <h2 className="text-xl font-black tracking-wider uppercase">Sponsor Details</h2>
        </div>
        <button onClick={handleOpenAddDrawer} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer transition-all">
          <Plus size={16} className="stroke-[2.5]" />
          <span>Add Sponsor</span>
        </button>
      </div>

      {sponsors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 transition-colors" />
          </div>
          <div className="relative flex items-center">
            <Filter size={16} className="absolute left-3.5 text-slate-400" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer">
              <option value="All">All Types</option>
              <option value="Food">Food</option>
              <option value="Money">Money</option>
              <option value="Clothes">Clothes</option>
              <option value="Medical">Medical</option>
            </select>
          </div>
          <div className="relative flex items-center">
            <ArrowUpDown size={16} className="absolute left-3.5 text-slate-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer">
              <option value="date-newest">Date: Newest First</option>
              <option value="date-oldest">Date: Oldest First</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>
      )}

            {sponsors.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-fit mb-3"><Users size={28} /></div>
          <h3 className="text-base font-bold text-slate-700">No Sponsors Registered Yet</h3>
        </div>
      ) : processedSponsors.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-slate-500">No matching search entries found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 w-16 text-center">S.No</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Sponsor Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Sponsor Type </th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {processedSponsors.map((sponsor, index) => (
                  <tr key={sponsor._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 text-slate-400 text-center font-semibold">{index + 1}</td>
                    <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">{sponsor.date}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-800">{sponsor.name}</td>
                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{sponsor.phone}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col gap-0.5 items-start">
                        {/* FIX: Removed the rounded colored badge wrapper styles */}
                        <span className="font-semibold text-slate-700">
                          {sponsor.type}
                        </span>
                        {sponsor.type === 'Money' && sponsor.amount && (
                          <span className="text-xs text-slate-400 font-medium">
                            ₹{sponsor.amount} ({sponsor.paymentType})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-center">
                      <button onClick={() => handleOpenUpdateDrawer(sponsor)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl cursor-pointer transition-colors">
                        <Pencil size={12} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddSponsorDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveSponsor}
        onDelete={handleDeleteSponsor}
        editingSponsor={editingSponsor}
      />
    </div>
  );
};

export default SponsorSummary;
