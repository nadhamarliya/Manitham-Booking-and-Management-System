import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AppointmentDrawer = ({ isOpen, onClose, slot, onSave }) => {
  if (!isOpen) return null;

  const [name, setName] = useState(slot.booking?.name || '');
  const [phone, setPhone] = useState(slot.booking?.phone || '');
  const [status, setStatus] = useState(slot.status === 'Empty' ? 'Pending' : slot.status);

  useEffect(() => {
    setName(slot.booking?.name || '');
    setPhone(slot.booking?.phone || '');
    setStatus(slot.status === 'Empty' ? 'Pending' : slot.status);
  }, [slot]);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Core internal handler to save slot UI state changes locally
    onSave(slot.id, { 
      name, 
      phone, 
      status: status === 'Booked' ? 'Booked' : 'Pending' 
    });

    // 2. NEW LOGIC: Push allocation details to the Sponsor Summary dataset inside localStorage
    if (name.trim() && phone.trim()) {
      // Generate today's date formatted perfectly as YYYY-MM-DD
      const todayDateStr = new Date().toISOString().split('T')[0];

      // Pull current array from memory cache
      const storedSponsors = localStorage.getItem('manitham_sponsors');
      const activeSponsorsList = storedSponsors ? JSON.parse(storedSponsors) : [];

      // Construct a clean, matching database entity schema item 
      const newSponsorRow = {
        id: `appt-${Date.now()}`, // Prevent key collision conflicts
        date: todayDateStr,       // Current absolute date
        name: name.trim(),
        phone: phone.trim(),
        type: 'Food'              // Auto-assigned category type
      };

      // Push and overwrite memory cache state
      localStorage.setItem('manitham_sponsors', JSON.stringify([...activeSponsorsList, newSponsorRow]));
    }

    onClose();
  };

  const handleClearAllocation = () => {
    setName('');
    setPhone('');
    setStatus('Empty');
    onSave(slot.id, { name: '', phone: '', status: 'Empty' });
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Slot {slot.slotNumber}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{slot.slotName}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sponsor Name</label>
            <input 
              type="text" 
              required={status !== 'Empty'} 
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel" 
              required={status !== 'Empty'} 
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirmation Status</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStatus('Pending')}
                className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                  status === 'Pending'
                    ? 'bg-amber-50/50 border-amber-400 text-amber-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setStatus('Booked')}
                className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                  status === 'Booked'
                    ? 'bg-emerald-50/50 border-emerald-400 text-emerald-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Confirmed
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 mt-auto">
          <button 
            type="button" 
            onClick={handleClearAllocation}
            className="px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            Clear
          </button>

          <button 
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
          >
            Confirm
          </button>
        </div>
      </form>
    </>
  );
};

export default AppointmentDrawer;
